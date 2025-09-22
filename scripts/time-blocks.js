document.addEventListener('DOMContentLoaded', () => {
    const timeSlotsEl = document.getElementById('time-slots');

    // --- Time-Blocking Logic ---
    function generateTimeSlots() {
        const startHour = 8;
        const endHour = 20;

        for (let i = startHour; i < endHour; i++) {
            const timeSlotItem = document.createElement('li');
            timeSlotItem.className = 'time-slot';
            const timeLabel = document.createElement('span');
            timeLabel.className = 'time-label';
            const hour = i % 12 === 0 ? 12 : i % 12;
            const ampm = i < 12 ? 'AM' : 'PM';
            timeLabel.textContent = `${hour}:00 ${ampm}`;
            const inputField = document.createElement('input');
            inputField.type = 'text';
            inputField.className = 'time-slot-input input-field';
            inputField.placeholder = 'Plan your activity...';

            // Load saved data for this specific time slot
            const savedActivity = localStorage.getItem(`time-slot-${i}`);
            if (savedActivity) {
                inputField.value = savedActivity;
            }

            // Save data on input
            inputField.addEventListener('input', () => {
                localStorage.setItem(`time-slot-${i}`, inputField.value);
            });

            timeSlotItem.appendChild(timeLabel);
            timeSlotItem.appendChild(inputField);
            timeSlotsEl.appendChild(timeSlotItem);
        }
    }
    generateTimeSlots();
});
