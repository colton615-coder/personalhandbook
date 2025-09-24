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
            optgroup.label = type.charAt(0).toUpperCase() + type.slice(1); // Capitalize the type
            
            WORKOUTS_LIST[type].forEach(workout => {
                const option = document.createElement('option');
                option.value = workout;
                option.textContent = workout;
                optgroup.appendChild(option);
            });

            selectElement.appendChild(optgroup);
        }
    });

    // Add event listeners for the 'Add Exercise' buttons
    const addButtons = document.querySelectorAll('.add-exercise-button');
    addButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const card = event.target.closest('.glass-card');
            const selectedExercise = card.querySelector('.exercise-select').value;
            const sets = card.querySelector('.sets-input').value;
            const reps = card.querySelector('.reps-input').value;

            // Simple validation to ensure something is selected
            if (selectedExercise && sets && reps) {
                console.log(`Adding exercise: ${selectedExercise}, Sets: ${sets}, Reps: ${reps}`);
                // In a real app, you would add this to a list on the page
                // For now, we'll just log it to the console
                alert(`Added: ${selectedExercise} | Sets: ${sets} | Reps: ${reps}`);
            } else {
                alert("Please select an exercise and enter sets/reps.");
            }
        });
    });
});
