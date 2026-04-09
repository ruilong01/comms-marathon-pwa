/**
 * dashboard.js
 * Handles UI interactions on the Dashboard page.
 */

// -- Elements --
const openSettingsBtn = document.getElementById('open-settings-btn');
const settingsModal = document.getElementById('settings-modal');
const geminiKeyInput = document.getElementById('gemini-key');
const githubPatInput = document.getElementById('github-pat');
const gistIdInput = document.getElementById('gist-id');
const saveSettingsBtn = document.getElementById('save-settings-btn');
const backupBtn = document.getElementById('backup-btn');
const syncBtn = document.getElementById('sync-btn');

const createModuleBtn = document.getElementById('create-module-btn');
const createModal = document.getElementById('create-modal');
const closeCreateBtn = document.getElementById('close-create-btn');

const newModuleNameInput = document.getElementById('new-module-name');
const generateBtn = document.getElementById('generate-btn');
const loadingState = document.getElementById('loading-state');
const loadingText = document.getElementById('loading-text');
const modulesList = document.getElementById('modules-list');

// Initialize
function init() {
    renderModules();
    
    // Load keys
    const savedKey = localStorage.getItem('GEMINI_API_KEY');
    if (savedKey) geminiKeyInput.value = savedKey;

    const savedGH = localStorage.getItem('GH_PAT');
    if (savedGH) githubPatInput.value = savedGH;
    
    const savedGist = localStorage.getItem('GIST_ID');
    if (savedGist) gistIdInput.value = savedGist;

    // Events
    openSettingsBtn.addEventListener('click', () => settingsModal.classList.add('active'));
    settingsModal.addEventListener('click', (e) => {
        if(e.target === settingsModal) settingsModal.classList.remove('active');
    });
    
    saveSettingsBtn.addEventListener('click', () => {
        localStorage.setItem('GEMINI_API_KEY', geminiKeyInput.value.trim());
        localStorage.setItem('GH_PAT', githubPatInput.value.trim());
        localStorage.setItem('GIST_ID', gistIdInput.value.trim());
        settingsModal.classList.remove('active');
        alert('Configuration Saved Successfully!');
    });

    backupBtn.addEventListener('click', backupToCloud);
    syncBtn.addEventListener('click', syncFromCloud);

    createModuleBtn.addEventListener('click', () => createModal.classList.add('active'));
    closeCreateBtn.addEventListener('click', () => {
        if(!loadingState.style.display || loadingState.style.display === 'none') {
            createModal.classList.remove('active');
        }
    });
    createModal.addEventListener('click', (e) => {
        if(e.target === createModal && (!loadingState.style.display || loadingState.style.display === 'none')) {
            createModal.classList.remove('active');
        }
    });

    generateBtn.addEventListener('click', handleGeneration);
}

function handleGeneration() {
    const moduleName = newModuleNameInput.value.trim();
    if(!moduleName) {
        alert("Please provide a module name.");
        return;
    }

    setLoading(true, "Creating workspace...");
    
    // Check if module naturally already exists
    let existingStr = localStorage.getItem('dynamic_modules') || '[]';
    let modulesDict = JSON.parse(existingStr);
    let existingIndex = modulesDict.findIndex(m => m.name === moduleName);
    
    if(existingIndex < 0) {
        // Create blank V2 data struct
        modulesDict.push({
            name: moduleName,
            chapters: [],
            exams: [],
            createdAt: new Date().toISOString()
        });
        localStorage.setItem('dynamic_modules', JSON.stringify(modulesDict));
    }
    
    // Redirect securely to Module Hub
    window.location.href = `module_hub.html?module=${encodeURIComponent(moduleName)}`;
}

function setLoading(isLoading, text = "") {
    loadingText.innerText = text;
    generateBtn.style.display = isLoading ? 'none' : 'block';
    loadingState.style.display = isLoading ? 'flex' : 'none';
}

function saveModuleLocally(name, data) {
    // Deprecated for V2 flow, now handled explicitly inside module hub
}

