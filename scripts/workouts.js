document.addEventListener('DOMContentLoaded', () => {
    const workoutNameInput = document.getElementById('workout-name');
    const workoutSetsInput = document.getElementById('workout-sets');
    const workoutRepsInput = document.getElementById('workout-reps');
    const addWorkoutBtn = document.getElementById('add-workout-btn');
    const workoutTableBody = document.querySelector('#workout-table tbody');

    function renderWorkouts() {
        workoutTableBody.innerHTML = '';
        const workouts = JSON.parse(localStorage.getItem('workouts')) || [];
        workouts.forEach((workout, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${workout.name}</td>
                <td>${workout.sets}</td>
                <td>${workout.reps}</td>
                <td>
                    <button class="delete-btn" data-index="${index}">Delete</button>
                </td>
            `;
            workoutTableBody.appendChild(row);
        });

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.dataset.index;
                deleteWorkout(index);
            });
        });
    }

    function addWorkout() {
        const name = workoutNameInput.value.trim();
        const sets = workoutSetsInput.value.trim();
        const reps = workoutRepsInput.value.trim();

        if (!name || !sets || !reps) return;

        const workouts = JSON.parse(localStorage.getItem('workouts')) || [];
        workouts.push({ name, sets, reps });
        localStorage.setItem('workouts', JSON.stringify(workouts));

        workoutNameInput.value = '';
        workoutSetsInput.value = '';
        workoutRepsInput.value = '';

        renderWorkouts();
    }

    function deleteWorkout(index) {
        const workouts = JSON.parse(localStorage.getItem('workouts'));
        workouts.splice(index, 1);
        localStorage.setItem('workouts', JSON.stringify(workouts));
        renderWorkouts();
    }

    addWorkoutBtn.addEventListener('click', addWorkout);
    renderWorkouts();
});
