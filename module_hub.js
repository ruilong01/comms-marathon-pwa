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

const queuePanel = document.getElementById('upload-queue-panel');
const queueList = document.getElementById('upload-queue-list');
let activeUploads = 0;

window.addEventListener('beforeunload', (e) => {
    if (activeUploads > 0) {
        e.preventDefault();
        e.returnValue = 'You have active background uploads. Leaving will cancel them!';
    }
});

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

    // Combine Chapters Modal Logic
    document.getElementById('btn-combine').addEventListener('click', (e) => {
        e.preventDefault();
        const mod = getModule();
        const checklist = document.getElementById('combine-checklist');
        checklist.innerHTML = '';
        if(!mod.chapters || mod.chapters.length === 0) {
            checklist.innerHTML = '<span style="color:#a0a5ba;">No chapters available.</span>';
        } else {
            mod.chapters.forEach(chap => {
                const id = 'chk-' + btoa(encodeURIComponent(chap.name)).replace(/=/g, '');
                checklist.innerHTML += `
                    <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">
                        <input type="checkbox" id="${id}" value="${chap.name}" style="transform:scale(1.2);">
                        <label for="${id}" style="color:#fff;">${chap.name}</label>
                    </div>
                `;
            });
        }
        document.getElementById('combine-modal').classList.add('active');
    });

    document.getElementById('close-combine-btn').addEventListener('click', () => {
        document.getElementById('combine-modal').classList.remove('active');
    });

    document.getElementById('combine-quiz-btn').addEventListener('click', () => {
        const checked = Array.from(document.querySelectorAll('#combine-checklist input:checked')).map(cb => cb.value);
        if(checked.length === 0) return alert("Select at least one chapter.");
        window.location.href = `quiz.html?module=${encodeURIComponent(moduleName)}&chapters=${encodeURIComponent(checked.join(','))}`;
    });

    document.getElementById('combine-knowledge-btn').addEventListener('click', () => {
        const checked = Array.from(document.querySelectorAll('#combine-checklist input:checked')).map(cb => cb.value);
        if(checked.length === 0) return alert("Select at least one chapter.");
        window.location.href = `dynamic_knowledge.html?module=${encodeURIComponent(moduleName)}&chapters=${encodeURIComponent(checked.join(','))}`;
    });

    // Evaluation Modal Logic
    document.getElementById('btn-eval').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('eval-modal').classList.add('active');
    });
    document.getElementById('close-eval-btn').addEventListener('click', () => {
        document.getElementById('eval-modal').classList.remove('active');
    });
    document.getElementById('run-eval-btn').addEventListener('click', async () => {
        const key = localStorage.getItem('GEMINI_API_KEY');
        if(!key) return alert("Missing API Key in Settings.");
        
        let statsStats = JSON.parse(localStorage.getItem('user_stats') || '{}');
        let missedQs = statsStats[moduleName] || [];
        
        const spinner = document.getElementById('eval-spinner');
        const content = document.getElementById('eval-content');
        
        spinner.style.display = 'block';
        content.innerHTML = '';
        
        try {
            const htmlReport = await evaluatePerformance(missedQs, key);
            content.innerHTML = htmlReport;
        } catch(err) {
            content.innerHTML = `<span style="color:#ff3366;">Error: ${err.message}</span>`;
        }
        spinner.style.display = 'none';
    });

    // Analysis logic
    document.getElementById('close-analysis-btn').addEventListener('click', () => {
        document.getElementById('analysis-modal').classList.remove('active');
    });

    document.getElementById('btn-generate-plan').addEventListener('click', async () => {
        const key = localStorage.getItem('GEMINI_API_KEY');
        if(!key) return alert("Missing API Key in Settings.");
        
        const mod = getModule();
        if(!mod.chapters || mod.chapters.length === 0) return alert("Upload chapters first to compile a Master Plan.");
        
        const spinner = document.getElementById('gen-plan-spinner');
        const textLabel = document.getElementById('gen-plan-text');
        
        spinner.style.display = 'block';
        textLabel.innerText = "Analyzing chapters & drafting plan...";
        document.getElementById('btn-generate-plan').style.pointerEvents = 'none';
        
        try {
            const overallHtml = await generateOverallSummary(mod.chapters, key);
            mod.overallSummary = overallHtml;
            saveModule(mod);
            window.location.href = `dynamic_knowledge.html?module=${encodeURIComponent(moduleName)}`;
        } catch(err) {
            alert("Failed to generate plan: " + err.message);
        } finally {
            spinner.style.display = 'none';
            textLabel.innerText = "🔄 Generate & Review Master Study Plan";
            document.getElementById('btn-generate-plan').style.pointerEvents = 'all';
        }
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
        // Natural intelligent sort by filename (e.g. Chapter 1, Chapter 2, Chapter 10)
        mod.chapters.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));
        
        mod.chapters.forEach((chap, index) => {
            if(!chap.id) chap.id = `chap-${index}-${Date.now()}`; // Retro-fit ID for older entries
            
            const card = document.createElement('div');
            card.className = 'item-card chapter-card';
            card.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:start; gap: 15px;">
                    <h4 style="margin:0; overflow-wrap:anywhere; line-height:1.4;">📚 ${chap.name}</h4>
                    <button class="delete-btn" onclick="deleteChapter(event, '${chap.id}')" title="Delete Chapter">🗑️</button>
                </div>
                <p style="margin-top:10px; margin-bottom:10px;">${chap.questions ? chap.questions.length : 0} AI Questions</p>
                <div style="display:flex; gap:10px;">
                    <a href="quiz.html?module=${encodeURIComponent(moduleName)}&chapter=${encodeURIComponent(chap.name)}" class="mock-btn" style="flex:1; text-align:center; text-decoration:none;">🎯 Quiz</a>
                    <a href="dynamic_knowledge.html?module=${encodeURIComponent(moduleName)}&chapter=${encodeURIComponent(chap.name)}" class="mock-btn" style="flex:1; text-align:center; text-decoration:none; border-color: rgba(168, 85, 247, 0.3); color: #a855f7;">📚 Know</a>
                </div>
            `;
            chaptersList.insertBefore(card, dzChapter);
        });
    }

    // Render Exams
    document.querySelectorAll('.exam-card').forEach(e => e.remove());
    if (mod.exams) {
        mod.exams.sort((a, b) => (a.title || a.name).localeCompare((b.title || b.name), undefined, { numeric: true, sensitivity: 'base' }));
        
        mod.exams.forEach((ex, index) => {
            if(!ex.id) ex.id = `exam-${index}-${Date.now()}`; // Retro-fit ID for older entries
            
            const card = document.createElement('div');
            card.className = 'item-card exam-card';
            card.style.borderColor = "rgba(168, 85, 247, 0.3)";
            card.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:start; gap: 15px;">
                    <h4 style="margin:0; overflow-wrap:anywhere; line-height:1.4;">📝 ${ex.title || ex.name}</h4>
                    <button class="delete-btn" onclick="deleteExam(event, '${ex.id}')" title="Delete Exam">🗑️</button>
                </div>
                <p style="margin-top:10px; margin-bottom:10px;">AI Simulated Final Paper</p>
                <a href="exam_paper.html?module=${encodeURIComponent(moduleName)}&exam=${encodeURIComponent(ex.name)}" class="mock-btn" style="text-align: center; text-decoration: none; display: block; margin-bottom: 5px;">Attempt Mock Paper</a>
                ${ex.analysis ? `<button class="mock-btn view-analysis-btn" data-exam="${encodeURIComponent(ex.name)}" style="background: rgba(168,85,247,0.1); border-color: rgba(168,85,247,0.3); color:#a855f7; width: 100%;">🧠 View Analysis</button>` : ''}
            `;
            examsList.insertBefore(card, dzExam);
            
            // Add listener for analysis button
            setTimeout(() => {
                const btn = card.querySelector('.view-analysis-btn');
                if(btn) {
                    btn.addEventListener('click', () => {
                        document.getElementById('analysis-content').innerHTML = ex.analysis;
                        document.getElementById('analysis-modal').classList.add('active');
                    });
                }
            }, 0);
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

    dz.addEventListener('drop', async e => {
        const files = e.dataTransfer.files;
        if(files.length) {
            for(let i=0; i<files.length; i++) {
                await uploadHandler(files[i]);
            }
            alert(`Finished processing ${files.length} file(s).`);
        }
    });
    input.addEventListener('change', async e => {
        const files = e.target.files;
        if(files.length) {
            for(let i=0; i<files.length; i++) {
                await uploadHandler(files[i]);
            }
            alert(`Finished processing ${files.length} file(s).`);
        }
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
    
    // Duplicate Prevention Check
    const modCheck = getModule();
    if(modCheck.chapters && modCheck.chapters.some(c => c.name === cleanName)) {
        alert(`Duplicate Rejected: A chapter named "${cleanName}" already exists!`);
        return;
    }

    const task = createQueueItem(`Chapter: ${cleanName}`);
    
    try {
        task.setStatus("Extracting PDF text locally...", false);
        const text = await extractText(file);

        task.setStatus("AI drafting guide & rigourous MCQs...", false);
        const chapterData = await generateChapterContent(text, key, cleanName, (msg) => task.setStatus(msg, false));

        // Save
        const mod = getModule(); // Re-fetch to avoid race conditions
        if(!mod.chapters) mod.chapters = [];
        mod.chapters.push({
            id: 'chap-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9),
            name: cleanName,
            summary: chapterData.summary,
            questions: chapterData.questions
        });

        saveModule(mod);
        renderHub();
        task.complete();
    } catch(err) {
        task.setStatus(`Failed: ${err.message}`, true);
        setTimeout(() => task.complete(true), 5000);
    }
}

async function handleExamUpload(file) {
    const key = localStorage.getItem('GEMINI_API_KEY');
    if(!key) { alert("Missing API Key in Settings."); return; }

    const cleanName = file.name.split('.')[0];
    
    // Duplicate Check
    const modCheck = getModule();
    if(modCheck.exams && modCheck.exams.some(e => e.name === `AI Mock: ${cleanName}`)) {
        alert(`Duplicate Rejected: Exam Mock for "${cleanName}" already exists!`);
        return;
    }

    const task = createQueueItem(`Exam: ${cleanName}`);
    
    try {
        task.setStatus("Extracting paper structure & topics...", false);
        const text = await extractText(file);

        task.setStatus("Extracting Examiner Patterns...", false);
        const analysisData = await generateExamAnalysis(text, key, (msg) => task.setStatus(msg, false));

        task.setStatus("Simulating Mock (takes ~30s)...", false);
        const mockData = await generateMockExam(text, key, (msg) => task.setStatus(msg, false));
        
        mockData.id = 'exam-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);
        mockData.name = `AI Mock: ${cleanName}`;
        mockData.analysis = analysisData;

        const mod = getModule(); // Re-fetch
        if(!mod.exams) mod.exams = [];
        mod.exams.push(mockData);

        saveModule(mod);
        
        renderHub();
        task.complete();
    } catch(err) {
        task.setStatus(`Failed: ${err.message}`, true);
        setTimeout(() => task.complete(true), 5000);
    }
}

// -- UI Queue Management --
function createQueueItem(title) {
    if(activeUploads === 0) queuePanel.style.display = 'flex';
    activeUploads++;
    
    const div = document.createElement('div');
    div.style.padding = '10px';
    div.style.background = 'rgba(255,255,255,0.05)';
    div.style.border = '1px solid rgba(255,255,255,0.1)';
    div.style.borderRadius = '8px';
    
    div.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
            <strong style="color:#fff; font-size:0.9rem; margin-bottom:4px; display:block; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${title}</strong>
            <div class="spinner" style="width:12px; height:12px; border-width:2px; margin:0;" id="spin-${activeUploads}"></div>
        </div>
        <p style="margin:0; font-size:0.75rem; color:#a0a5ba;" class="task-status">Starting...</p>
    `;
    queueList.appendChild(div);
    const statusText = div.querySelector('.task-status');
    const spinner = div.querySelector('.spinner');

    return {
        setStatus: (msg, isError) => {
            statusText.innerText = msg;
            if (isError) {
                statusText.style.color = '#ff3366';
                if(spinner) spinner.style.display = 'none';
            }
        },
        complete: (isError = false) => {
            if(!isError) div.remove();
            activeUploads--;
            if(activeUploads <= 0) {
                queuePanel.style.display = 'none';
            }
        }
    };
}

// -- Deletion Handlers --
window.deleteChapter = function(e, id) {
    e.preventDefault();
    e.stopPropagation();
    if(confirm(`Are you sure you want to delete this chapter?`)) {
        const mod = getModule();
        mod.chapters = mod.chapters.filter(c => c.id !== id);
        saveModule(mod);
        renderHub();
    }
};

window.deleteExam = function(e, id) {
    e.preventDefault();
    e.stopPropagation();
    if(confirm(`Are you sure you want to delete this exam?`)) {
        const mod = getModule();
        mod.exams = mod.exams.filter(ex => ex.id !== id);
        saveModule(mod);
        renderHub();
    }
};

window.onload = init;
