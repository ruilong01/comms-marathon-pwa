/**
 * module_hub.js
 * Manages the specific module dashboard: rendering chapters, exams, and uploading files.
 */

const urlParams = new URLSearchParams(window.location.search);
const moduleName = urlParams.get('module');
if(!moduleName) window.location.href = 'index.html';

document.getElementById('module-title').innerText = moduleName;
document.title = moduleName + " - Module Hub";

const chaptersList = document.getElementById('chapters-list');
const dzChapter = document.getElementById('dz-chapter');
const fileChapter = document.getElementById('file-chapter');

const examsList = document.getElementById('exams-list');
const dzExam = document.getElementById('dz-exam');
const fileExam = document.getElementById('file-exam');

const loadingModal = document.getElementById('loading-modal');
const loadingTitle = document.getElementById('loading-title');
const loadingDesc = document.getElementById('loading-desc');

// -- Initialization --
function init() {
    renderHub();

    document.getElementById('btn-quiz').addEventListener('click', (e) => {
        e.preventDefault();
        const mod = getModule();
        if(!mod.chapters || mod.chapters.length === 0) {
            alert("This module is completely empty. Please upload at least one Chapter PDF first.");
            return;
        }
        window.location.href = `quiz.html?module=${encodeURIComponent(moduleName)}`;
    });

    document.getElementById('btn-knowledge').addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = `dynamic_knowledge.html?module=${encodeURIComponent(moduleName)}`;
    });

    setupDropzone(dzChapter, fileChapter, handleChapterUpload);
    setupDropzone(dzExam, fileExam, handleExamUpload);
}

function getModule() {
    let dict = JSON.parse(localStorage.getItem('dynamic_modules') || '[]');
    return dict.find(m => m.name === moduleName) || { name: moduleName, chapters: [], exams: [] };
}

function saveModule(mod) {
    let dict = JSON.parse(localStorage.getItem('dynamic_modules') || '[]');
    let idx = dict.findIndex(m => m.name === moduleName);
    if(idx >= 0) dict[idx] = mod;
    else dict.push(mod);
    localStorage.setItem('dynamic_modules', JSON.stringify(dict));
}

// -- UI Rendering --
function renderHub() {
    const mod = getModule();
    
    // Render Chapters
    document.querySelectorAll('.chapter-card').forEach(c => c.remove());
    if (mod.chapters) {
        mod.chapters.forEach(chap => {
            const card = document.createElement('div');
            card.className = 'item-card chapter-card';
            card.innerHTML = `
                <h4>📚 ${chap.name}</h4>
                <p>${chap.questions.length} Practice Questions</p>
            `;
            chaptersList.insertBefore(card, dzChapter);
        });
    }

    // Render Exams
    document.querySelectorAll('.exam-card').forEach(e => e.remove());
    if (mod.exams) {
        mod.exams.forEach(ex => {
            const card = document.createElement('div');
            card.className = 'item-card exam-card';
            card.style.borderColor = "rgba(168, 85, 247, 0.3)";
            card.innerHTML = `
                <h4>📝 ${ex.title || ex.name}</h4>
                <p>AI Simulated Final Paper</p>
                <a href="exam_paper.html?module=${encodeURIComponent(moduleName)}&exam=${encodeURIComponent(ex.name)}" class="mock-btn" style="text-align: center; text-decoration: none;">Attempt Mock Paper</a>
            `;
            examsList.insertBefore(card, dzExam);
        });
    }
}

// -- Drag & Drop Setup --
function setupDropzone(dz, input, uploadHandler) {
    dz.addEventListener('click', () => input.click());
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eName => {
        dz.addEventListener(eName, e => { e.preventDefault(); e.stopPropagation(); });
    });
    ['dragenter', 'dragover'].forEach(eName => dz.addEventListener(eName, () => dz.style.borderColor = '#ff3366'));
    ['dragleave', 'drop'].forEach(eName => dz.addEventListener(eName, () => dz.style.borderColor = ''));

    dz.addEventListener('drop', e => {
        if(e.dataTransfer.files.length) uploadHandler(e.dataTransfer.files[0]);
    });
    input.addEventListener('change', e => {
        if(e.target.files.length) uploadHandler(e.target.files[0]);
        input.value = ''; // reset
    });
}

// -- PDF Extraction --
async function extractText(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
            reader.readAsArrayBuffer(file);
            reader.onload = async function() {
                try {
                    const typedarray = new Uint8Array(this.result);
                    const pdf = await pdfjsLib.getDocument(typedarray).promise;
                    let text = '';
                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const content = await page.getTextContent();
                        text += content.items.map(it => it.str).join(' ') + '\n';
                    }
                    resolve(text);
                } catch(e) { reject(e); }
            };
        } else {
            reader.readAsText(file);
            reader.onload = function() { resolve(this.result); };
        }
        reader.onerror = reject;
    });
}

// -- Upload Handlers --
async function handleChapterUpload(file) {
    const key = localStorage.getItem('GEMINI_API_KEY');
    if(!key) { alert("Missing API Key in Settings."); return; }

    const cleanName = file.name.split('.')[0];
    
    try {
        showLoading(`Extracting ${cleanName}...`, "Reading raw PDF chunks locally.");
        const text = await extractText(file);

        showLoading("Generating Chapter Details...", "AI is drafting the HTML study guide and rigorous MCQs.");
        const chapterData = await generateChapterContent(text, key, cleanName);

        // Save
        const mod = getModule();
        if(!mod.chapters) mod.chapters = [];
        mod.chapters.push({
            name: cleanName,
            summary: chapterData.summary,
            questions: chapterData.questions
        });

        // Trigger Overall summary generation in the background so it doesn't block the UI heavily
        generateOverallSummary(mod.chapters, key).then(overallHtml => {
            mod.overallSummary = overallHtml;
            saveModule(mod);
            console.log("Automatically updated the overall macro-plan.");
        }).catch(err => console.error("Could not generate overall summary:", err));

        saveModule(mod);
        renderHub();
        hideLoading();
        alert(`Chapter "${cleanName}" imported successfully!`);
        
    } catch(err) {
        hideLoading();
        alert(`Chapter Generation Failed: ${err.message}`);
    }
}

async function handleExamUpload(file) {
    const key = localStorage.getItem('GEMINI_API_KEY');
    if(!key) { alert("Missing API Key in Settings."); return; }

    const cleanName = file.name.split('.')[0];
    
    try {
        showLoading(`Analysing Past Paper...`, "Extracting paper structure, marks, and historical questions.");
        const text = await extractText(file);

        showLoading("Simulating Mock Exam...", "The AI is inventing totally original scenarios mirroring the exact format. This usually takes 30-40s.");
        const mockData = await generateMockExam(text, key);
        mockData.name = `AI Mock: ${cleanName}`; // Internal ID

        const mod = getModule();
        if(!mod.exams) mod.exams = [];
        mod.exams.push(mockData);
        saveModule(mod);
        
        renderHub();
        hideLoading();
        alert(`Successfully generated a simulated exam!`);

    } catch(err) {
        hideLoading();
        alert(`Exam Generation Failed: ${err.message}`);
    }
}

// -- Loading UI --
function showLoading(title, desc) {
    loadingTitle.innerText = title;
    loadingDesc.innerText = desc;
    loadingModal.classList.add('active');
}
function hideLoading() {
    loadingModal.classList.remove('active');
}

window.onload = init;
