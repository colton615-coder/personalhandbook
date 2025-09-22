document.addEventListener('DOMContentLoaded', () => {
    const calendarContainer = document.querySelector('.calendar-container');
    let currentDate = new Date();
    let events = JSON.parse(localStorage.getItem('calendarEvents')) || {};

    function renderCalendar() {
        calendarContainer.innerHTML = '';
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();
        const firstDayOfMonth = new Date(year, month, 1);
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const startDayOfWeek = firstDayOfMonth.getDay();

        const header = document.createElement('div');
        header.classList.add('calendar-header');
        header.innerHTML = `
            <button class="calendar-nav-btn" id="prev-btn">&lt;</button>
            <h3>${currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
            <button class="calendar-nav-btn" id="next-btn">&gt;</button>
        `;
        calendarContainer.appendChild(header);

        document.getElementById('prev-btn').addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        });

        document.getElementById('next-btn').addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        });

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

        const calendarGrid = document.createElement('div');
        calendarGrid.classList.add('calendar-grid');
        
        for (let i = 0; i < startDayOfWeek; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.classList.add('calendar-cell', 'inactive');
            calendarGrid.appendChild(emptyCell);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const cell = document.createElement('div');
            cell.classList.add('calendar-cell');
            cell.innerHTML = `<span class="calendar-cell-date">${day}</span>`;
            cell.dataset.date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            
            const today = new Date();
            if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                cell.classList.add('current-day');
            }

            const dateKey = cell.dataset.date;
            if (events[dateKey]) {
                const eventText = document.createElement('div');
                eventText.classList.add('calendar-event');
                eventText.textContent = events[dateKey];
                cell.appendChild(eventText);
            }
            
            cell.addEventListener('click', () => {
                const event = prompt('Enter a new event for this date:', events[dateKey] || '');
                if (event !== null) {
                    if (event.trim() === '') {
                        delete events[dateKey];
                    } else {
                        events[dateKey] = event.trim();
                    }
                    saveEvents();
                    renderCalendar();
                }
            });
            calendarGrid.appendChild(cell);
        }
        calendarContainer.appendChild(calendarGrid);
    }

    function saveEvents() {
        localStorage.setItem('calendarEvents', JSON.stringify(events));
    }
    
    renderCalendar();
});
