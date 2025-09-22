document.addEventListener('DOMContentLoaded', () => {

    // Select all the "Add Exercise" buttons
    const addExerciseButtons = document.querySelectorAll('.add-exercise-btn');

    // Add a click event listener to each button
    addExerciseButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const dayCard = event.target.closest('.card');
            const dayId = dayCard.id;
            addExercise(dayId);
        });
    });

    // Select the "Clear All Workouts" button
    const clearAllButton = document.querySelector('#clear-all-btn');
    if (clearAllButton) {
        clearAllButton.addEventListener('click', () => {
            localStorage.removeItem('myWorkouts');
            const allExerciseLists = document.querySelectorAll('.exercise-list');
            allExerciseLists.forEach(list => {
                list.innerHTML = '';
            });
        });
    }

    // Load saved workouts when the page loads
    loadWorkouts();

    // Function to create and add a new exercise input block
    function addExercise(dayId, exerciseName = '', setsReps = '', isCompleted = false) {
        const exerciseList = document.querySelector(`#${dayId} .exercise-list`);
        
        const exerciseItem = document.createElement('div');
        exerciseItem.classList.add('exercise-item');
        if (isCompleted) {
            exerciseItem.classList.add('completed');
        }

        exerciseItem.innerHTML = `
            <div class="checkbox-container">
                <input type="checkbox" ${isCompleted ? 'checked' : ''}>
            </div>
            <div class="exercise-item-content">
                <div class="exercise-item-row">
                    <input type="text" placeholder="Exercise Name" class="input-field exercise-name-input" value="${exerciseName}">
                </div>
                <div class="exercise-item-row sets-reps-container">
                    <input type="text" placeholder="Sets x Reps" class="input-field sets-reps-input" value="${setsReps}">
                </div>
            </div>
            <button class="button delete-btn">X</button>
        `;

        // Add a listener to the checkbox
        const checkbox = exerciseItem.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', () => {
            exerciseItem.classList.toggle('completed', checkbox.checked);
            saveWorkouts();
        });

        // Add listeners to the input fields to save changes
        const inputs = exerciseItem.querySelectorAll('input[type="text"]');
        inputs.forEach(input => {
            input.addEventListener('input', saveWorkouts);
        });

        // Add a listener to the new delete button
        const deleteButton = exerciseItem.querySelector('.delete-btn');
        deleteButton.addEventListener('click', () => {
            exerciseItem.remove();
            saveWorkouts();
        });

        exerciseList.appendChild(exerciseItem);
        saveWorkouts();
    }

    // Function to save all workouts to localStorage
    function saveWorkouts() {
        const allWorkouts = {};
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

        days.forEach(day => {
            const exerciseItems = document.querySelectorAll(`#${day} .exercise-item`);
            const dailyExercises = [];

            exerciseItems.forEach(item => {
                const name = item.querySelector('.exercise-name-input').value;
                const setsReps = item.querySelector('.sets-reps-input').value;
                const isCompleted = item.querySelector('input[type="checkbox"]').checked;

                dailyExercises.push({
                    name: name,
                    setsReps: setsReps,
                    isCompleted: isCompleted
                });
            });

            allWorkouts[day] = dailyExercises;
        });

        localStorage.setItem('myWorkouts', JSON.stringify(allWorkouts));
    }

    // Function to load workouts from localStorage
    function loadWorkouts() {
        const savedWorkouts = JSON.parse(localStorage.getItem('myWorkouts'));
        if (savedWorkouts) {
            for (const day in savedWorkouts) {
                savedWorkouts[day].forEach(exercise => {
                    addExercise(day, exercise.name, exercise.setsReps, exercise.isCompleted);
                });
            }
        }
    }
});
