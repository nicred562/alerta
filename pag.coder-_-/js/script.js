let tasks = [];

const taskInput = document.getElementById("taskInput");
const taskDescription = document.getElementById("taskDescription");
const taskPriority = document.getElementById("taskPriority");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const clearTasksBtn = document.getElementById("clearTasksBtn");
const priorityFilter = document.getElementById("priorityFilter");

addTaskBtn.addEventListener("click", addTask);
clearTasksBtn.addEventListener("click", clearTasks);
priorityFilter.addEventListener("change", filterTasks);

Swal.fire({
    title: "Custom animation with Animate.css",
    showClass: {
      popup: `
        animate__animated
        animate__zoomIn
      `
    },
    hideClass: {
      popup: `
        animate__animated
        animate__rotateOutDownRight
      `
    }
  });



function addTask() {
  const taskText = taskInput.value.trim();
  const descriptionText = taskDescription.value.trim();
  const priority = taskPriority.value;
  
  if (taskText !== "") {
    const newTask = { id: Date.now(), text: taskText, description: descriptionText, priority: priority, completed: false, isEditing: false };
    tasks.push(newTask);
    renderTasks();
    saveTasks();
    taskInput.value = "";
    taskDescription.value = "";
  }
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id); 
  renderTasks();
  saveTasks();
}

function toggleTaskCompletion(id) {
  const task = tasks.find(task => task.id === id);
  task.completed = !task.completed;
  renderTasks();
  saveTasks();
}

function editTask(id) {
  const task = tasks.find(task => task.id === id);
  task.isEditing = true; 
  renderTasks();
}

function saveEditTask(id) {
  const task = tasks.find(task => task.id === id);
  const editedTitle = document.getElementById(`edit-title-${id}`).value.trim();
  const editedDescription = document.getElementById(`edit-desc-${id}`).value.trim();
  
  if (editedTitle !== "") {
    task.text = editedTitle;
    task.description = editedDescription;
    task.isEditing = false;  
    renderTasks();
    saveTasks();
  }
}

function filterTasks() {
  renderTasks(priorityFilter.value);
}

function renderTasks(filter = "todas") {
  taskList.innerHTML = "";
  
  tasks
    .filter(task => filter === "todas" || task.priority === filter)
    .forEach(task => {
      const li = document.createElement("li");

      if (task.isEditing) {

        const editTitle = document.createElement("input");
        editTitle.type = "text";
        editTitle.id = `edit-title-${task.id}`;
        editTitle.value = task.text;

        const editDescription = document.createElement("textarea");
        editDescription.id = `edit-desc-${task.id}`;
        editDescription.value = task.description;

        const saveBtn = document.createElement("button");
        saveBtn.textContent = "Guardar";
        saveBtn.onclick = () => saveEditTask(task.id);

        li.appendChild(editTitle);
        li.appendChild(editDescription);
        li.appendChild(saveBtn);
      } else {

        const taskTitle = document.createElement("span");
        taskTitle.textContent = task.text;
        taskTitle.classList.toggle("task-completed", task.completed);
        
        const taskDescription = document.createElement("p");
        taskDescription.textContent = task.description;
        
        const priorityLabel = document.createElement("span");
        priorityLabel.textContent = task.priority.charAt(0).toUpperCase() + task.priority.slice(1);
        priorityLabel.classList.add("priority-label", task.priority);

        const toggleBtn = document.createElement("button");
        toggleBtn.textContent = task.completed ? "Desmarcar" : "Completar";
        toggleBtn.onclick = () => toggleTaskCompletion(task.id);

        const editBtn = document.createElement("button");
        editBtn.textContent = "Editar";
        editBtn.classList.add("edit-btn");
        editBtn.onclick = () => editTask(task.id);

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Eliminar";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.onclick = () => deleteTask(task.id);
        
        li.appendChild(taskTitle);
        li.appendChild(priorityLabel);
        li.appendChild(taskDescription);
        li.appendChild(toggleBtn);
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);
      }

      taskList.appendChild(li);
    });
}

function clearTasks() {
  tasks = [];
  renderTasks();
  saveTasks();
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const storedTasks = JSON.parse(localStorage.getItem("tasks"));
  if (storedTasks) {
    tasks = storedTasks;
    renderTasks();
  }
}




loadTasks();
