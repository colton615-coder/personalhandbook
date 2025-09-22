document.addEventListener('DOMContentLoaded', () => {
    const calendarContainer = document.querySelector('.calendar-container');

    // Get the current date
    let currentDate = new Date();

    // Function to render the calendar
    function renderCalendar() {
        // Clear existing calendar content
        calendarContainer.innerHTML = '';

        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();
        const firstDayOfMonth = new Date(year, month, 1);
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const startDayOfWeek = firstDayOfMonth.getDay();

        // Create the calendar header (Month and Year)
        const header = document.createElement('div');
        header.classList.add('calendar-header');
        header.innerHTML = `
            <button class="calendar-nav-btn" id="prev-btn">&lt;</button>
            <h3>${currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
            <button class="calendar-nav-btn" id="next-btn">&gt;</button>
        `;
        calendarContainer.appendChild(header);

        // Add event listeners for navigation buttons
        document.getElementById('prev-btn').addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        });

        document.getElementById('next-btn').addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        });

        // Create the weekdays header
        const weekdayHeader = document.createElement('div');
        weekdayHeader.classList.add('calendar-grid');
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        weekdays.forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.classList.add('weekday-header');
            dayElement.textContent = day;
            weekdayHeader.appendChild(dayElement);
        });
        calendarContainer.appendChild(weekdayHeader);

        // Create the calendar grid for the days
        const calendarGrid = document.createElement('div');
        calendarGrid.classList.add('calendar-grid');
        
        // Add inactive cells for days from the previous month
        for (let i = 0; i < startDayOfWeek; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.classList.add('calendar-cell', 'inactive');
            calendarGrid.appendChild(emptyCell);
        }

        // Add cells for the days of the current month
        for (let day = 1; day <= daysInMonth; day++) {
            const cell = document.createElement('div');
            cell.classList.add('calendar-cell');
            cell.innerHTML = `<span class="calendar-cell-date">${day}</span>`;
            
            // Highlight the current day
            const today = new Date();
            if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                cell.classList.add('current-day');
            }

            calendarGrid.appendChild(cell);
        }

        calendarContainer.appendChild(calendarGrid);
    }
    
    // Initial render of the calendar
    renderCalendar();
});
