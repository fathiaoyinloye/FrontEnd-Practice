const homepageElement = document.getElementById("homepage");
const loginElement = document.getElementById("loginpage");
const mainElement = document.getElementById("mainpage");
const signUpURL = "http://localhost:8080/api/v1/user/signup";
const loginURL = "http://localhost:8080/api/v1/user/login";

const getUserDetails = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
  } catch (error) {
    console.log(error);
  }
};

if (homepageElement) {
  const userDetails = document.querySelector(".userDetails");
  const name = userDetails.querySelector("#name");
  const username = userDetails.querySelector("#username");
  const password = userDetails.querySelector("#password");
  const submitButton = userDetails.querySelector("button");
  const loginButton = document.querySelector(".login button");

  userDetails.addEventListener("submit", (e) => {
    console.log("Form submitted!");
    e.preventDefault();
    const nameValue = name.value;
    const usernameValue = username.value;
    const passwordValue = password.value;

    console.log(nameValue, usernameValue, passwordValue);
    signUpUser(nameValue, usernameValue, passwordValue);
  });

  loginButton.addEventListener("click", (click) => {
    window.location.href = "login.html";
  });

  function handleResponse(data) {
    console.log(" Success:", data);
    localStorage.setItem("username", data.username);
    localStorage.setItem("nameOfUser", data.name);
    window.location.href = "index.html";
  }

  function handleError(error) {
    console.log("Failed:", error);
    alert("Sing up Failed " + error.message);
  }

  async function signUpUser(nameValue, usernameValue, passwordValue) {
    try {
      const response = await fetch(signUpURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nameValue,
          username: usernameValue,
          password: passwordValue,
        }),
      });

      const data = await response.json();
      handleResponse(data);
      userDetails.reset();
    } catch (error) {
      handleError(error);
    }
  }
}

// LoginPage

if (loginElement) {
  const userDetails = document.querySelector(".userDetails");
  const username = userDetails.querySelector("#username");
  const password = userDetails.querySelector("#password");
  const submitButton = userDetails.querySelector("button");

  userDetails.addEventListener("submit", (e) => {
    console.log("Form submitted!");
    e.preventDefault();
    const usernameValue = username.value;
    const passwordValue = password.value;

    loginUser(usernameValue, passwordValue);
  });

  function handleResponse(data) {
    console.log(" Success:", data);
    localStorage.setItem("username", data.username);
    localStorage.setItem("nameOfUser", data.name);
    window.location.href = "index.html";
  }

  function handleError(error) {
    console.log("Failed:", error);
    alert("Sing up Failed " + error.message);
  }

  async function loginUser(usernameValue, passwordValue) {
    try {
      const response = await fetch(loginURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: usernameValue,
          password: passwordValue,
        }),
      });

      const data = await response.json();
      handleResponse(data);
      userDetails.reset();
    } catch (error) {
      handleError(error);
    }
  }
}

