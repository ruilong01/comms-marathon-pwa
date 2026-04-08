/**
 * dashboard.js
 * Handles UI interactions on the Dashboard page.
 */

// -- Elements --
const openSettingsBtn = document.getElementById('open-settings-btn');
const settingsModal = document.getElementById('settings-modal');
const geminiKeyInput = document.getElementById('gemini-key');
const saveSettingsBtn = document.getElementById('save-settings-btn');

const createModuleBtn = document.getElementById('create-module-btn');
const createModal = document.getElementById('create-modal');
const closeCreateBtn = document.getElementById('close-create-btn');

// Initialize
function init() {
    renderModules();
    
    // Load api key
    const savedKey = localStorage.getItem('GEMINI_API_KEY');
    if (savedKey) geminiKeyInput.value = savedKey;

    // Events
    openSettingsBtn.addEventListener('click', () => settingsModal.classList.add('active'));
    settingsModal.addEventListener('click', (e) => {
        if(e.target === settingsModal) settingsModal.classList.remove('active');
    });
    
    saveSettingsBtn.addEventListener('click', () => {
        localStorage.setItem('GEMINI_API_KEY', geminiKeyInput.value.trim());
        settingsModal.classList.remove('active');
        alert('API Key Saved Successfully!');
    });

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

window.onload = init;