function renderModules() {
    // Clear custom modules first, strictly retaining the static default+create cards
    const existingCustoms = document.querySelectorAll('.custom-module');
    existingCustoms.forEach(c => c.remove());
    
    const modulesStr = localStorage.getItem('dynamic_modules') || '[]';
    const modulesArr = JSON.parse(modulesStr);
    
    modulesArr.forEach(mod => {
        const card = document.createElement('a');
        card.href = `module_hub.html?module=${encodeURIComponent(mod.name)}`;
        card.className = 'module-card custom-module';
        
        // Ensure V2 compatibility logic
        const chapterCount = mod.chapters ? mod.chapters.length : 0;
        const examCount = mod.exams ? mod.exams.length : 0;
        
        card.innerHTML = `
            <h3>${mod.name}</h3>
            <p>V2 AI Module | ${chapterCount} Chapters | ${examCount} Past Papers</p>
            <button class="delete-btn" onclick="deleteModule(event, '${mod.name}')">Delete</button>
        `;
        
        // Insert physically before the Create card
        modulesList.insertBefore(card, createModuleBtn);
    });
}

window.deleteModule = function(e, name) {
    e.preventDefault();
    e.stopPropagation();
    
    if(confirm(`Are you sure you uniquely want to violently delete module "${name}"?`)) {
        let existingStr = localStorage.getItem('dynamic_modules') || '[]';
        let modulesDict = JSON.parse(existingStr);
        let filtered = modulesDict.filter(m => m.name !== name);
        localStorage.setItem('dynamic_modules', JSON.stringify(filtered));
        renderModules();
    }
}

// --- CLOUD SYNC LOGIC ---

async function backupToCloud() {
    const pat = githubPatInput.value.trim();
    if (!pat) return alert("Please provide a GitHub PAT first.");
    
    const payload = {
        dynamic_modules: JSON.parse(localStorage.getItem('dynamic_modules') || '[]'),
        user_stats: JSON.parse(localStorage.getItem('user_stats') || '{}')
    };

    const gistData = {
        description: "Comms Marathon Cloud Backup",
        public: false,
        files: {
            "quiz_backup.json": { content: JSON.stringify(payload) }
        }
    };

    let gistId = gistIdInput.value.trim();
    const isUpdate = !!gistId;
    const url = isUpdate ? `https://api.github.com/gists/${gistId}` : `https://api.github.com/gists`;
    const method = isUpdate ? "PATCH" : "POST";

    backupBtn.innerText = "⏳ Backing up...";
    
    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                "Authorization": `token ${pat}`,
                "Accept": "application/vnd.github.v3+json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(gistData)
        });

        if (!response.ok) throw new Error(`API Error ${response.status}: ${await response.text()}`);

        const result = await response.json();
        
        if (!isUpdate) {
            gistIdInput.value = result.id;
            localStorage.setItem('GIST_ID', result.id);
            alert(`New backup created! Your Gist ID is:\n\n${result.id}\n\nSave this ID on your other devices to sync!`);
        } else {
            alert("Backup updated successfully!");
        }

    } catch (err) {
        alert("Backup failed: " + err.message);
    }
    
    backupBtn.innerText = "⬆️ Backup";
}

async function syncFromCloud() {
    const pat = githubPatInput.value.trim();
    const gistId = gistIdInput.value.trim();
    
    if (!pat || !gistId) return alert("Both GitHub PAT and Gist ID are required to sync.");

    if(!confirm("⚠️ Syncing will overwrite all existing modules on this device. Proceed?")) return;

    syncBtn.innerText = "⏳ Syncing...";

    try {
        const response = await fetch(`https://api.github.com/gists/${gistId}`, {
            method: "GET",
            headers: {
                "Authorization": `token ${pat}`,
                "Accept": "application/vnd.github.v3+json"
            }
        });

        if (!response.ok) throw new Error(`API Error ${response.status}`);

        const result = await response.json();
        const fileContent = result.files["quiz_backup.json"].content;
        const parsed = JSON.parse(fileContent);

        localStorage.setItem('dynamic_modules', JSON.stringify(parsed.dynamic_modules || []));
        localStorage.setItem('user_stats', JSON.stringify(parsed.user_stats || {}));
        
        renderModules();
        settingsModal.classList.remove('active');
        alert("Sync complete! Modules have been populated.");

    } catch (err) {
        alert("Sync failed: Make sure your Gist ID is correct. " + err.message);
    }
    
    syncBtn.innerText = "⬇️ Sync";
}

window.onload = init;
