// DOM Elements
const qBadge = document.getElementById('q-type');
const qPrompt = document.getElementById('q-prompt');
const mount = document.getElementById('q-mount');
const submitBtn = document.getElementById('submit-btn');

const scoreEl = document.getElementById('score');
const streakEl = document.getElementById('streak');
const marathonCountEl = document.getElementById('marathon-count');

const feedbackModal = document.getElementById('feedback-modal');
const feedbackTitle = document.getElementById('feedback-title');
const feedbackExp = document.getElementById('feedback-explanation');
const nextBtn = document.getElementById('next-btn');

// Game State
let currentScore = 0;
let currentStreak = 0;
let totalAsked = 1;
let currentQ = null;

// Global overrides if custom module is active
const urlParams = new URLSearchParams(window.location.search);
const moduleName = urlParams.get('module');

if (moduleName) {
    document.title = moduleName + " - Endless Marathon";
    const titleEl = document.getElementById('quiz-title');
    if (titleEl) titleEl.innerText = moduleName;

    // Load from local storage
    const modulesStr = localStorage.getItem('dynamic_modules') || '[]';
    const modulesArr = JSON.parse(modulesStr);
    const customMod = modulesArr.find(m => m.name === moduleName);

    if (customMod && customMod.chapters) {
        // Aggregate all questions from all chapters
        let aggregatedQuestions = [];
        customMod.chapters.forEach(chap => {
            if(chap.questions) aggregatedQuestions.push(...chap.questions);
        });

        if(aggregatedQuestions.length === 0) {
            alert("No questions found! Make sure you uploaded a chapter first.");
        } else {
            // Override the global getRandomQuestion from data.js
            window.getRandomQuestion = function() {
                return aggregatedQuestions[Math.floor(Math.random() * aggregatedQuestions.length)];
            };
        }
    } else {
        alert("Module not found or empty! Reverting to default dataset.");
    }
}

// Initialize
function init() {
    submitBtn.addEventListener('click', handleSubmission);
    nextBtn.addEventListener('click', () => {
        feedbackModal.classList.add('hidden');
        loadRandomQuestion();
    });
    loadRandomQuestion();
}

function loadRandomQuestion() {
    // Dynamically pull or generate a random formulation from data.js
    currentQ = getRandomQuestion();
    
    marathonCountEl.innerText = `Total Attempted: ${totalAsked}`;
    
    // Reset UI
    mount.innerHTML = '';
    submitBtn.style.display = 'none';
    submitBtn.onclick = null;
    
    // Route by type
    if (currentQ.type === 'mcq') renderMCQ();
    else if (currentQ.type === 'fitb' || currentQ.type === 'calc') renderFITB();
    else if (currentQ.type === 'dnd') renderDND();
}

// -----------------------------------------------------
// RENDERERS
// -----------------------------------------------------
function renderMCQ() {
    qBadge.innerText = 'Multiple Choice';
    qPrompt.innerText = currentQ.prompt;
    
    currentQ.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = 'mcq-btn';
        btn.innerText = opt;
        btn.onclick = () => {
            // Evaluates instantly
            if(index === currentQ.correctIndex) {
                btn.classList.add('glow-success');
                handleCorrect();
                setTimeout(loadRandomQuestion, 1000);
            } else {
                btn.classList.add('shake');
                handleWrong();
            }
        };
        mount.appendChild(btn);
    });
}

function renderFITB() {
    qBadge.innerText = currentQ.type === 'calc' ? 'Calculation' : 'Fill in the Blank';
    qPrompt.innerText = currentQ.prompt;
    
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'fitb-input';
    input.placeholder = 'Type your answer here...';
    
    mount.appendChild(input);
    
    submitBtn.style.display = 'block';
    
    // Allows Enter key submission
    input.addEventListener('keypress', (e) => {
        if(e.key === 'Enter') checkFITB(input.value);
    });
    
    submitBtn.onclick = () => checkFITB(input.value);
}

