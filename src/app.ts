
// Define the structure of a task
interface Task {
    id: number;
    name: string;
    dueDate: string;
    completed: boolean;
}

// Get HTML elements
const taskForm = document.getElementById("task-form") as HTMLFormElement;
const taskNameInput = document.getElementById("task-name") as HTMLInputElement;
const dueDateInput = document.getElementById("due-date") as HTMLInputElement;
const taskList = document.getElementById("task-list") as HTMLUListElement;
const emptyMessage = document.getElementById("empty-message") as HTMLParagraphElement;

// Load saved tasks from localStorage
let tasks: Task[] = JSON.parse(
    localStorage.getItem("tasks") || "[]"
);

// Save tasks to localStorage
function saveTasks(): void {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Display tasks on the page
function renderTasks(): void {
    taskList.innerHTML = "";

    emptyMessage.style.display =
        tasks.length === 0 ? "block" : "none";

    tasks.forEach((task: Task) => {
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
function addTask(name: string, dueDate: string): void {
    const newTask: Task = {
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
function toggleTask(id: number): void {
    tasks = tasks.map((task: Task) =>
        task.id === id
            ? { ...task, completed: !task.completed }
            : task
    );

    saveTasks();
    renderTasks();
}

// Delete a task
function deleteTask(id: number): void {
    tasks = tasks.filter((task: Task) => task.id !== id);

    saveTasks();
    renderTasks();
}

// Handle form submission
taskForm.addEventListener("submit", (event: SubmitEvent) => {
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
