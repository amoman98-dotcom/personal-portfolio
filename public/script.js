async function loadProjects() {
    const projectsContainer = document.getElementById('project-grid') || document.getElementById('projects');
    if (!projectsContainer) return;

    try {
        const response = await fetch('/api/projects');
        const projects = await response.json();

        projectsContainer.innerHTML = projects.map(project => {
            const hasLink = !!project.link;
            const openTag = hasLink ? `<a href="${project.link}" target="_blank" class="project-card-link" style="text-decoration: none; display: block; color: inherit;"` : `<div`;
            const closeTag = hasLink ? `</a>` : `</div>`;

            return `
                ${openTag} style="border: 1px solid #1e293b; padding: 25px; border-radius: 12px; background: #0f172a; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); text-align: left; transition: transform 0.2s ease, border-color 0.2s ease; cursor: ${hasLink ? 'pointer' : 'default'};" onmouseover="this.style.borderColor='#f59e0b'; this.style.transform='translateY(-4px)'" onmouseout="this.style.borderColor='#1e293b'; this.style.transform='translateY(0)'">
                    <h3 style="margin-top: 0; margin-bottom: 10px; color: #ffffff; font-size: 1.5rem; font-weight: 600;">${project.title || project.name}</h3>
                    <p style="color: #94a3b8; line-height: 1.6; margin-bottom: 15px; font-size: 1rem;">${project.description}</p>
                    <div class="tags" style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 15px;">
                        ${(project.technologies || project.tags || []).map(tech => `
                            <span style="background: #1e293b; color: #f59e0b; padding: 6px 12px; border-radius: 6px; font-size: 0.85rem; font-weight: 500;">${tech}</span>
                        `).join('')}
                    </div>
                ${closeTag}
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

document.addEventListener('DOMContentLoaded', loadProjects);

const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        try {
            const response = await fetch('/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, message })
            });

            const result = await response.json();

            if (response.ok) {
                alert('تم إرسال رسالتك بنجاح!');
                contactForm.reset();
            } else {
                alert('حدث خطأ: ' + result.error);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('فشل الاتصال بالسيرفر.');
        }
    });
}