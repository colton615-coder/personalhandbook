document.addEventListener('DOMContentLoaded', () => {

    const addTimeBlockBtn = document.querySelector('.add-time-block-btn');
    const clearListBtn = document.querySelector('.clear-list-btn');

    addTimeBlockBtn.addEventListener('click', () => {
        addTimeBlock();
    });

    clearListBtn.addEventListener('click', () => {
        localStorage.removeItem('timeBlocks');
        document.querySelector('.time-block-list').innerHTML = '';
    });

    loadTimeBlocks();

    function addTimeBlock(data = {}) {
        const timeBlockList = document.querySelector('.time-block-list');

        const timeBlockItem = document.createElement('div');
        timeBlockItem.classList.add('time-block-item');

        timeBlockItem.innerHTML = `
            <div class="time-block-content">
                <input type="time" class="input-field time-input" value="${data.time || ''}">
                <input type="text" class="input-field activity-input" placeholder="Plan your activity..." value="${data.activity || ''}">
            </div>
            <button class="button delete-btn">X</button>
        `;

        const deleteButton = timeBlockItem.querySelector('.delete-btn');
        deleteButton.addEventListener('click', () => {
            timeBlockItem.remove();
            saveTimeBlocks();
        });

        const inputs = timeBlockItem.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('input', saveTimeBlocks);
        });

        timeBlockList.appendChild(timeBlockItem);
        saveTimeBlocks();
    }

    function saveTimeBlocks() {
        const timeBlockItems = document.querySelectorAll('.time-block-item');
        const allBlocks = [];
        timeBlockItems.forEach(item => {
            const time = item.querySelector('.time-input').value;
            const activity = item.querySelector('.activity-input').value;
            allBlocks.push({ time, activity });
        });
        localStorage.setItem('timeBlocks', JSON.stringify(allBlocks));
    }

    function loadTimeBlocks() {
        const savedBlocks = JSON.parse(localStorage.getItem('timeBlocks'));
        if (savedBlocks) {
            savedBlocks.forEach(block => {
                addTimeBlock(block);
            });
        }
    }
});
