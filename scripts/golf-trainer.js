document.addEventListener('DOMContentLoaded', () => {

    const DRIL_DATA = [
        {
            name: "The L-to-L Drill",
            description: "Why it helps: Teaches you to maintain a smooth, controlled swing arc and proper wrist hinge. Focuses on the arm position at the start and end of the swing.",
        },
        {
            name: "The Towel Drill",
            description: "Why it helps: Keeps your arms and body connected through the swing. Prevents the common fault of separating your arms from your chest, leading to better consistency.",
        },
        {
            name: "One-Handed Swing Drill",
            description: "Why it helps: Forces you to rely on your core and body rotation rather than just your arms. Builds strength and feel for the proper swing path.",
        }
    ];

    const plannerList = document.getElementById('planner-list');
    const journalForm = document.getElementById('journal-form');
    const journalList = document.getElementById('journal-list');

    // Display drills
    function displayDrills() {
        const drillList = document.getElementById('drill-list');
        drillList.innerHTML = '';
        DRIL_DATA.forEach(drill => {
            const drillElement = document.createElement('div');
            drillElement.className = 'drill-item';
            drillElement.innerHTML = `
                <h4>${drill.name}</h4>
                <p>${drill.description}</p>
            `;
            drillList.appendChild(drillElement);
        });
    }

    // Generate a practice plan
    function generatePracticePlan() {
        plannerList.innerHTML = '';
        const plan = [
            "Warm-up: 5 minutes of stretching and wedges.",
            "Long Game: 10 minutes on the L-to-L Drill.",
            "Mid-irons: 15 minutes hitting your 7-iron.",
            "Short Game: 10 minutes on putting drills.",
            "Cool-down: 5 minutes of light stretching."
        ];
        plan.forEach(step => {
            const stepElement = document.createElement('p');
            stepElement.textContent = `• ${step}`;
            plannerList.appendChild(stepElement);
        });
    }

    // Handle journal entry submission
    journalForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const shotType = document.getElementById('shot-type').value;
        const clubDetails = document.getElementById('club-details').value;
        const swingFeel = document.getElementById('swing-feel').value;
        const photoUrl = document.getElementById('photo-url').value;
        
        if (shotType && clubDetails) {
            const newEntry = {
                shotType,
                clubDetails,
                swingFeel,
                photoUrl,
                date: new Date().toLocaleDateString()
            };
            saveJournalEntry(newEntry);
            displayJournalEntries();
            journalForm.reset();
        } else {
            alert('Please fill out at least the shot type and club details.');
        }
    });

    // Save entry to local storage
    function saveJournalEntry(entry) {
        let entries = JSON.parse(localStorage.getItem('golfJournal')) || [];
        entries.unshift(entry);
        localStorage.setItem('golfJournal', JSON.stringify(entries));
    }

    // Display all journal entries
    function displayJournalEntries() {
        const entries = JSON.parse(localStorage.getItem('golfJournal')) || [];
        journalList.innerHTML = '';
        if (entries.length === 0) {
            journalList.innerHTML = `<p class="placeholder">No entries yet. Start a new one!</p>`;
        }
        entries.forEach(entry => {
            const entryElement = document.createElement('div');
            entryElement.className = 'journal-entry-item';
            entryElement.innerHTML = `
                <h4>${entry.shotType} | ${entry.clubDetails}</h4>
                <p class="entry-date">${entry.date}</p>
                <p class="entry-feel"><strong>Feel:</strong> ${entry.swingFeel || 'N/A'}</p>
                ${entry.photoUrl ? `<img src="${entry.photoUrl}" alt="Swing Photo" class="journal-photo">` : ''}
            `;
            journalList.appendChild(entryElement);
        });
    }

    document.getElementById('generate-plan-button').addEventListener('click', generatePracticePlan);

    // Initial load
    displayDrills();
    displayJournalEntries();
});
