document.addEventListener('DOMContentLoaded', () => {
    const shoppingInput = document.getElementById('shopping-input');
    const addShoppingBtn = document.getElementById('add-shopping-btn');
    const shoppingList = document.getElementById('shopping-list');

    function renderShoppingList() {
        shoppingList.innerHTML = '';
        const items = JSON.parse(localStorage.getItem('shoppingList')) || [];
        items.forEach((item, index) => {
            const listItem = document.createElement('li');
            listItem.className = `shopping-item ${item.completed ? 'completed' : ''}`;
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = item.completed;
            checkbox.className = 'shopping-checkbox';
            checkbox.addEventListener('change', () => toggleShoppingItem(index));

            const textSpan = document.createElement('span');
            textSpan.textContent = item.text;

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => deleteShoppingItem(index));

            listItem.appendChild(checkbox);
            listItem.appendChild(textSpan);
            listItem.appendChild(deleteBtn);
            shoppingList.appendChild(listItem);
        });
    }

    function addShoppingItem() {
        const text = shoppingInput.value.trim();
        if (!text) return;

        const items = JSON.parse(localStorage.getItem('shoppingList')) || [];
        items.push({ text, completed: false });
        localStorage.setItem('shoppingList', JSON.stringify(items));
        shoppingInput.value = '';
        renderShoppingList();
    }

    function toggleShoppingItem(index) {
        const items = JSON.parse(localStorage.getItem('shoppingList'));
        items[index].completed = !items[index].completed;
        localStorage.setItem('shoppingList', JSON.stringify(items));
        renderShoppingList();
    }

    function deleteShoppingItem(index) {
        const items = JSON.parse(localStorage.getItem('shoppingList'));
        items.splice(index, 1);
        localStorage.setItem('shoppingList', JSON.stringify(items));
        renderShoppingList();
    }

    addShoppingBtn.addEventListener('click', addShoppingItem);
    shoppingInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addShoppingItem();
        }
    });

    renderShoppingList();
});
