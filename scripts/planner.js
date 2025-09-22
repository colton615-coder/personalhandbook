document.addEventListener('DOMContentLoaded', () => {
    const timeSlotsEl = document.getElementById('time-slots');
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const notesArea = document.getElementById('notes-area');

    // --- Time-Blocking Logic ---
    function generateTimeSlots() {
        const startHour = 8;
        const endHour = 20;

        for (let i = startHour; i < endHour; i++) {
            const timeSlotItem = document.createElement('li');
            timeSlotItem.className = 'time-slot';
            const timeLabel = document.createElement('span');
            timeLabel.className = 'time-label';
            const hour = i % 12 === 0 ? 12 : i % 12;
            const ampm = i < 12 ? 'AM' : 'PM';
            timeLabel.textContent = `${hour}:00 ${ampm}`;
            const inputField = document.createElement('input');
            inputField.type = 'text';
            inputField.className = 'time-slot-input input-field';
            inputField.placeholder = 'Plan your activity...';

            timeSlotItem.appendChild(timeLabel);
            timeSlotItem.appendChild(inputField);
            timeSlotsEl.appendChild(timeSlotItem);
        }
    }
    generateTimeSlots();

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
