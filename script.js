document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".formTodo"); // Форма добавления задач
  const input = form.querySelector('input[name="TaskToDo"]'); // Поле ввода для новых задач
  const wrapper = document.querySelector(".post-list"); // Список для задач

  // Функция для добавления задачи в список
  const addTask = (taskText, id) => {
    const taskItem = document.createElement("li");
    taskItem.textContent = taskText;
    if (id) taskItem.classList.add(`post-${id}`);
    const trashButton = document.createElement("button");
    trashButton.classList.add("remove-buttons");
    trashButton.innerHTML = `<img class="btnRemove" src="./trash.png" alt="trash">`;
    taskItem.append(trashButton);
    wrapper.appendChild(taskItem);
  };

  // Обработчик отправки формы для добавления новых задач
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const taskText = input.value.trim();
    if (taskText) {
      addTask(taskText);
      input.value = ""; // Очищаем поле после добавления
    }
  });

  // Загрузка и отображение задач из API
  async function fetchPosts() {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos?_limit=10"
      );
      const json = await response.json();
      json.forEach((post) => addTask(post.title, post.id));
      setupDeletePost();
    } catch (error) {
      console.error("Ошибка при получении данных:", error);
    }
  }

  // Настройка удаления задач
  const setupDeletePost = () => {
    const trashButtons = document.querySelectorAll(".remove-buttons");
    trashButtons.forEach((trashButton) => {
      trashButton.addEventListener("click", async () => {
        const postId = trashButton.parentNode.classList[0].split("-")[1];
        await deletePostFetch(postId);
        trashButton.parentNode.remove();
      });
    });
  };

  // Удаление задачи через API
  async function deletePostFetch(id) {
    try {
      await fetch(
        `https://jsonplaceholder.typicode.com/todos/${id}` || addTask,
        {
          method: "DELETE",
        }
      );
    } catch (error) {
      console.error("Ошибка при удалении поста:", error);
    }
  }

  fetchPosts();
});
