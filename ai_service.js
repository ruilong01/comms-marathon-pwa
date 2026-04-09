/**
 * ai_service.js (V2)
 * Handles securely calling the Gemini API for Chapters, Mock Exams, and Overviews.
 */

async function callGemini(systemPrompt, apiKey, requireJSON = true) {
    if (!apiKey) throw new Error("No API key provided. Please configure it in settings.");

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const config = { temperature: 0.2 };
    if (requireJSON) config.responseMimeType = "application/json";

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{text: systemPrompt}] }],
            generationConfig: config
        })
    });

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`API Error ${response.status}: ${err}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}

// ----------------------------------------------------
// 1. GENERATE CHAPTER (Questions + Summary)
// ----------------------------------------------------
async function generateChapterContent(text, apiKey, chapterName) {
    const prompt = `You are a university professor creating interactive study material for the chapter: "${chapterName}".
Given the following tutorial document, extract the key knowledge into a short HTML study guide, and then generate 5-10 rigorous quiz questions (MCQ and Fill-in-the-blank).

IMPORTANT VISUAL DESIGN RULES:
You MUST format the "summary" HTML using our specific beautiful CSS design system. Use these structures:
1. Wrap related concepts in grids: <div class="two-col"> or <div class="three-col">
2. Concept blocks: <div class="concept-card accent-blue"><div class="concept-icon">💡</div><h3>Title</h3><p>desc</p><div class="tag-row"><span class="tag">tag1</span><span class="tag warn">tag2</span></div></div>  (You can use accent-blue, accent-red, or accent-purple)
3. Highlights/Warnings: <div class="highlight-card red-hl"><div class="highlight-icon">⚠️</div><div><h3>Careful!</h3><p>...</p></div></div>
4. General information: <div class="info-card accent-purple">...</div>
5. Lists: <ul class="kb-list"><li>...</li></ul>
6. Formulas or rules: <div class="formula-box blue">...</div>
7. Examples inside cards: <div class="example-box">...</div>
8. DIAGRAMS & FLOWCHARTS: You possess the ability to draw flowcharts, state machines, and relational graphs. You MUST use Mermaid.js syntax inside a <pre class="mermaid"> block whenever a concept is better explained visually (e.g., <pre class="mermaid">graph TD; A-->B;</pre>). This is EXTREMELY important for visual learners.

Respond EXACTLY with this raw JSON object schema:
{
  "summary": "<!-- 100% beautiful raw HTML utilizing the aforementioned classes -->...",
  "questions": [
    {
      "type": "mcq",
      "prompt": "Question text here",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 1,
      "explanation": "Detailed explanation of why this answer is correct."
    },
    {
      "type": "fitb",
      "prompt": "The primary advantage of _____ is speed.",
      "correctAnswers": ["word", "synonym"],
      "explanation": "Explanation."
    }
  ]
}

SOURCE TEXT:
${text.substring(0, 30000)}
`;
    
    const rawParams = await callGemini(prompt, apiKey, true);
    return JSON.parse(rawParams.trim());
}

// ----------------------------------------------------
// 2. GENERATE MOCK EXAM
// ----------------------------------------------------
async function generateMockExam(pastPaperText, apiKey) {
    const prompt = `You are a brilliant exam coordinator. I am providing you with a raw text extraction of a Past Year Final Exam Paper.
Your job is to reverse-engineer its layout, difficulty, and topics, and invent a COMPLETELY NEW, ORIGINAL "Mock Exam" that mimics the exact format.
You must invent entirely original questions testing the same syllabus, and provide a comprehensive Answer Key.

Respond EXACTLY with this raw JSON object schema:
{
  "title": "Mock Final Exam Generated via AI",
  "instructions": "Answer all 4 main questions. Time limit: 2 Hours...",
  "questions": [
    {
      "number": 1,
      "prompt": "Main question scenario or context text (can contain HTML like <br> or <strong>).",
      "subQuestions": [
        { "id": "1a", "text": "What is the consequence of X? (5 marks)" },
        { "id": "1b", "text": "Calculate Y. Show working. (10 marks)" }
      ]
    }
  ],
  "answers": [
    {
      "id": "1a",
      "answerHtml": "<strong>Solution 1a:</strong><br>The consequence is..."
    },
    {
      "id": "1b",
      "answerHtml": "<strong>Solution 1b:</strong><br>Step 1... Step 2... Final answer: 42."
    }
  ]
}

PAST PAPER TEXT:
${pastPaperText.substring(0, 40000)}
`;

    const rawParams = await callGemini(prompt, apiKey, true);
    return JSON.parse(rawParams.trim());
}

// ----------------------------------------------------
// 3. GENERATE OVERALL MODULE SUMMARY
// ----------------------------------------------------
async function generateOverallSummary(chaptersArr, apiKey) {
    if(!chaptersArr || chaptersArr.length === 0) return "<p>No chapters uploaded yet.</p>";

    let context = chaptersArr.map(c => `Chapter: ${c.name}\nContent Hints:\n${c.summary.substring(0, 15000)}...`).join('\n\n');

    const prompt = `You are an expert professor and precise academic summarizer. 
