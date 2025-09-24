document.addEventListener('DOMContentLoaded', () => {

    // Data structure for drills (from your provided code)
    const DRILL_DATA = [
        {
            category: "Full Swing Drills",
            drills: [
                {
                    name: "L-to-L Drill",
                    description: "Focus: **Swing Arc & Tempo**. Use a short iron. Swing back until your lead arm is parallel to the ground, forming an 'L'. Swing through to a finish where your trail arm is parallel to the ground, forming another 'L'. The motion should be slow and controlled. Why it helps: This drill teaches the core movements of the golf swing, promoting a consistent tempo and a wide, powerful arc without over-swinging.",
                },
                {
                    name: "The Towel Drill",
                    description: "Focus: **Connection**. Place a towel under both of your armpits and hit balls. The goal is to keep the towel from falling out during the swing. Why it helps: This drill forces your arms and body to work together as a single unit, preventing a common fault where the arms disconnect from the torso. This leads to more consistent ball striking and control.",
                },
                {
                    name: "Feet-Together Drill",
                    description: "Focus: **Balance & Center of Gravity**. Stand with your feet touching and make full swings with a mid-iron. You can start with half swings and build up to full swings. Why it helps: By eliminating your wide base, this drill forces you to rotate around your core and maintain perfect balance throughout the swing. It highlights any swaying or excessive movement.",
                }
            ]
        },
        {
            category: "Short Game Drills",
            drills: [
                {
                    name: "The 3-6-9 Drill",
                    description: "Focus: **Distance Control**. Set three targets at 3, 6, and 9 feet from the hole. Hit one ball to each target and repeat until you can consistently hit all three. Why it helps: This drill helps you dial in your putting stroke for different lengths, crucial for eliminating three-putts.",
                },
                {
                    name: "Chip-and-Stop Drill",
                    description: "Focus: **High/Soft Chips**. Find a target about 20-30 yards away. Practice hitting a high, soft chip that lands and stops quickly. Why it helps: This teaches you to use the loft of the club to your advantage and control the ball's trajectory and spin, essential for shots around the green.",
                }
            ]
        },
        {
            category: "Pre-Shot Routine",
            drills: [
                {
                    name: "Visualizing the Shot",
                    description: "Focus: **Mental Preparation**. Before you address the ball, stand behind it and visualize the entire shot. See the ball flying, landing, and rolling to its final position. Why it helps: This sharpens your focus, helps you commit to the shot, and builds confidence.",
                },
            ]
        }
    ];

    const drillsContainer = document.getElementById('drills-container');

    // Function to display all drills
    function displayDrills() {
        drillsContainer.innerHTML = ''; // Clear previous content
        DRILL_DATA.forEach(category => {
            const categorySection = document.createElement('div');
            categorySection.className = 'drill-category';
            categorySection.innerHTML = `<h3>${category.category}</h3>`;

            category.drills.forEach(drill => {
                const drillItem = document.createElement('div');
                drillItem.className = 'drill-item';
                drillItem.innerHTML = `
                    <h4>${drill.name}</h4>
                    <p>${drill.description.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</p>
                `;
                categorySection.appendChild(drillItem);
            });
            drillsContainer.appendChild(categorySection);
        });
    }

    // Function to generate and display a practice plan
    function generatePracticePlan() {
        const planOutput = document.getElementById('practice-plan-output');
        const plan = [
            "10-minute warm-up (stretches, light swings)",
            "20 minutes on **Full Swing Drills** (e.g., L-to-L, Towel Drill)",
            "15 minutes with mid-irons (7-iron, 8-iron)",
            "20 minutes on **Short Game Drills** (e.g., 3-6-9 Putting, Chipping)",
            "15 minutes on-course simulation (play imaginary holes from different spots)",
            "10-minute cool-down"
        ];
        
        planOutput.innerHTML = '<h4>Your Practice Plan:</h4><ul>' + plan.map(item => `<li>${item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>`).join('') + '</ul>';
    }

    // Journal functionality
    const addEntryButton = document.getElementById('add-entry-button');
    const journalList = document.getElementById('journal-list');

    addEntryButton.addEventListener('click', () => {
        const shotType = document.getElementById('shotType').value;
        const clubDetails = document.getElementById('clubDetails').value;
        const swingFeel = document.getElementById('swingFeel').value;
        const photoFile = document.getElementById('journalPhoto').files[0];

        if (shotType && clubDetails) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const newEntry = {
                    shotType,
                    clubDetails,
                    swingFeel,
                    date: new Date().toLocaleDateString(),
                    photoUrl: reader.result
                };
                saveJournalEntry(newEntry);
                displayJournalEntries();
            };
            if (photoFile) {
                reader.readAsDataURL(photoFile);
            } else {
                const newEntry = {
                    shotType,
                    clubDetails,
                    swingFeel,
                    date: new Date().toLocaleDateString(),
                    photoUrl: null
                };
                saveJournalEntry(newEntry);
                displayJournalEntries();
            }
            
            // Clear form
            document.getElementById('shotType').value = '';
            document.getElementById('clubDetails').value = '';
            document.getElementById('swingFeel').value = '';
            document.getElementById('journalPhoto').value = '';
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
