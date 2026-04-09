// ── Smooth scroll for nav anchors ──
document.querySelectorAll('.nav-pill[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// ── Highlight active nav pill on scroll ──
const sections = document.querySelectorAll('.kb-section[id]');
const pills = document.querySelectorAll('.nav-pill');

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            pills.forEach(p => p.classList.remove('active'));
            const active = document.querySelector(`.nav-pill[href="#${entry.target.id}"]`);
            if (active) active.classList.add('active');
        }
    });
}, { threshold: 0.4 });

sections.forEach(s => observer.observe(s));

// ── Entrance animation on scroll ──
const cards = document.querySelectorAll('.concept-card, .info-card, .diagram-card, .highlight-card, .steps-card');
const fadeIn = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.08 });

cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(24px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    fadeIn.observe(card);
});

// ── Smart Search Filter ──
const searchInput = document.getElementById('kbSearch');
if (searchInput) {
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        const allSections = document.querySelectorAll('.kb-section');
        
        allSections.forEach(section => {
            let sectionHasMatch = false;
            
            // Allow matching the section title itself
            const sectionTitleBlock = section.querySelector('.section-header');
            const sectionTitleText = sectionTitleBlock ? sectionTitleBlock.innerText.toLowerCase() : '';
            const titleMatches = sectionTitleText.includes(query);

            // Iterate over all semantic child cards inside this section
            const childCards = section.querySelectorAll('.concept-card, .info-card, .diagram-card, .highlight-card, .steps-card, .kb-accordion');
            
            childCards.forEach(card => {
                const cardText = card.innerText.toLowerCase();
                // If the query matches the card text OR the section title encompasses it
                if (cardText.includes(query) || titleMatches || query === '') {
                    card.style.display = ''; // Revert to grid/flex
                    
                    // If it's an accordion and matched the query inherently, auto-expand it for UX (unless query is empty)
                    if (query !== '' && card.tagName && card.tagName.toLowerCase() === 'details') {
                        card.setAttribute('open', 'true');
                    }
                    
                    sectionHasMatch = true;
                } else {
                    card.style.display = 'none'; // Vanish it algebraically
                }
            });
            
            // If absolutely nothing matches in this section, hide the entire section header too
            if (sectionHasMatch || query === '') {
                section.style.display = '';
            } else {
                section.style.display = 'none';
            }
        });
    });
}