//mainpage
if (mainElement) {
  const displayMessage = document.querySelector(".container h1");
  const username = localStorage.getItem("username");
  const name = localStorage.getItem("nameOfUser");
  console.log(name);
  displayMessage.textContent = name + " Todo List";
  const addTaskURL = "http://localhost:8080/api/v1/user/addTask/" + username;
  const deleteTaskURL =
    "http://localhost:8080/api/v1/user/deleteTask/" + username;
  const updateTaskURL =
    "http://localhost:8080/api/v1/user/updateTask/" + username;
  const viewTaskURL = "http://localhost:8080/api/v1/user/viewTask/" + username;
  const viewALlTaskURL =
    "http://localhost:8080/api/v1/user/viewAllTask/" + username;
  const addTaskButton = document.querySelector(".AddTodo button");
  const popUp = document.querySelector(".popUp");
  const addNewTaskContainer = popUp.querySelector(".addNewTaskContainer");
  const viewTaskContainer = popUp.querySelector(".viewTaskContainer");
  const addNewTask = addNewTaskContainer.querySelector(".addNewTask");
  const addNewTaskButton =
    addNewTaskContainer.querySelector(".addNewTask button");
  const tasks = document.querySelector(".tasks");

  addTaskButton.addEventListener("click", (click) => {
    click.preventDefault();
    closeNewTask(addNewTaskContainer);
  });

  addNewTask.addEventListener("submit", (click) => {
    click.preventDefault();
    const title = addNewTask.querySelector("input").value;
    const description = addNewTask.querySelector("textarea").value;
    addToTask(title, description);
  });

  async function addToTask(title, description) {
    try {
      const response = await fetch(addTaskURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: username,
          description: description,
          title: title,
        }),
      });

      const data = await response.json();
      console.log(data);
      addTaskContainer(data.title, data.id);
      addNewTask.reset();
      closeNewTask(addNewTaskContainer);
    } catch (error) {
      console.log("Failed:", error);
      alert("Add Task " + error.message);
    }
  }

  function closeNewTask(element) {
    if (addNewTaskContainer.style.visibility == "visible")
      element.style.visibility = "hidden";
    else element.style.visibility = "visible";
  }

  function closeViewTask(element) {
    if (viewTaskContainer.style.visibility == "visible")
      element.style.visibility = "hidden";
    else element.style.visibility = "visible";
  }

  function truncateText(text, maxLength) {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  }

  function addTaskContainer(text, taskId) {
    text = truncateText(text, 23);
    const newTask = document.createElement("div");
    newTask.className = "newTask";
    newTask.dataset.taskId = taskId;

    const newTaskButton = document.createElement("div");
    newTaskButton.className = "newTaskButton";

    const li = document.createElement("li");
    li.textContent = text;

    newTaskButton.innerHTML = `
        <button type="button" class= "edit">✏️</button>
        <button type="button" class= "view">👁️</button >
        <button type="button" class= "delete">🗑️</button id="delete">
    `;

    newTask.appendChild(li);
    newTask.appendChild(newTaskButton);
    tasks.appendChild(newTask);
  }

  async function loadTasks() {
    try {
      const response = await fetch(viewALlTaskURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: username }),
      });

      const tasksResponse = await response.json();

      tasksResponse.forEach((task) => {
        addTaskContainer(task.title, task.id);
      });
    } catch (error) {
      console.log("Error loading tasks:", error);
      alert(error.message);
    }
  }
  async function deleteTask(taskId) {
    try {
      const response = await fetch(deleteTaskURL, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: username, id: taskId }),
      });

      const deleteResponse = await response.json();
      alert(deleteResponse.message);
    } catch (error) {
      console.log("Error loading tasks:", error);
      alert(error.message);
    }
  }

  async function viewTask(taskId) {
    try {
      const response = await fetch(viewTaskURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: username, id: taskId }),
      });

      const viewResponse = await response.json();
      const titleContainer = document.querySelector(".viewTaskContainer h1");
      const descriptionContainer = document.querySelector(".viewTaskContainer h3");
      const timeContainer = document.querySelector(".viewTaskContainer h4");
      console.log(viewResponse.title)
      titleContainer.textContent = viewResponse.title;
      descriptionContainer.textContent = viewResponse.description;
      timeContainer.textContent = "Date Added is: " + viewResponse.dateCreated;
      console.log(viewResponse)
      
    } catch (error) {
      console.log("Error loading tasks:", error);
      alert(error.message);
    }
  }

  tasks.addEventListener("click", (element) => {
    const taskDiv = element.target.closest(".newTask");

    if (!taskDiv) return;

    const taskId = taskDiv.dataset.taskId;

    if (element.target.classList.contains("edit")) {
    }

    if (element.target.classList.contains("view")) {
        console.log("View task:", taskId);
        viewTask(taskId);
        closeViewTask(viewTaskContainer);
    }

    if (element.target.classList.contains("delete")) {
      deleteTask(taskId);
      tasks.removeChild(taskDiv);
    }
  });

 
   function logout() {
  localStorage.clear();
  window.location.href = "index.html";

  
}

  loadTasks();
}
