document.addEventListener('DOMContentLoaded', () => {
    
    // Select all "Add" buttons
    const addButtons = document.querySelectorAll('.add-item-btn');
    const clearButtons = document.querySelectorAll('.clear-list-btn');

    // Add click event listeners to each "Add" button
    addButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const card = event.target.closest('.card');
            const categoryId = card.id;
            const inputField = card.querySelector('.new-item-input');
            const itemText = inputField.value.trim();

            if (itemText !== '') {
                addItem(categoryId, itemText);
                inputField.value = ''; // Clear the input field
            }
        });
    });

    // Add "Enter" keypress event listener to all input fields
    document.querySelectorAll('.new-item-input').forEach(input => {
        input.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                const card = event.target.closest('.card');
                const categoryId = card.id;
                const itemText = input.value.trim();

                if (itemText !== '') {
                    addItem(categoryId, itemText);
                    input.value = ''; // Clear the input field
                }
            }
        });
    });

    // Add click event listeners to each "Clear" button
    clearButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const card = event.target.closest('.card');
            const categoryId = card.id;
            
            // Clear the list from localStorage
            const savedData = JSON.parse(localStorage.getItem('shoppingLists'));
            if (savedData && savedData[categoryId]) {
                delete savedData[categoryId];
                localStorage.setItem('shoppingLists', JSON.stringify(savedData));
            }
            
            // Clear the list from the DOM
            const listContainer = card.querySelector('.list-items-container');
            listContainer.innerHTML = '';
            updateChart();
        });
    });

    // Load saved shopping lists from localStorage
    loadLists();

    // Function to add a new item to a list
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
        
        // Add event listeners for the new item's checkbox and delete button
        const checkbox = listItem.querySelector('.list-item-checkbox');
        checkbox.addEventListener('change', () => {
            listItem.classList.toggle('completed', checkbox.checked);
            saveLists();
            updateChart();
        });

        const deleteButton = listItem.querySelector('.delete-btn');
        deleteButton.addEventListener('click', () => {
            listItem.remove();
            saveLists();
            updateChart();
        });

        listContainer.appendChild(listItem);
        saveLists();
        updateChart();
    }

    // Function to save all lists to localStorage
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

    // Function to load lists from localStorage
    function loadLists() {
        const savedData = JSON.parse(localStorage.getItem('shoppingLists'));
        if (savedData) {
            for (const categoryId in savedData) {
                savedData[categoryId].forEach(item => {
                    addItem(categoryId, item.text, item.isCompleted);
                });
            }
        }
        updateChart();
    }

    // --- Charting Functions ---
    const chartCanvas = document.getElementById('shopping-chart');
    let shoppingChart;

    function updateChart() {
        const savedData = JSON.parse(localStorage.getItem('shoppingLists'));
        const categories = ['groceries-list', 'supplies-list', 'treat-yoself-list', 'gifts-list'];
        const data = categories.map(category => (savedData && savedData[category]) ? savedData[category].length : 0);
        
        renderChart({ labels: ['Groceries', 'Supplies', 'TreatYoSelf', 'Gifts'], data: data });
    }

    function renderChart(chartData) {
        if (shoppingChart) {
            shoppingChart.destroy();
        }
        
        const config = {
            type: 'pie',
            data: {
                labels: chartData.labels,
                datasets: [{
                    label: 'Items',
                    data: chartData.data,
                    backgroundColor: [
                        '#3498db', // Primary
                        '#2ecc71', // Green
                        '#f39c12', // Orange
                        '#9b59b6'  // Purple
                    ],
                    borderColor: '#ffffff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Items per Category'
                    }
                }
            }
        };

        if (chartCanvas) {
            shoppingChart = new Chart(chartCanvas, config);
        }
    }
});
