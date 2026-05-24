/* ==========================================================================
   ABDIAS BLACK LANDING PAGE - DYNAMIC JAVASCRIPT
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
        progressFill.style.width = '0%';
        
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    progressFill.style.width = '85%';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        observer.observe(document.querySelector('.progress-widget'));
    } else if (progressFill) {
        progressFill.style.width = '85%';
    }

    // 4. Fundo Abdias progress bar and counter animation
    const fundoBarFill = document.querySelector('.fundo-bar-fill');
    const fundoAmountDisplay = document.getElementById('fundo-amount-display');
    
    function animateCurrency(element, start, end, duration) {
        if (!element) return;
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const currentValue = progress * (end - start) + start;
            
            element.textContent = new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }).format(currentValue);

            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    if (fundoBarFill && 'IntersectionObserver' in window) {
        fundoBarFill.style.width = '0%';
        
        const observerFundo = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    fundoBarFill.style.width = '65%';
                    animateCurrency(fundoAmountDisplay, 0, 15420, 1200);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        observerFundo.observe(document.querySelector('.fundo-visual-progress'));
    } else {
        if (fundoBarFill) fundoBarFill.style.width = '65%';
        if (fundoAmountDisplay) fundoAmountDisplay.textContent = 'R$ 15.420,00';
    }

    // 5. CTA Form Lead Submission for Community List
    const ctaForm = document.getElementById('cta-comunidade-form');
    if (ctaForm) {
        ctaForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = document.getElementById('cta-submit-btn');
            const nameInput = document.getElementById('cta-name');
            const profileSelect = document.getElementById('cta-profile');
            
            // Visual loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> ENVIANDO SOLICITAÇÃO...';

            // Custom profile name formatting for feedback
            let profileLabel = "membro";
            if (profileSelect.value === "oficina") profileLabel = "oficina parceira";
            if (profileSelect.value === "apoiador") profileLabel = "apoiador";

            setTimeout(() => {
                // Success feedback replacing the form
                ctaForm.innerHTML = `
                    <div style="text-align: center; padding: 30px 10px; animation: fadeIn 0.5s ease-out; color: #ffffff;">
                        <i class="fa-solid fa-circle-check" style="font-size: 3.5rem; color: var(--success); margin-bottom: 20px;"></i>
                        <h3 style="font-size: 1.8rem; margin-bottom: 10px; font-family: var(--font-heading);">Solicitação Enviada!</h3>
                        <p style="color: var(--text-secondary); font-size: 1rem; margin-bottom: 20px;">
                            Obrigado, <strong style="color: #ffffff;">${nameInput.value}</strong>. Seu cadastro como <strong style="color: var(--color-accent-gold);">${profileLabel}</strong> foi enviado para a fila de espera da nossa rota piloto.
                        </p>
                        <span style="font-size: 0.85rem; color: var(--color-accent-pink); font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Código de Fila: #AB${Math.floor(1000 + Math.random() * 9000)}</span>
                    </div>
                `;
            }, 1600);
        });
    }

    // 6. Active section navigation highlight on scroll
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 180;
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
