document.addEventListener('DOMContentLoaded', () => {

    const addProjectBtn = document.querySelector('.add-project-btn');
    const clearListBtn = document.querySelector('.clear-list-btn');

    addProjectBtn.addEventListener('click', () => {
        addProject();
    });

    clearListBtn.addEventListener('click', () => {
        localStorage.removeItem('projects');
        document.querySelector('.project-list').innerHTML = '';
    });

    loadProjects();

    function addProject(data = {}) {
        const projectList = document.querySelector('.project-list');

        const projectItem = document.createElement('div');
        projectItem.classList.add('project-item');

        projectItem.innerHTML = `
            <div class="project-content">
                <input type="text" class="input-field project-name-input" placeholder="Project Name" value="${data.name || ''}">
            </div>
            <button class="button delete-btn">X</button>
        `;

        const deleteButton = projectItem.querySelector('.delete-btn');
        deleteButton.addEventListener('click', () => {
            projectItem.remove();
            saveProjects();
        });

        const input = projectItem.querySelector('.project-name-input');
        input.addEventListener('input', saveProjects);

        projectList.appendChild(projectItem);
        saveProjects();
    }

    function saveProjects() {
        const projectItems = document.querySelectorAll('.project-item');
        const allProjects = [];
        projectItems.forEach(item => {
            const name = item.querySelector('.project-name-input').value;
            allProjects.push({ name });
        });
        localStorage.setItem('projects', JSON.stringify(allProjects));
    }

    function loadProjects() {
        const savedProjects = JSON.parse(localStorage.getItem('projects'));
        if (savedProjects) {
            savedProjects.forEach(project => {
                addProject(project);
            });
        }
    }
});
