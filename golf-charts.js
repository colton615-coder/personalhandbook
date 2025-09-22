document.addEventListener('DOMContentLoaded', () => {
    const chartCanvas = document.getElementById('golf-chart');
    let golfChart;

    // This function will be called from golf.js to update the chart
    window.renderGolfChart = (rounds) => {
        if (golfChart) {
            golfChart.destroy();
        }

        const dates = rounds.map(round => round.date);
        const scores = rounds.map(round => round.score);

        const config = {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: 'Round Score',
                    data: scores,
                    backgroundColor: 'rgba(52, 152, 219, 0.6)',
                    borderColor: 'rgba(52, 152, 219, 1)',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                    }
                }
            }
        };

        if (chartCanvas) {
            golfChart = new Chart(chartCanvas, config);
        }
    };
});
