/**
 * chatbot.js
 * Injects a floating AI Tutor into the DOM and handles contextual chat logic.
 */

(function initChatbot() {
    // 1. Inject CSS link if not present
    if (!document.querySelector('link[href*="chatbot.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'chatbot.css';
        document.head.appendChild(link);
    }

    // 2. Inject HTML Skeleton
    const botHtml = `
        <div class="chatbot-fab" id="cb-fab">🤖</div>
        <div class="chatbot-panel" id="cb-panel">
            <div class="chat-header">
                <span class="chat-title">AI Tutor</span>
                <div>
                    <button id="cb-settings-btn" style="background:none; border:none; color:white; cursor:pointer;" title="API Key">🔑</button>
                    <button id="cb-close-btn" style="background:none; border:none; color:white; cursor:pointer; margin-left: 10px;">✖</button>
                </div>
            </div>
            
            <div class="chat-messages" id="cb-messages">
                <div class="chat-bubble ai">Hello! I am your AI Tutor for this module. Ask me anything!</div>
            </div>
            
            <div class="chat-typing" id="cb-typing">AI is thinking...</div>

            <div class="chat-input-area">
                <input type="text" id="cb-input" class="chat-input" placeholder="Ask a question...">
                <button class="chat-send" id="cb-send">Send</button>
            </div>

            <!-- Settings Overlay -->
            <div class="chat-settings-overlay" id="cb-settings">
                <h3 style="color:white; margin-top:0;">Global API Key</h3>
                <p style="color:#a0a5ba; font-size:0.8rem; text-align:center;">Change your Gemini API Key directly from here.</p>
                <input type="text" id="cb-api-input" class="chat-input" style="width: 80%; margin-bottom: 20px;" placeholder="AIzaSy...">
                <button class="chat-send" id="cb-save-key" style="padding: 10px 20px;">Save Key</button>
                <button id="cb-close-settings" style="background:none; border:none; color:#a0a5ba; margin-top: 10px; cursor:pointer;">Cancel</button>
            </div>
        </div>
    `;
    
    const wrapper = document.createElement('div');
    wrapper.innerHTML = botHtml;
    document.body.appendChild(wrapper);

    // 3. Logic Setup
    const fab = document.getElementById('cb-fab');
    const panel = document.getElementById('cb-panel');
    const closeBtn = document.getElementById('cb-close-btn');
    const sendBtn = document.getElementById('cb-send');
    const input = document.getElementById('cb-input');
    const messages = document.getElementById('cb-messages');
    const typing = document.getElementById('cb-typing');

    const settingsBtn = document.getElementById('cb-settings-btn');
    const settingsOverlay = document.getElementById('cb-settings');
    const closeSettings = document.getElementById('cb-close-settings');
    const saveKeyBtn = document.getElementById('cb-save-key');
    const apiInput = document.getElementById('cb-api-input');

    // Toggles
    fab.addEventListener('click', () => {
        panel.classList.add('active');
        fab.style.display = 'none';
    });
    closeBtn.addEventListener('click', () => {
        panel.classList.remove('active');
        fab.style.display = 'flex';
    });

    // Settings
    settingsBtn.addEventListener('click', () => {
        apiInput.value = localStorage.getItem('GEMINI_API_KEY') || "";
        settingsOverlay.classList.add('active');
    });
    closeSettings.addEventListener('click', () => settingsOverlay.classList.remove('active'));
    saveKeyBtn.addEventListener('click', () => {
        localStorage.setItem('GEMINI_API_KEY', apiInput.value.trim());
        settingsOverlay.classList.remove('active');
        addMessage('system', 'API Key updated successfully.');
    });

    // Chat function
    function addMessage(sender, text) {
        const msg = document.createElement('div');
        msg.className = `chat-bubble ${sender === 'user' ? 'user' : 'ai'}`;
        if(sender === 'system') {
            msg.style.background = "transparent";
            msg.style.color = "#a0a5ba";
            msg.style.textAlign = "center";
            msg.style.alignSelf = "center";
        }
        msg.innerHTML = text;
        messages.appendChild(msg);
        messages.scrollTop = messages.scrollHeight;
    }

    async function handleSend() {
        const text = input.value.trim();
        if(!text) return;

        addMessage('user', text);
        input.value = '';
        typing.style.display = 'block';

        try {
            const key = localStorage.getItem('GEMINI_API_KEY');
            if(!key) throw new Error("No API key configured. Click the 🔑 to set it up.");

            // Pull dynamic context from the global window object. 
            // The host page (app.js or exam_paper.html) can set `window.getCurrentChatContext`
            let context = "The student is taking a quiz/exam.";
            if (typeof window.getCurrentChatContext === 'function') {
                context = window.getCurrentChatContext();
            }

            // Call ai_service
            if(typeof chatWithTutor !== 'function') {
                throw new Error("ai_service.js must be loaded before chatbot.");
            }
            
            const reply = await chatWithTutor(text, key, context);
            addMessage('ai', reply);
        } catch (err) {
            addMessage('system', `Error: ${err.message}`);
        } finally {
            typing.style.display = 'none';
        }
    }

    sendBtn.addEventListener('click', handleSend);
    input.addEventListener('keypress', (e) => {
        if(e.key === 'Enter') handleSend();
    });

})();