function renderDND() {
    qBadge.innerText = 'Drag and Match logic';
    qPrompt.innerText = currentQ.prompt;
    
    const container = document.createElement('div');
    container.className = 'dnd-container';
    
    const colChips = document.createElement('div');
    colChips.className = 'dnd-col';
    
    const colSlots = document.createElement('div');
    colSlots.className = 'dnd-col';
    
    // Shuffle the matches array explicitly without modifying original
    let shuffledMatches = [...currentQ.matches].sort(() => Math.random() - 0.5);
    
    // Create Draggable Chips
    shuffledMatches.forEach((match) => {
        const chip = document.createElement('div');
        chip.className = 'drag-item';
        chip.draggable = true;
        chip.innerText = match.label;
        chip.dataset.id = match.id;
        
        chip.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', match.id);
            setTimeout(() => chip.style.opacity = '0.5', 0);
        });
        chip.addEventListener('dragend', () => {
            chip.style.opacity = '1';
        });
        
        colChips.appendChild(chip);
    });
    
    // Create Drop slots
    currentQ.matches.forEach((match) => {
        const row = document.createElement('div');
        row.className = 'match-row';
        
        const label = document.createElement('div');
        label.className = 'match-label';
        label.innerText = match.answerText;
        
        const dropBox = document.createElement('div');
        dropBox.className = 'drop-target';
        dropBox.dataset.correctId = match.id;
        dropBox.innerHTML = '<em>Drop matches here</em>';
        
        // Drag events
        dropBox.addEventListener('dragover', e => {
            e.preventDefault();
            dropBox.classList.add('hover');
        });
        dropBox.addEventListener('dragleave', e => {
            dropBox.classList.remove('hover');
        });
        dropBox.addEventListener('drop', e => {
            e.preventDefault();
            dropBox.classList.remove('hover');
            
            const draggedId = e.dataTransfer.getData('text/plain');
            
            if(draggedId === dropBox.dataset.correctId) {
                // Correct match!
                const draggedEl = document.querySelector(`.drag-item[data-id="${draggedId}"]`);
                dropBox.innerHTML = '';
                dropBox.appendChild(draggedEl);
                dropBox.classList.add('glow-success');
                
                checkDNDCompletion(colChips);
            } else {
                // Wrong match!
                dropBox.classList.add('shake');
                setTimeout(() => dropBox.classList.remove('shake'), 400);
                handleWrong('Mismatched association!');
            }
        });
        
        row.appendChild(dropBox);
        row.appendChild(label);
        colSlots.appendChild(row);
    });
    
    container.appendChild(colChips);
    container.appendChild(colSlots);
    mount.appendChild(container);
}

// -----------------------------------------------------
// EVALUATION LOGIC
// -----------------------------------------------------
function checkFITB(inputVal) {
    const cleanStr = inputVal.toLowerCase().trim();
    const isCorrect = currentQ.correctAnswers.some(ans => ans.toLowerCase() === cleanStr);
    
    if(isCorrect) {
        document.querySelector('.fitb-input').classList.add('glow-success');
        handleCorrect();
        setTimeout(loadRandomQuestion, 1000);
    } else {
        document.querySelector('.fitb-input').classList.add('shake');
        handleWrong();
    }
}

function checkDNDCompletion(chipCol) {
    if(chipCol.children.length === 0) {
        handleCorrect();
        setTimeout(loadRandomQuestion, 1000);
    }
}

function handleCorrect() {
    currentScore += 10;
    currentStreak += 1;
    totalAsked++;
    scoreEl.innerText = currentScore;
    streakEl.innerText = currentStreak;
}

function handleWrong(customTitle = 'Incorrect') {
    currentStreak = 0;
    streakEl.innerText = currentStreak;
    
    feedbackTitle.innerText = customTitle;
    feedbackExp.innerText = currentQ.explanation;
    feedbackModal.classList.remove('hidden');
    
    totalAsked++;
}

// Dummy handler for things without specific checks
function handleSubmission() {
    // Safety
}

// Boot
window.onload = init;

// Expose context for Chatbot
window.getCurrentChatContext = function() {
    if (!currentQ) return "Student is at the quiz menu.";
    
    // We strictly serialize the current question text so the AI knows what they are looking at
    let ctx = `Question: ${currentQ.prompt}\n`;
    if (currentQ.options) ctx += `Options: ${currentQ.options.join(', ')}\n`;
    if (currentQ.explanation) ctx += `[Hidden Solution: ${currentQ.explanation}]\n`;
    return ctx;
};
