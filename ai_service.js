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

Respond EXACTLY with this raw JSON object schema:
{
  "summary": "<h2>Chapter Title</h2><p>Provide a beautifully formatted, highly compressed HTML summary using <strong>bolding</strong> and <ul><li>lists</li></ul> for the most critical facts.</p>",
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

    let context = chaptersArr.map(c => `Chapter: ${c.name}\nContent Hints:\n${c.summary.substring(0, 500)}...`).join('\n\n');

    const prompt = `You are an academic planner drafting an overarching "Master Course Plan" for a module.
Given the following chapters that exist in this module, write a comprehensive, cohesive, and encouraging HTML study plan (about 3-4 paragraphs) that describes how all these pieces fit together. 
Use aesthetic semantic HTML (like <h3>, <p>, <div class="highlight">, <ul>). Do NOT use markdown code blocks (\`\`\`). JUST output raw HTML.

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
    const prompt = `You are a helpful AI Tutor embedded inside an educational app.
A student is asking you a question. Keep your answer brief, encouraging, and highly specific to the context. 
If they ask for an answer to a question, subtly guide them to the answer rather than just bluntly giving it, but if they ask "explain why" then give a full explanation.
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
