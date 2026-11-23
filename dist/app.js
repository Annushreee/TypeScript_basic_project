"use strict";
// Get HTML elements
const taskForm = document.getElementById("task-form");
const taskNameInput = document.getElementById("task-name");
const dueDateInput = document.getElementById("due-date");
const taskList = document.getElementById("task-list");
const emptyMessage = document.getElementById("empty-message");
// Load saved tasks from localStorage
let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
// Display tasks on the page
function renderTasks() {
    taskList.innerHTML = "";
    emptyMessage.style.display =
        tasks.length === 0 ? "block" : "none";
    tasks.forEach((task) => {
        const li = document.createElement("li");
        li.className = "task-item";
        if (task.completed) {
            li.classList.add("completed");
        }
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.setAttribute("aria-label", `Mark ${task.name} as completed`);
        checkbox.addEventListener("change", () => {
            toggleTask(task.id);
        });
        const details = document.createElement("div");
        details.className = "task-details";
        const name = document.createElement("p");
        name.className = "task-name";
        name.textContent = task.name;
        const date = document.createElement("p");
        date.className = "task-date";
        date.textContent = `Due: ${task.dueDate}`;
        details.appendChild(name);
        details.appendChild(date);
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";
        deleteButton.addEventListener("click", () => {
            deleteTask(task.id);
        });
        li.appendChild(checkbox);
        li.appendChild(details);
        li.appendChild(deleteButton);
        taskList.appendChild(li);
    });
}
// Add a new task
function addTask(name, dueDate) {
    const newTask = {
        id: Date.now(),
        name: name,
        dueDate: dueDate,
        completed: false
    };
    tasks.push(newTask);
    saveTasks();
    renderTasks();
}
// Toggle task completion
function toggleTask(id) {
    tasks = tasks.map((task) => task.id === id
        ? Object.assign(Object.assign({}, task), { completed: !task.completed }) : task);
    saveTasks();
    renderTasks();
}
// Delete a task
function deleteTask(id) {
    tasks = tasks.filter((task) => task.id !== id);
    saveTasks();
    renderTasks();
}
// Handle form submission
taskForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = taskNameInput.value.trim();
    const dueDate = dueDateInput.value;
    if (!name || !dueDate) {
        alert("Please enter a task name and due date.");
        return;
    }
    addTask(name, dueDate);
    taskForm.reset();
});
// Display saved tasks when the page loads
renderTasks();
