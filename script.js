const API_URL = 'http://localhost:3000/api';

window.addEventListener('DOMContentLoaded', () => {
    const tl = gsap.timeline({ defaults: { ease: "power4.out", duration: 1 } });
    
    tl.to("#hero-sub", { opacity: 1, y: 0, startAt: { y: 20 } })
      .to("#hero-title", { opacity: 1, y: 0, startAt: { y: 30 } }, "-=0.75")
      .to("#hero-tag", { opacity: 1, y: 0, startAt: { y: 30 } }, "-=0.75")
      .to("#hero-desc", { opacity: 1, y: 0, startAt: { y: 20 } }, "-=0.75")
      .to("#hero-btn", { opacity: 1, scale: 1, startAt: { scale: 0.9 } }, "-=0.5");

    loadProjects();
});

async function loadProjects() {
    const grid = document.getElementById('project-grid');
    try {
        const response = await fetch(`${API_URL}/projects`);
        const projects = await response.json();
        
        grid.innerHTML = ''; 

        projects.forEach(project => {
            const tagsHTML = project.tags.map(tag => `<span class="bg-slate-900 px-2 py-1 rounded">${tag}</span>`).join('');
            
            const article = document.createElement('article');
            article.className = 'project-card bg-slate-800/50 border border-slate-700/50 p-6 rounded-lg hover:border-amber-500/50 transition-all flex flex-col justify-between';
            article.setAttribute('data-category', project.category);
            
            article.innerHTML = `
                <div>
                    <span class="text-xs font-mono text-amber-500 uppercase tracking-wider block mb-2">${project.tags.join(' & ')}</span>
                    <h3 class="text-xl font-bold text-white mb-3">${project.title}</h3>
                    <p class="text-slate-400 text-sm mb-6">${project.description}</p>
                </div>
                <div class="flex flex-wrap gap-2 text-xs font-mono text-slate-400">
                    ${tagsHTML}
                </div>
            `;
            grid.appendChild(article);
        });
        
        setupFilterLogic();
    } catch (error) {
        grid.innerHTML = '<p class="text-red-400">Failed to load projects dynamic content.</p>';
    }
}

function setupFilterLogic() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => {
                btn.setAttribute('aria-selected', 'false');
                btn.className = 'filter-btn bg-slate-800 text-slate-300 hover:bg-slate-700 px-4 py-2 rounded text-sm font-bold transition-all focus:ring-2 focus:ring-amber-500';
            });

            button.setAttribute('aria-selected', 'true');
            button.className = 'filter-btn bg-amber-500 text-slate-950 px-4 py-2 rounded text-sm font-bold transition-all focus:ring-2 focus:ring-amber-500';

            const filterValue = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (filterValue === 'all' || cardCategory === filterValue) {
                    card.classList.remove('hidden');
                    gsap.fromTo(card, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.4 });
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
}

const smartForm = document.getElementById('smart-form');
const toastContainer = document.getElementById('toast-container');

smartForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    let isValid = true;
    const inputs = smartForm.querySelectorAll('input, textarea');
    
    const data = {};
    inputs.forEach(input => {
        const formGroup = input.parentElement;
        if (input.required && !input.value.trim()) {
            formGroup.classList.add('invalid');
            isValid = false;
        } else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
            formGroup.classList.add('invalid');
            isValid = false;
        } else {
            formGroup.classList.remove('invalid');
            data[input.id] = input.value;
        }
    });

    if (isValid) {
        try {
            const response = await fetch(`${API_URL}/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const toast = document.createElement('div');
                toast.className = 'toast';
                toast.innerText = 'Message sent and stored on server!';
                toastContainer.appendChild(toast);
                smartForm.reset();
                setTimeout(() => toast.remove(), 4000);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    }
});