document.addEventListener('DOMContentLoaded', () => {
    const logRoundForm = document.getElementById('log-round-form');
    const roundsList = document.getElementById('rounds-list');
    const scorecardGrid = document.getElementById('scorecard-grid');

    // Generate scorecard inputs for all 18 holes
    for (let i = 1; i <= 18; i++) {
        const holeDiv = document.createElement('div');
        holeDiv.className = 'hole-input-group';
        holeDiv.innerHTML = `
            <label>Hole ${i}</label>
            <input type="number" class="form-input score-input" placeholder="Score">
        `;
        scorecardGrid.appendChild(holeDiv);
    }

    // Load existing rounds from local storage
    loadRounds();

    logRoundForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const courseName = document.getElementById('course-name').value;
        const roundNotes = document.getElementById('round-notes').value;
        const scoreInputs = document.querySelectorAll('.score-input');
        
        const scores = [];
        let totalScore = 0;
        let isComplete = true;

        scoreInputs.forEach(input => {
            const score = parseInt(input.value);
            if (isNaN(score)) {
                isComplete = false;
            }
            scores.push(score);
            totalScore += score;
        });

        if (courseName && isComplete) {
            const newRound = {
                course: courseName,
                scores: scores,
                totalScore: totalScore,
                notes: roundNotes,
                date: new Date().toLocaleDateString()
            };

            addRoundToDOM(newRound);
            saveRoundToLocalStorage(newRound);
            logRoundForm.reset();
        } else {
            alert('Please fill out all fields with valid numbers.');
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
                    <span class="stat-value">${round.totalScore}</span>
                    <span>Total Score</span>
                </div>
            </div>
            <button class="expand-button"><i class="fas fa-chevron-down"></i></button>
            <div class="round-details-expandable" style="display: none;">
                <div class="scorecard-detail-grid">
                    ${round.scores.map((score, index) => `
                        <div class="hole-detail">
                            <span class="hole-number">Hole ${index + 1}</span>
                            <span class="hole-score">${score}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="notes-detail">
                    <p>Notes:</p>
                    <p>${round.notes || 'No notes for this round.'}</p>
                </div>
            </div>
        `;
        roundsList.prepend(roundItem);

        const expandButton = roundItem.querySelector('.expand-button');
        const expandableContent = roundItem.querySelector('.round-details-expandable');

        expandButton.addEventListener('click', () => {
            if (expandableContent.style.display === "none") {
                expandableContent.style.display = "block";
                expandButton.innerHTML = `<i class="fas fa-chevron-up"></i>`;
            } else {
                expandableContent.style.display = "none";
                expandButton.innerHTML = `<i class="fas fa-chevron-down"></i>`;
            }
        });
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
