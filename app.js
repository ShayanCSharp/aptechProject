let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
const taskForm = document.getElementById("taskForm");
const taskList = document.querySelector(".task-list");
const searchInput = document.getElementById("search");

const saveTasks = () => localStorage.setItem("tasks", JSON.stringify(tasks));

const displayTasks = (tasksToDisplay) => {
  taskList.innerHTML = "";
  tasksToDisplay.forEach((task, index) => {
    const taskDiv = document.createElement("div");
    taskDiv.className = `task ${task.completed ? "completed" : ""}`;
    taskDiv.innerHTML = `
            <div class="task-details">
                <p><strong>Title:</strong> ${task.title}</p>
                <p><strong>Description:</strong> ${task.description}</p>
                <p><strong>Category:</strong> ${task.category}</p>
                <p><strong>Priority:</strong> ${task.priority}</p>
                <p><strong>Date:</strong> ${task.date}</p>
            </div>
            <div class="task-actions">
                <span class="toggle-status" data-index="${index}">${
      task.completed ? "Mark as Pending" : "Mark as Completed"
    }</span>
                <span class="edit" data-index="${index}">Edit</span>
                <span class="delete" data-index="${index}">Delete</span>
            </div>
        `;
    taskList.appendChild(taskDiv);
  });
};

const editTask = (index) => {
  const task = tasks[index];
  document.getElementById("taskName").value = task.title;
  document.getElementById("taskDes").value = task.description;
  document.getElementById("selectCate").value = task.category;
  document.getElementById("selectPriority").value = task.priority;
  document.getElementById("date").value = task.date;

  taskForm.removeEventListener("submit", addTask);
  taskForm.addEventListener("submit", (e) => saveEdit(e, index));
};

const saveEdit = (e, index) => {
  e.preventDefault();
  tasks[index] = {
    title: document.getElementById("taskName").value,
    description: document.getElementById("taskDes").value,
    category: document.getElementById("selectCate").value,
    priority: document.getElementById("selectPriority").value,
    date: document.getElementById("date").value,
    completed: tasks[index].completed,
  };
  saveTasks();
  displayTasks(tasks);
  taskForm.reset();
  taskForm.removeEventListener("submit", (e) => saveEdit(e, index));
  taskForm.addEventListener("submit", addTask);
};

const addTask = (e) => {
  e.preventDefault();
  const newTask = {
    title: document.getElementById("taskName").value,
    description: document.getElementById("taskDes").value,
    category: document.getElementById("selectCate").value,
    priority: document.getElementById("selectPriority").value,
    date: document.getElementById("date").value,
    completed: false,
  };
  tasks.push(newTask);
  saveTasks();
  displayTasks(tasks);
  taskForm.reset();

  
};

taskForm.addEventListener("submit", addTask);

taskList.addEventListener("click", (e) => {
  if (e.target.classList.contains("toggle-status")) {
    const index = e.target.dataset.index;
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    displayTasks(tasks);
  } else if (e.target.classList.contains("delete")) {
    const index = e.target.dataset.index;
    tasks.splice(index, 1);
    saveTasks();
    displayTasks(tasks);
  } else if (e.target.classList.contains("edit")) {
    const index = e.target.dataset.index;
    editTask(index);
  }
});

const filterAndDisplayTasks = () => {
  const searchTerm = searchInput.value.toLowerCase();
  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchTerm) ||
      task.description.toLowerCase().includes(searchTerm)
  );
  displayTasks(filteredTasks);
};

searchInput.addEventListener("input", filterAndDisplayTasks);

displayTasks(tasks);

// Function to filter and display tasks
const filterTasks = () => {
  let filteredTasks = tasks;

  // Filter by status
  const filterCompleted = document.getElementById("filter-completed").checked;
  const filterPending = document.getElementById("filter-pending").checked;

  if (filterCompleted) {
    filteredTasks = filteredTasks.filter((task) => task.completed);
  }

  if (filterPending) {
    filteredTasks = filteredTasks.filter((task) => !task.completed);
  }

  // Filter by priority
  const filterLow = document.getElementById("filter-low").checked;
  const filterMedium = document.getElementById("filter-medium").checked;
  const filterHigh = document.getElementById("filter-high").checked;

  if (filterLow || filterMedium || filterHigh) {
    filteredTasks = filteredTasks.filter(
      (task) =>
        (filterLow && task.priority === "low") ||
        (filterMedium && task.priority === "medium") ||
        (filterHigh && task.priority === "high")
    );
  }

  // Function to display tasks
  displayTasks(filteredTasks);
};

// Event listeners for filter checkboxes
document
  .querySelectorAll('.filter-section input[type="checkbox"]')
  .forEach((checkbox) => {
    checkbox.addEventListener("change", filterTasks);
  });

// Call filterTasks initially to display all tasks
filterTasks();
