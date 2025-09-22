document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const notesArea = document.getElementById('notes-area');

    // --- Task List Logic ---
    function renderTasks() {
        taskList.innerHTML = '';
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach((task, index) => {
            const taskItem = document.createElement('li');
            taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
            taskItem.dataset.index = index;

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = task.completed;
            checkbox.className = 'task-checkbox';
            checkbox.addEventListener('change', () => toggleTask(index));

            const taskText = document.createElement('span');
            taskText.textContent = task.text;

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-task-btn';
            deleteBtn.textContent = '×';
            deleteBtn.addEventListener('click', () => deleteTask(index));

            taskItem.appendChild(checkbox);
            taskItem.appendChild(taskText);
            taskItem.appendChild(deleteBtn);
            taskList.appendChild(taskItem);
        });
    }

    function addTask() {
        const text = taskInput.value.trim();
        if (text === '') return;

        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push({ text, completed: false });
        localStorage.setItem('tasks', JSON.stringify(tasks));
        taskInput.value = '';
        renderTasks();
    }

    function toggleTask(index) {
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        tasks[index].completed = !tasks[index].completed;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    }

    function deleteTask(index) {
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        tasks.splice(index, 1);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    }

    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    // --- Notes Logic ---
    notesArea.addEventListener('input', () => {
        localStorage.setItem('notes', notesArea.value);
    });

    function loadNotes() {
        notesArea.value = localStorage.getItem('notes') || '';
    }

    // Initial load
    renderTasks();
    loadNotes();
});
