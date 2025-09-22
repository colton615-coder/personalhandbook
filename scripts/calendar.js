document.addEventListener('DOMContentLoaded', () => {
    const calendarContainer = document.querySelector('.calendar-container');
    const chartCanvas = document.getElementById('calendar-chart');
    let calendarChart;

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
        updateChart();
    }

    function saveEvents() {
        localStorage.setItem('calendarEvents', JSON.stringify(events));
        updateChart();
    }
    
    // --- Charting Functions ---
    function updateChart() {
        const savedData = JSON.parse(localStorage.getItem('calendarEvents')) || {};
        
        const monthlyEventCounts = {};
        for (const date in savedData) {
            const month = date.substring(5, 7);
            const year = date.substring(0, 4);
            const key = `${year}-${month}`;
            monthlyEventCounts[key] = (monthlyEventCounts[key] || 0) + 1;
        }

        const labels = [];
        const data = [];
        const sortedKeys = Object.keys(monthlyEventCounts).sort();

        sortedKeys.forEach(key => {
            const [year, month] = key.split('-');
            const monthName = new Date(year, month - 1, 1).toLocaleString('default', { month: 'short' });
            labels.push(`${monthName} '${year.substring(2, 4)}`);
            data.push(monthlyEventCounts[key]);
        });
        
        renderChart({ labels: labels, data: data });
    }

    function renderChart(chartData) {
        if (calendarChart) {
            calendarChart.destroy();
        }
        
        const config = {
            type: 'bar',
            data: {
                labels: chartData.labels,
                datasets: [{
                    label: 'Events per Month',
                    data: chartData.data,
                    backgroundColor: 'rgba(52, 152, 219, 0.6)',
                    borderColor: 'rgba(52, 152, 219, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        };

        if (chartCanvas) {
            calendarChart = new Chart(chartCanvas, config);
        }
    }

    renderCalendar();
});
