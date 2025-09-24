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
                    <input type="date" class="input-field golf-date-input" value="${data.date || new Date().toISOString().split('T')[0]}">
                </div>
                <div class="golf-entry-item-row">
                    <label class="golf-entry-label">Score:</label>
                    <input type="number" class="input-field golf-score-input" placeholder="Score" value="${data.score || ''}">
                </div>
            `;
        } else { // type === 'sessions'
            innerHTML = `
                <div class="golf-entry-item-row">
                    <label class="golf-entry-label">Date:</label>
                    <input type="date" class="input-field golf-date-input" value="${data.date || new Date().toISOString().split('T')[0]}">
                </div>
            `;
        }
        
        innerHTML += `
            <div class="golf-entry-item-row">
                <label class="golf-entry-label">Notes:</label>
                <textarea class="input-field golf-notes-input" placeholder="What did you work on?">${data.notes || ''}</textarea>
            </div>
            <div class="golf-entry-actions">
                <button class="save-entry-btn btn">Save</button>
                <button class="delete-entry-btn btn btn-danger">Delete</button>
            </div>
        `;

        entryItem.innerHTML = innerHTML;
        listContainer.prepend(entryItem);
        
        entryItem.querySelector('.save-entry-btn').addEventListener('click', saveEntries);
        entryItem.querySelector('.delete-entry-btn').addEventListener('click', () => {
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

    // Chart.js implementation (moved from your golf.js file)
    let golfChart;

    window.renderGolfChart = function(rounds) {
        const ctx = document.getElementById('golfChart').getContext('2d');
        const sortedRounds = rounds.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        const labels = sortedRounds.map(round => round.date);
        const scores = sortedRounds.map(round => round.score);

        if (golfChart) {
            golfChart.destroy();
        }

        golfChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Round Score',
                    data: scores,
                    backgroundColor: 'rgba(52, 152, 219, 0.2)',
                    borderColor: 'rgba(52, 152, 219, 1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: false,
                        title: {
                            display: true,
                            text: 'Score'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                    }
                }
            }
        });
    };
});