Your goal is to synthesize the following chapter summaries into one exhaustive, high-yield "Cheat Sheet" or "Revision Guide" for the final exam.
DO NOT write a generic study plan or outline. You MUST write deep, detailed technical explanations, combining key formulas, critical concepts, and the most heavily tested knowledge across all these chapters into a single masterpiece reference page.

IMPORTANT VISUAL DESIGN RULES:
You MUST format your ONLY output in raw HTML using our specific beautiful CSS design system. Use these structures instead of generic tags:
1. Wrap related concepts in grids: <div class="two-col"> or <div class="three-col">
2. Concept blocks: <div class="concept-card accent-blue"><div class="concept-icon">💡</div><h3>Title</h3><p>desc</p></div>  (Use accent-blue, accent-red, or accent-purple)
3. Highlights/Warnings: <div class="highlight-card red-hl"><div class="highlight-icon">⚠️</div><div><h3>Exam Trap!</h3><p>...</p></div></div>
4. General information: <div class="info-card accent-purple">...</div>
5. Lists: <ul class="kb-list"><li>...</li></ul>
6. Formulas or rules: <div class="formula-box blue">...</div>
7. Examples inside cards: <div class="example-box">...</div>
8. ARCHITECTURE & DIAGRAMS (CRITICAL): Since this is a massive Revision Guide, you MUST visually map out concepts using Mermaid.js. Embed Mermaid diagrams inside a <pre class="mermaid"> block to show timelines, hierarchy, code architecture, protocol flow, etc (e.g., <pre class="mermaid">graph TD; A-->B;</pre>). Be highly illustrative!

Do NOT use markdown code blocks (\`\`\`). JUST output the raw HTML exactly.

CHAPTERS IN MODULE:
${context}
`;
// We don't strictly require JSON for this, just raw HTML string
    const rawHtml = await callGemini(prompt, apiKey, false);
    return rawHtml.trim();
}

// ----------------------------------------------------
// 4. CHAT WITH TUTOR
// ----------------------------------------------------
async function chatWithTutor(message, apiKey, context) {
    const prompt = `You are a helpful AI Assistant embedded inside a personal study app.
A student is asking you a question about the material. Provide a direct, comprehensive, and highly specific answer to their question. 
Since this is for their own personal study, do not hold back or "guide" them to the answer—just give them the direct explanation or solution they are looking for.
Use simple HTML (like <strong>, <em>, <br>) so your response is formatted nicely. Do NOT use markdown.

--- CURRENT CONTEXT / WHAT THE STUDENT IS LOOKING AT ---
${context}

--- STUDENT QUESTION ---
${message}
`;

    // Standard string response, no JSON constraint needed
    const rawParams = await callGemini(prompt, apiKey, false);
    return rawParams.trim();
}

// ----------------------------------------------------
// 5. EVALUATE PERFORMANCE
// ----------------------------------------------------
async function evaluatePerformance(missedQs, apiKey) {
    if(!missedQs || missedQs.length === 0) {
        return "<p>You haven't answered any questions incorrectly yet! Take some quizzes first.</p>";
    }
    
    // Group missed questions if multiple
    let missedText = missedQs.map((q, i) => `${i+1}. ${q.prompt}`).join('\n');
    let context = `I have recently answered the following questions incorrectly:\n${missedText}`;

    const prompt = `You are an encouraging AI academic evaluator.
Analyze the following list of questions that the student has answered incorrectly during their study sessions.
Identify their core weaknesses, overarching blind spots in the syllabus, and suggest exactly what they should study to fix this.

IMPORTANT VISUAL DESIGN RULES:
You MUST format your ONLY output in raw HTML using our specific beautiful CSS design system. Use these structures instead of generic markdown:
1. Concept blocks: <div class="concept-card accent-red"><div class="concept-icon">🎯</div><h3>Weakness Title</h3><p>desc</p></div>
2. General information/Advice: <div class="info-card accent-purple">...</div>
3. Lists: <ul class="kb-list"><li>...</li></ul>

Do NOT use markdown code blocks (\`\`\`). JUST output the raw HTML exactly.

${context}`;

    const rawHtml = await callGemini(prompt, apiKey, false);
    return rawHtml.trim();
}

// ----------------------------------------------------
// 6. GENERATE EXAM ANALYSIS
// ----------------------------------------------------
async function generateExamAnalysis(pastPaperText, apiKey) {
    const prompt = `You are an expert examiner. Read the following raw text from a university past year paper.
Identify the recurring themes, what topics the examiners heavily favor, and any trick questions they tend to employ.

IMPORTANT VISUAL DESIGN RULES:
You MUST format your ONLY output in raw HTML using our specific beautiful CSS design system. Use these structures instead of generic markdown:
1. Trend blocks: <div class="concept-card accent-blue"><div class="concept-icon">📈</div><h3>Trend Title</h3><p>desc</p></div>
2. Trick Warnings: <div class="highlight-card red-hl"><div class="highlight-icon">⚠️</div><div><h3>Trick Question Trap</h3><p>...</p></div></div>
3. General analysis: <div class="info-card accent-purple">...</div>
4. Lists: <ul class="kb-list"><li>...</li></ul>

Do NOT use markdown code blocks (\`\`\`). JUST output the raw HTML exactly.

PAST PAPER TEXT:
${pastPaperText.substring(0, 40000)}
`;

    const rawHtml = await callGemini(prompt, apiKey, false);
    return rawHtml.trim();
}
