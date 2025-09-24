document.addEventListener('DOMContentLoaded', () => {
    // Select the "Add Round" and "Add Session" buttons
    const addRoundButton = document.querySelector('.add-round-button');
    const addSessionButton = document.querySelector('.add-session-button');
    const clearButton = document.querySelector('.clear-all-button');

    // Add a click listener to the "Add Round" button
    addRoundButton.addEventListener('click', () => {
        // Here you would add the code to prompt the user for data
        // For now, let's just create a dummy item to show it works
        const roundList = document.getElementById('golf-rounds-list');
        const newRound = document.createElement('div');
        newRound.className = 'data-item';
        newRound.textContent = `New Round: ${new Date().toLocaleDateString()}`;
        roundList.appendChild(newRound);
    });

    // Add a click listener to the "Add Session" button
    addSessionButton.addEventListener('click', () => {
        // Here you would add the code for practice session data
        const sessionList = document.getElementById('practice-sessions-list');
        const newSession = document.createElement('div');
        newSession.className = 'data-item';
        newSession.textContent = `New Session: ${new Date().toLocaleDateString()}`;
        sessionList.appendChild(newSession);
    });

    // Add a click listener to the "Clear All Golf Data" button
    clearButton.addEventListener('click', () => {
        const roundList = document.getElementById('golf-rounds-list');
        const sessionList = document.getElementById('practice-sessions-list');
        roundList.innerHTML = '';
        sessionList.innerHTML = '';
        alert('All golf data has been cleared.');
    });
});
