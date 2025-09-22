document.addEventListener('DOMContentLoaded', () => {
    const addRoundBtn = document.querySelector('.add-round-btn');
    const addSessionBtn = document.querySelector('.add-session-btn');
    const clearAllBtn = document.querySelector('.clear-all-golf-btn');

    if (addRoundBtn) addRoundBtn.addEventListener('click', () => addEntry('rounds'));
    if (addSessionBtn) addSessionBtn.addEventListener('click', () => addEntry('sessions'));
    
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', () => {
            localStorage.removeItem('golfData');
            document.querySelector('#golf-rounds .golf-entry-list').innerHTML = '';
            document.querySelector('#practice-sessions .golf-entry-list').innerHTML = '';
            window.renderGolfChart([]); // Clear the chart
        });
    }

    loadEntries();

    function addEntry(type, data = {}) {
        const listContainer = document.querySelector(`.${type}-list`);
        
        const entryItem = document.createElement('div');
        entryItem.classList.add('golf-entry-item');

        let innerHTML = '';
        if (type === 'rounds') {
            innerHTML = `
                <div class="golf-entry-item-row">
                    <label class="golf-entry-label">Course:</label>
                    <input type="text" class="input-field golf-course-input" placeholder="Course Name" value="${data.course || ''}">
                </div>
                <div class="golf-entry-item-row">
                    <label class="golf-entry-label">Date:</label>
                    <input type="date" class="input-field golf-date-input" value="${data.date || ''}">
                </div>
                <div class="golf-entry-item-row">
                    <label class="golf-entry-label">Score:</label>
                    <input type="number" class="input-field golf-score-input" placeholder="Total Score" value="${data.score || ''}">
                </div>
                <div>
                    <label class="golf-notes-label">Notes:</label>
                    <textarea class="textarea-field golf-notes-input" placeholder="Add notes about your round">${data.notes || ''}</textarea>
                </div>
                <button class="button delete-entry-btn">Delete</button>
            `;
        } else if (type === 'sessions') {
            innerHTML = `
                <div class="golf-entry-item-row">
                    <label class="golf-entry-label">Date:</label>
                    <input type="date" class="input-field golf-date-input" value="${data.date || ''}">
                </div>
                <div>
                    <label class="golf-notes-label">Session Details:</label>
                    <textarea class="textarea-field golf-notes-input" placeholder="Range session, drills, etc.">${data.notes || ''}</textarea>
                </div>
                <button class="button delete-entry-btn">Delete</button>
            `;
        }
        
        entryItem.innerHTML = innerHTML;
        listContainer.appendChild(entryItem);

        const inputs = entryItem.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', saveEntries);
        });

        const deleteButton = entryItem.querySelector('.delete-entry-btn');
        deleteButton.addEventListener('click', () => {
            entryItem.remove();
            saveEntries();
        });
    }

    function saveEntries() {
        const rounds = [];
        document.querySelectorAll('#golf-rounds .golf-entry-item').forEach(item => {
            rounds.push({
                course: item.querySelector('.golf-course-input').value,
                date: item.querySelector('.golf-date-input').value,
                score: item.querySelector('.golf-score-input').value,
                notes: item.querySelector('.golf-notes-input').value
            });
        });

        const sessions = [];
        document.querySelectorAll('#practice-sessions .golf-entry-item').forEach(item => {
            sessions.push({
                date: item.querySelector('.golf-date-input').value,
                notes: item.querySelector('.golf-notes-input').value
            });
        });

        localStorage.setItem('golfData', JSON.stringify({ rounds, sessions }));
        
        // Update the chart whenever data changes
        const savedData = JSON.parse(localStorage.getItem('golfData'));
        window.renderGolfChart(savedData.rounds);
    }

    function loadEntries() {
        const savedData = JSON.parse(localStorage.getItem('golfData'));
        if (savedData) {
            savedData.rounds.forEach(round => addEntry('rounds', round));
            savedData.sessions.forEach(session => addEntry('sessions', session));
            window.renderGolfChart(savedData.rounds); // Render chart on load
        }
    }
});
