window.addEventListener('DOMContentLoaded', () => {
    const tl = gsap.timeline({ defaults: { ease: "power4.out", duration: 1 } });
    
    tl.to("#hero-sub", { opacity: 1, y: 0, startAt: { y: 20 } })
      .to("#hero-title", { opacity: 1, y: 0, startAt: { y: 30 } }, "-=0.75")
      .to("#hero-tag", { opacity: 1, y: 0, startAt: { y: 30 } }, "-=0.75")
      .to("#hero-desc", { opacity: 1, y: 0, startAt: { y: 20 } }, "-=0.75")
      .to("#hero-btn", { opacity: 1, scale: 1, startAt: { scale: 0.9 } }, "-=0.5");
});

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

    button.addEventListener('keydown', (e) => {
        const buttonsArray = Array.from(filterButtons);
        const currentIndex = buttonsArray.indexOf(button);

        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            const nextIndex = (currentIndex + 1) % buttonsArray.length;
            buttonsArray[nextIndex].focus();
            buttonsArray[nextIndex].click();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            const prevIndex = (currentIndex - 1 + buttonsArray.length) % buttonsArray.length;
            buttonsArray[prevIndex].focus();
            buttonsArray[prevIndex].click();
        }
    });
});