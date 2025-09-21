// --- script.js ---

// -------------------------------------------------------------------
// IMPORTANT: REPLACE WITH YOUR OWN CREDENTIALS
// You must get these from the Google Cloud Console
// -------------------------------------------------------------------
const API_KEY = 'YOUR_API_KEY';
const CLIENT_ID = 'YOUR_CLIENT_ID';

const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest", "https://www.googleapis.com/discovery/v1/apis/tasks/v1/rest"];
const SCOPES = "https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/tasks.readonly";

const authButton = document.getElementById('auth-button');
const signoutButton = document.getElementById('signout-button');
const mainContent = document.getElementById('main-content');
const eventsContainer = document.getElementById('events-container');
const tasksContainer = document.getElementById('tasks-container');

let tokenClient;
let gapiInited = false;
let gisInited = false;

document.getElementById('date').innerText = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

function gapiLoaded() {
    gapi.load('client', initializeGapiClient);
}

async function initializeGapiClient() {
    await gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: DISCOVERY_DOCS,
    });
    gapiInited = true;
    maybeEnableButtons();
}

function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: '', // defined later
    });
    gisInited = true;
    maybeEnableButtons();
}

function maybeEnableButtons() {
    if (gapiInited && gisInited) {
        authButton.style.display = 'block';
    }
}

authButton.onclick = () => {
    tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) {
            throw (resp);
        }
        gapi.client.setToken({ 'access_token': resp.access_token });
        updateUI(true);
        loadApiData();
    };

    if (gapi.client.getToken() === null) {
        tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
        tokenClient.requestAccessToken({ prompt: '' });
    }
};

signoutButton.onclick = () => {
    const token = gapi.client.getToken();
    if (token !== null) {
        google.accounts.oauth2.revoke(token.access_token);
        gapi.client.setToken('');
        updateUI(false);
    }
};

function updateUI(isSignedIn) {
    authButton.style.display = isSignedIn ? 'none' : 'block';
    signoutButton.style.display = isSignedIn ? 'block' : 'none';
    mainContent.style.display = isSignedIn ? 'block' : 'none';
}

async function loadApiData() {
    // Load Calendar Events
    try {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const request = {
            'calendarId': 'primary',
            'timeMin': today.toISOString(),
            'timeMax': tomorrow.toISOString(),
            'showDeleted': false,
            'singleEvents': true,
            'orderBy': 'startTime'
        };
        const response = await gapi.client.calendar.events.list(request);
        const events = response.result.items;
        displayEvents(events);
    } catch (err) {
        eventsContainer.innerText = 'Error loading calendar events.';
        console.error(err);
    }

    // Load Tasks
    try {
        const taskListsResponse = await gapi.client.tasks.tasklists.list();
        const taskLists = taskListsResponse.result.items;
        let allTasks = [];
        if (taskLists && taskLists.length > 0) {
            for (const taskList of taskLists) {
                const tasksResponse = await gapi.client.tasks.tasks.list({
                    tasklist: taskList.id
                });
                const tasks = tasksResponse.result.items;
                if (tasks) {
                    allTasks = allTasks.concat(tasks);
                }
            }
        }
        displayTasks(allTasks);
    } catch (err) {
        tasksContainer.innerText = 'Error loading tasks.';
        console.error(err);
    }
}

function displayEvents(events) {
    eventsContainer.innerHTML = '';
    if (events.length > 0) {
        events.forEach(event => {
            const startTime = event.start.dateTime || event.start.date;
            const div = document.createElement('div');
            div.className = 'event';
            div.innerHTML = `<strong>${event.summary}</strong><br><small>${new Date(startTime).toLocaleTimeString()}</small>`;
            eventsContainer.appendChild(div);
        });
    } else {
        eventsContainer.innerText = 'No events today.';
    }
}

function displayTasks(tasks) {
    tasksContainer.innerHTML = '';
    if (tasks && tasks.length > 0) {
        tasks.forEach(task => {
            const div = document.createElement('div');
            div.className = 'task';
            div.innerHTML = `<input type="checkbox" ${task.status === 'completed' ? 'checked' : ''} disabled><span>${task.title}</span>`;
            tasksContainer.appendChild(div);
        });
    } else {
        tasksContainer.innerText = 'No tasks found.';
    }
}
