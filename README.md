# AI Comms Marathon (V2 Learning Platform) 🚀

This repository contains the completely refactored **AI Comms Marathon PWA**, a next-generation study tool built entirely on the frontend. It dynamically transforms static PDF lectures and past year papers into an interactive, infinite quiz and mock exam ecosystem.

## 🌟 Key Features

* **Module Hubs:** Organize your learning into totally discrete modules (e.g. "Year 2 Physics", "Computer Communications"). Each module acts as an isolated classroom containing its own lecture chapters, knowledge base, and mock exams.
* **Serverless Architecture:** This app runs 100% inside your web browser. Using HTML5 `localStorage` and `IndexedDB` capabilities, it keeps all your generated questions, notes, and exams saved locally without needing a backend database.
* **AI Chapter Parsing:** Drag and drop a lecture PDF into a module. A built-in Javascript PDF parser reads securely natively, feeds the text to Gemini AI, and automatically generates targeted Multiple Choice (MCQ) and Fill-in-the-Blank (FITB) questions. 
* **Dynamic Master-Plan:** The AI analyzes all your installed chapters and merges them into an aesthetic, highly informative "Course Master Plan" that you can read straight from the Knowledge Base screen.
* **Mock Exam Simulator:** Drop a past year PDF into the exam portal. The AI reverse-engineers the paper's difficulty and structure (e.g. 5 markers, 10 markers) and outputs a *look-alike* Mock Exam. It provides a long-scrolling document for you to interactively type your answers, and features a one-click automated grading panel to overlay your solutions alongside the AI's answer key!

## 🛠️ Tech Stack Architecture
- **Frontend / Graphics**: Vanilla HTML, CSS (`styles.css`, `knowledge.css`), JavaScript
- **Local Parsing**: `pdf.js` library (loaded via CDN)
- **AI Processing**: Google Gemini 2.5 Flash API explicitly queried via REST from the client side `ai_service.js`.

## 🚀 How to Run Locally

You do not need a backend webserver! 

1. `git clone https://github.com/ruilong01/comms-marathon-pwa.git`
2. Open the directory and simply run or double-click `index.html` in any modern web browser.
3. Click the **⚙️ API Settings** button on the top right.
4. Paste your **Google Gemini API Key**. (This is only saved inside your local `localStorage` vault and will NEVER be transmitted anywhere else or committed to source control).
5. Click **Create Module**, drop in your PDFs, and let the AI generate your platform!

## 🔐 Security Notice 

**DO NOT hardcode your Gemini API Key directly into `ai_service.js`!**
The application is purposefully designed to query your browser's private local environment for the API key `localStorage.getItem('GEMINI_API_KEY')`. If you deploy this to GitHub Pages or Netlify, anyone visiting your link can just drop their own API key in the settings gear to use your PWA safely.
