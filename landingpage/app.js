/* ==========================================================================
   ABIAS LANDING PAGE - DYNAMIC JAVASCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Header scroll effect
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Mobile navigation menu toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            const icon = mobileToggle.querySelector('i');
            if (navMenu.classList.contains('open')) {
                icon.className = 'fa-solid fa-xmark';
            } else {
                icon.className = 'fa-solid fa-bars';
            }
        });

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                const icon = mobileToggle.querySelector('i');
                if (icon) icon.className = 'fa-solid fa-bars';
            });
        });
    }

    // 3. Score progress bar animation using IntersectionObserver
    const progressFill = document.querySelector('.progress-bar-fill');
    
    if (progressFill && 'IntersectionObserver' in window) {
        // Set initial width to 0
        progressFill.style.width = '0%';
        
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Animate to 72%
                    progressFill.style.width = '72%';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        observer.observe(document.querySelector('.progress-widget'));
    } else if (progressFill) {
        // Fallback for older browsers
        progressFill.style.width = '72%';
    }

    // 4. CTA Form Submission
    const ctaForm = document.getElementById('cta-email-form');
    if (ctaForm) {
        ctaForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = document.getElementById('cta-submit-btn');
            const emailInput = document.getElementById('cta-email-input');
            const originalText = submitBtn.textContent;
            
            // Visual loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> ENVIANDO...';

            setTimeout(() => {
                // Success feedback replacing the form
                ctaForm.innerHTML = `
                    <div style="text-align: center; padding: 20px 0; animation: fadeIn 0.5s ease-out;">
                        <i class="fa-solid fa-circle-check" style="font-size: 3rem; color: var(--success); margin-bottom: 16px;"></i>
                        <h3 style="font-size: 1.5rem; margin-bottom: 8px; font-family: var(--font-heading); color: #ffffff;">Pré-cadastro Realizado!</h3>
                        <p style="color: var(--text-secondary); font-size: 0.95rem;">Enviamos um convite exclusivo de acesso para: <strong style="color: #ffffff;">${emailInput.value}</strong></p>
                    </div>
                `;
            }, 1500);
        });
    }

    // 5. Active section navigation highlight on scroll
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 150;
            const sectionId = current.getAttribute('id');
            const navLink = document.querySelector(`.nav-menu a[href*=${sectionId}]`);
            
            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    document.querySelector('.nav-menu a.active')?.classList.remove('active');
                    navLink.classList.add('active');
                }
            }
        });
    });
});
