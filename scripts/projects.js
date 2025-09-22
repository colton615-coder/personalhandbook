document.addEventListener('DOMContentLoaded', () => {
    // Project Tracker
    const projectTitleInput = document.getElementById('project-title-input');
    const projectDescInput = document.getElementById('project-desc-input');
    const addProjectBtn = document.getElementById('add-project-btn');
    const projectList = document.getElementById('project-list');

    // Goals
    const goalsArea = document.getElementById('goals-area');

    // Habit Tracker
    const habitInput = document.getElementById('habit-input');
    const addHabitBtn = document.getElementById('add-habit-btn');
    const habitList = document.getElementById('habit-list');

    // --- Project Tracker Logic ---
    function renderProjects() {
        projectList.innerHTML = '';
        const projects = JSON.parse(localStorage.getItem('projects')) || [];
        projects.forEach(project => {
            const projectItem = document.createElement('div');
            projectItem.className = 'project-item';
            projectItem.innerHTML = `
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
            `;
            projectList.appendChild(projectItem);
        });
    }

    function addProject() {
        const title = projectTitleInput.value.trim();
        const description = projectDescInput.value.trim();
        if (!title) return;

        const projects = JSON.parse(localStorage.getItem('projects')) || [];
        projects.push({ title, description });
        localStorage.setItem('projects', JSON.stringify(projects));
        projectTitleInput.value = '';
        projectDescInput.value = '';
        renderProjects();
    }

    addProjectBtn.addEventListener('click', addProject);

    // --- Goals Logic ---
    function loadGoals() {
        goalsArea.value = localStorage.getItem('goals') || '';
    }

    goalsArea.addEventListener('input', () => {
        localStorage.setItem('goals', goalsArea.value);
    });

    // --- Habit Tracker Logic ---
    function renderHabits() {
        habitList.innerHTML = '';
        const habits = JSON.parse(localStorage.getItem('habits')) || [];
        habits.forEach((habit, index) => {
            const habitItem = document.createElement('li');
            habitItem.className = 'habit-item';
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'habit-checkbox';
            checkbox.checked = habit.completed;
            checkbox.addEventListener('change', () => toggleHabit(index));
            
            const habitText = document.createElement('span');
            habitText.textContent = habit.text;

            habitItem.appendChild(checkbox);
            habitItem.appendChild(habitText);
            habitList.appendChild(habitItem);
        });
    }

    function addHabit() {
        const text = habitInput.value.trim();
        if (!text) return;
        const habits = JSON.parse(localStorage.getItem('habits')) || [];
        habits.push({ text, completed: false });
        localStorage.setItem('habits', JSON.stringify(habits));
        habitInput.value = '';
        renderHabits();
    }

    function toggleHabit(index) {
        const habits = JSON.parse(localStorage.getItem('habits'));
        habits[index].completed = !habits[index].completed;
        localStorage.setItem('habits', JSON.stringify(habits));
        renderHabits();
    }

    addHabitBtn.addEventListener('click', addHabit);

    // Initial load of all data
    renderProjects();
    loadGoals();
    renderHabits();
});
