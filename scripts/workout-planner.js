document.addEventListener('DOMContentLoaded', () => {
    const dailyWorkoutCardsContainer = document.getElementById('daily-workout-cards');
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    daysOfWeek.forEach(day => {
        const cardHTML = `
            <div class="glass-card daily-card">
                <div class="daily-header">
                    <h3 class="daily-heading">${day}</h3>
                    <button class="completed-button"><i class="fas fa-check"></i></button>
                </div>
                
                <div class="workout-list">
                    </div>
                
                <form class="add-exercise-form" data-day="${day}">
                    <div class="input-group">
                        <select class="form-input exercise-select">
                            <option value="">Select exercise...</option>
                            <option value="Running">Running</option>
                            <option value="Push-ups">Push-ups</option>
                            <option value="Squats">Squats</option>
                            <option value="Bench Press">Bench Press</option>
                        </select>
                    </div>
                    <div class="input-group">
                        <input type="number" class="form-input sets-input" placeholder="Sets">
                        <input type="number" class="form-input reps-input" placeholder="Reps">
                    </div>
                    <button type="submit" class="cta-button">Add Exercise</button>
                </form>
            </div>
        `;
        dailyWorkoutCardsContainer.innerHTML += cardHTML;
    });

    const addExerciseForms = document.querySelectorAll('.add-exercise-form');
    addExerciseForms.forEach(form => {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const day = event.target.dataset.day;
            const select = event.target.querySelector('.exercise-select');
            const setsInput = event.target.querySelector('.sets-input');
            const repsInput = event.target.querySelector('.reps-input');

            const exercise = select.value;
            const sets = setsInput.value;
            const reps = repsInput.value;

            if (exercise && sets && reps) {
                const workoutItemHTML = `
                    <div class="workout-item">
                        <span class="workout-name">${exercise}</span>
                        <div class="workout-details">
                            <span>Sets: ${sets}</span>
                            <span>Reps: ${reps}</span>
                        </div>
                        <button class="remove-button"><i class="fas fa-times"></i></button>
                    </div>
                `;
                const workoutList = form.closest('.daily-card').querySelector('.workout-list');
                workoutList.innerHTML += workoutItemHTML;

                select.value = "";
                setsInput.value = "";
                repsInput.value = "";

                // Save to local storage
                saveWorkoutPlan(day, workoutList.innerHTML);
            }
        });
    });

    // Handle completed and remove buttons
    document.addEventListener('click', (event) => {
        if (event.target.closest('.completed-button')) {
            const card = event.target.closest('.daily-card');
            card.classList.toggle('completed');
            const day = card.querySelector('.daily-heading').textContent;
            saveCompletedStatus(day, card.classList.contains('completed'));
        }

        if (event.target.closest('.remove-button')) {
            const workoutItem = event.target.closest('.workout-item');
            const card = workoutItem.closest('.daily-card');
            const day = card.querySelector('.daily-heading').textContent;
            
            workoutItem.remove();
            
            saveWorkoutPlan(day, card.querySelector('.workout-list').innerHTML);
        }
    });

    // Local Storage functions
    function saveWorkoutPlan(day, htmlContent) {
        localStorage.setItem(`workout-plan-${day}`, htmlContent);
    }
    
    function saveCompletedStatus(day, isCompleted) {
        localStorage.setItem(`workout-completed-${day}`, isCompleted);
    }

    function loadWorkoutPlan() {
        daysOfWeek.forEach(day => {
            const htmlContent = localStorage.getItem(`workout-plan-${day}`);
            const isCompleted = localStorage.getItem(`workout-completed-${day}`) === 'true';
            
            const card = document.querySelector(`[data-day="${day}"]`).closest('.daily-card');
            if (htmlContent) {
                card.querySelector('.workout-list').innerHTML = htmlContent;
            }
            if (isCompleted) {
                card.classList.add('completed');
            }
        });
    }

    loadWorkoutPlan();
});
