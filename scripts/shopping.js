document.addEventListener('DOMContentLoaded', () => {
    const addButtons = document.querySelectorAll('.add-item-btn');
    addButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const card = event.target.closest('.card');
            const categoryId = card.id;
            const inputField = card.querySelector('.new-item-input');
            const itemText = inputField.value.trim();

            if (itemText !== '') {
                addItem(categoryId, itemText);
                inputField.value = '';
            }
        });
    });

    document.querySelectorAll('.new-item-input').forEach(input => {
        input.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                const card = event.target.closest('.card');
                const categoryId = card.id;
                const itemText = input.value.trim();

                if (itemText !== '') {
                    addItem(categoryId, itemText);
                    input.value = '';
                }
            }
        });
    });

    loadLists();

    function addItem(categoryId, itemText, isCompleted = false) {
        const listContainer = document.querySelector(`#${categoryId} .list-items-container`);
        const listItem = document.createElement('div');
        listItem.classList.add('list-item');
        if (isCompleted) {
            listItem.classList.add('completed');
        }

        listItem.innerHTML = `
            <input type="checkbox" class="list-item-checkbox" ${isCompleted ? 'checked' : ''}>
            <span class="list-item-text">${itemText}</span>
            <div class="list-item-actions">
                <button class="delete-btn">x</button>
            </div>
        `;
        
        const checkbox = listItem.querySelector('.list-item-checkbox');
        checkbox.addEventListener('change', () => {
            listItem.classList.toggle('completed', checkbox.checked);
            saveLists();
        });

        const deleteButton = listItem.querySelector('.delete-btn');
        deleteButton.addEventListener('click', () => {
            listItem.remove();
            saveLists();
        });

        listContainer.appendChild(listItem);
        saveLists();
    }

    function saveLists() {
        const allLists = {};
        const categories = ['groceries-list', 'supplies-list', 'treat-yoself-list', 'gifts-list'];
        categories.forEach(categoryId => {
            const items = [];
            const listItems = document.querySelectorAll(`#${categoryId} .list-item`);
            listItems.forEach(item => {
                const text = item.querySelector('.list-item-text').textContent;
                const isCompleted = item.querySelector('.list-item-checkbox').checked;
                items.push({ text, isCompleted });
            });
            allLists[categoryId] = items;
        });
        localStorage.setItem('shoppingLists', JSON.stringify(allLists));
    }

    function loadLists() {
        const savedData = JSON.parse(localStorage.getItem('shoppingLists'));
        if (savedData) {
            for (const categoryId in savedData) {
                savedData[categoryId].forEach(item => {
                    addItem(categoryId, item.text, item.isCompleted);
                });
            }
        }
    }
});
