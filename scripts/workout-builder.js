// A list of pre-defined workouts with their types
const WORKOUTS_LIST = {
    cardio: [
        "Running",
        "Cycling",
        "Swimming",
        "Jumping Jacks",
        "High Knees"
    ],
    strength: [
        "Push-ups",
        "Squats",
        "Deadlifts",
        "Bench Press",
        "Pull-ups",
        "Bicep Curls"
    ],
    flexibility: [
        "Yoga",
        "Stretching",
        "Pilates"
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    // Populate the dropdowns with exercises
    const exerciseSelects = document.querySelectorAll('.exercise-select');

    exerciseSelects.forEach(selectElement => {
        // Create an option for each workout type
        for (const type in WORKOUTS_LIST) {
            const optgroup = document.createElement('optgroup');
            optgroup.label = type.charAt(0).toUpperCase() + type.slice(1);
            
            WORKOUTS_LIST[type].forEach(workout => {
                const option = document.createElement('option');
                option.value = workout;
                option.textContent = workout;
                optgroup.appendChild(option);
            });

            selectElement.appendChild(optgroup);
        }
    });

    // Handle adding exercises
    document.querySelectorAll('.add-exercise-button').forEach(button => {
        button.addEventListener('click', (event) => {
            const card = event.target.closest('.glass-card');
            const selectedExercise = card.querySelector('.exercise-select').value;
            const sets = card.querySelector('.sets-input').value;
            const reps = card.querySelector('.reps-input').value;

            if (selectedExercise && sets && reps) {
                // Find or create the list container for the workouts
                let workoutList = card.querySelector('.workout-list');
                if (!workoutList) {
                    workoutList = document.createElement('ul');
                    workoutList.className = 'workout-list';
                    // Insert the list before the add button
                    card.insertBefore(workoutList, button);
                }

                // Create the new list item
                const newWorkoutItem = document.createElement('li');
                newWorkoutItem.className = 'workout-item';
                newWorkoutItem.innerHTML = `
                    <span>${selectedExercise}</span>
                    <span>Sets: ${sets}</span>
                    <span>Reps: ${reps}</span>
                    <button class="remove-button">X</button>
                `;
                workoutList.appendChild(newWorkoutItem);

                // Clear input fields after adding
                card.querySelector('.exercise-select').value = '';
                card.querySelector('.sets-input').value = '';
                card.querySelector('.reps-input').value = '';

                // Attach a click listener to the new remove button
                newWorkoutItem.querySelector('.remove-button').addEventListener('click', (e) => {
                    e.target.closest('li').remove();
                });

            } else {
                alert("Please select an exercise and enter sets/reps.");
            }
        });
    });

    // Handle removing individual exercises
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-button') && event.target.closest('.workout-item')) {
            event.target.closest('.workout-item').remove();
        }
    });

    // Handle the "Clear All Workouts" button
    document.querySelector('.clear-all-button').addEventListener('click', () => {
        document.querySelectorAll('.workout-list').forEach(list => {
            list.innerHTML = ''; // Clears all list items
        });
    });
});
