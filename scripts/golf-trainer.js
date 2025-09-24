document.addEventListener('DOMContentLoaded', () => {

    const DRIL_DATA = [
        {
            category: "Full Swing Drills",
            drills: [
                {
                    name: "L-to-L Drill",
                    description: "Focus: **Swing Arc & Tempo**. Set up with a short iron. Swing back until your lead arm is parallel to the ground, forming an 'L'. Swing through to a finish where your trail arm is parallel to the ground, forming another 'L'. The motion should be slow and controlled. Why it helps: This drill teaches the core movements of the golf swing, promoting a consistent tempo and a wide, powerful arc without over-swinging.",
                },
                {
                    name: "The Towel Drill",
                    description: "Focus: **Connection**. Place a towel under both of your armpits and hit balls. The goal is to keep the towel from falling out during the swing. Why it helps: This drill forces your arms and body to work together as a single unit, preventing a common fault where the arms disconnect from the torso. This leads to more consistent ball striking and control.",
                },
                {
                    name: "Feet-Together Drill",
                    description: "Focus: **Balance & Center of Gravity**. Stand with your feet touching and make full swings with a mid-iron. You can start with half swings and build up to full swings. Why it helps: By eliminating your wide base, this drill forces you to rotate around your core and maintain perfect balance throughout the swing. It highlights any swaying or excessive movement.",
                },
                {
                    name: "Pause at the Top Drill",
                    description: "Focus: **Tempo & Transition**. Take your normal swing, but when you reach the top of your backswing, pause for a full count of 'one-two' before starting your downswing. Why it helps: This drill eliminates a quick or rushed transition from backswing to downswing, which is a common cause of slices and poor contact. It promotes a smooth, unhurried tempo.",
                },
                {
                    name: "Gate Drill (for path)",
                    description: "Focus: **Swing Path**. Place two alignment sticks or two old clubs on the ground, one inside and one outside of the ball, creating a 'gate' for your clubhead to pass through. Why it helps: This drill provides immediate feedback on your swing path. If you hit the outside stick, you're swinging 'over the top.' If you hit the inside stick, you're swinging 'from the inside.' It’s a great way to correct a slice or a hook.",
                },
            ]
        },
        {
            category: "Short Game Drills",
            drills: [
                {
                    name: "The Ladder Drill (Chipping)",
                    description: "Focus: **Distance Control**. Set up five targets (e.g., towels) at 5-yard increments. Hit 3-5 balls to each target, trying to land them as close as possible. Why it helps: This drill trains your muscle memory for different chip shot distances. It’s a repetitive exercise that helps you gain confidence and consistency with your wedge.",
                },
                {
                    name: "Tee Gate Drill (Putting)",
                    description: "Focus: **Putting Path**. Place two tees in the ground slightly wider than your putter head, forming a gate. Practice putting through the gate without hitting the tees. Why it helps: This simple drill provides visual feedback on your putting stroke path, ensuring it stays square and on a straight line. It’s essential for consistent putts.",
                },
                {
                    name: "One-Handed Putting",
                    description: "Focus: **Feel & Control**. Practice putting with only your dominant hand, then switch to your non-dominant hand. Why it helps: This drill isolates the feel and rhythm of your stroke, teaching you to use your shoulders and not just your wrists. It’s excellent for developing a smooth, pendular motion.",
                },
            ]
        },
        {
            category: "Pre-Shot Routine",
            drills: [
                {
                    name: "The 3-Step Routine",
                    description: "Focus: **Consistency**. 1. **Visualize:** Picture the shot you want to hit. 2. **Practice:** Take a single practice swing that matches the feel of your visualized shot. 3. **Commit:** Step up to the ball and hit it without hesitation. Why it helps: A consistent pre-shot routine builds confidence and reduces anxiety. It prepares your mind and body to repeat the same motion every time you swing.",
                },
            ]
        }
    ];

    const plannerList = document.getElementById('planner-list');
    const journalForm = document.getElementById('journal-form');
    const journalList = document.getElementById('journal-list');

    // Display drills organized by category
    function displayDrills() {
        const drillListContainer = document.getElementById('drill-list');
        drillListContainer.innerHTML = '';
        DRIL_DATA.forEach(category => {
            const categoryHeading = document.createElement('h4');
            categoryHeading.textContent = category.category;
            categoryHeading.className = 'drill-category-heading';
            drillListContainer.appendChild(categoryHeading);

            category.drills.forEach(drill => {
                const drillElement = document.createElement('div');
                drillElement.className = 'drill-item';
                drillElement.innerHTML = `
                    <h5>${drill.name}</h5>
                    <p>${drill.description}</p>
                `;
                drillListContainer.appendChild(drillElement);
            });
        });
    }

    // Generate a structured practice plan
    function generatePracticePlan() {
        plannerList.innerHTML = '';
        const plan = [
            "1. **Warm-up** (5-10 mins): Stretching, light swings, and wedge shots.",
            "2. **Full Swing Drills** (15 mins): Focus on a specific drill (e.g., The L-to-L Drill).",
            "3. **Mid-irons** (15 mins): Hit shots with your 7-iron, focusing on feel and tempo.",
            "4. **Short Game** (15 mins): Focus on putting or chipping drills.",
            "5. **On-Course Simulation** (15 mins): Imagine playing a hole, hitting each shot from start to finish.",
            "6. **Cool-down** (5 mins): Light stretching and reflection."
        ];
        plan.forEach(step => {
            const stepElement = document.createElement('p');
            stepElement.innerHTML = step;
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
