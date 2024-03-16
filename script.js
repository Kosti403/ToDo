document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".formTodo");
  const input = form.querySelector('input[name="TaskToDo"]');
  const wrapper = document.querySelector(".post-list");

  async function fetchPosts() {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos?_limit=10"
      );
      const tasks = await response.json();
      tasks.forEach((task) => {
        addTaskToDOM(task.title, task.id);
      });
    } catch (error) {
      console.error("Ошибка при получении задач:", error);
    }
  }

  async function addTask(taskText) {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos",
        {
          method: "POST",
          body: JSON.stringify({
            title: taskText,
            userId: 1,
            completed: false,
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );
      const task = await response.json();
      addTaskToDOM(task.title, task.id);
    } catch (error) {
      console.error("Ошибка при добавлении задачи:", error);
    }
  }

  function addTaskToDOM(taskText, id) {
    const taskItem = document.createElement("li");
    taskItem.textContent = taskText;
    taskItem.classList.add(`post-${id}`);
    const trashButton = document.createElement("button");
    trashButton.classList.add("remove-buttons");
    trashButton.innerHTML = `<img class="btnRemove" src="./trash.png" alt="trash">`;
    taskItem.append(trashButton);
    wrapper.appendChild(taskItem);
    setupDeleteButton(trashButton, id);
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const taskText = input.value.trim();
    if (taskText) {
      addTask(taskText);
      input.value = "";
    }
  });

  const setupDeletePost = () => {
    document.querySelectorAll(".remove-buttons").forEach((button) => {
      const postId = button.closest("li").classList[0].split("-")[1];
      setupDeleteButton(button, postId);
    });
  };

  function setupDeleteButton(button, postId) {
    button.addEventListener("click", async () => {
      await deletePostFetch(postId);
      button.parentNode.remove();
    });
  }

  async function deletePostFetch(id) {
    try {
      await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Ошибка при удалении поста:", error);
    }
  }

  async function initApp() {
    await fetchPosts();
    setupDeletePost();
  }

  initApp();
});
