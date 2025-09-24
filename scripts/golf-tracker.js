document.addEventListener('DOMContentLoaded', () => {
    const logRoundForm = document.getElementById('log-round-form');
    const roundsList = document.getElementById('rounds-list');

    // Load existing rounds from local storage
    loadRounds();

    logRoundForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const courseName = document.getElementById('course-name').value;
        const score = document.getElementById('score').value;
        const putts = document.getElementById('putts').value;
        const fairways = document.getElementById('fairways').value;

        if (courseName && score && putts && fairways) {
            const newRound = {
                course: courseName,
                score: score,
                putts: putts,
                fairways: fairways,
                date: new Date().toLocaleDateString()
            };

            addRoundToDOM(newRound);
            saveRoundToLocalStorage(newRound);
            logRoundForm.reset();
        } else {
            alert('Please fill out all fields.');
        }
    });

    function addRoundToDOM(round) {
        // Remove placeholder if it exists
        const placeholder = roundsList.querySelector('.placeholder');
        if (placeholder) {
            placeholder.remove();
        }

        const roundItem = document.createElement('div');
        roundItem.className = 'round-item';
        roundItem.innerHTML = `
            <div>
                <h4>${round.course}</h4>
                <p>${round.date}</p>
            </div>
            <div class="round-stats">
                <div class="stat">
                    <span class="stat-value">${round.score}</span>
                    <span>Score</span>
                </div>
                <div class="stat">
                    <span class="stat-value">${round.putts}</span>
                    <span>Putts</span>
                </div>
                <div class="stat">
                    <span class="stat-value">${round.fairways}</span>
                    <span>Fairways</span>
                </div>
            </div>
        `;
        roundsList.prepend(roundItem);
    }

    function saveRoundToLocalStorage(round) {
        let rounds = JSON.parse(localStorage.getItem('golfRounds')) || [];
        rounds.unshift(round);
        localStorage.setItem('golfRounds', JSON.stringify(rounds));
    }

    function loadRounds() {
        const rounds = JSON.parse(localStorage.getItem('golfRounds')) || [];
        if (rounds.length > 0) {
            const placeholder = roundsList.querySelector('.placeholder');
            if (placeholder) {
                placeholder.remove();
            }
            rounds.forEach(round => addRoundToDOM(round));
        }
    }
});
