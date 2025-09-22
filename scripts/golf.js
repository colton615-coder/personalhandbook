document.addEventListener('DOMContentLoaded', () => {
    const golfScoreInput = document.getElementById('golf-score');
    const golfNotesInput = document.getElementById('golf-notes');
    const addScoreBtn = document.getElementById('add-score-btn');
    const golfTableBody = document.querySelector('#golf-table tbody');

    function renderGolfRounds() {
        golfTableBody.innerHTML = '';
        const golfRounds = JSON.parse(localStorage.getItem('golfRounds')) || [];
        golfRounds.forEach((round, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${round.date}</td>
                <td>${round.score}</td>
                <td>${round.notes}</td>
                <td>
                    <button class="delete-btn" data-index="${index}">Delete</button>
                </td>
            `;
            golfTableBody.appendChild(row);
        });

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.dataset.index;
                deleteGolfRound(index);
            });
        });
    }

    function addGolfRound() {
        const score = golfScoreInput.value.trim();
        const notes = golfNotesInput.value.trim() || 'No notes';

        if (!score) return;

        const golfRounds = JSON.parse(localStorage.getItem('golfRounds')) || [];
        const date = new Date().toLocaleDateString();
        golfRounds.push({ date, score, notes });
        localStorage.setItem('golfRounds', JSON.stringify(golfRounds));

        golfScoreInput.value = '';
        golfNotesInput.value = '';

        renderGolfRounds();
    }

    function deleteGolfRound(index) {
        const golfRounds = JSON.parse(localStorage.getItem('golfRounds'));
        golfRounds.splice(index, 1);
        localStorage.setItem('golfRounds', JSON.stringify(golfRounds));
        renderGolfRounds();
    }

    addScoreBtn.addEventListener('click', addGolfRound);
    renderGolfRounds();
});
