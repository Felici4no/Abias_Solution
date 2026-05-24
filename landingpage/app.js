/* ==========================================================================
   THE BLACK MONEY - INTERACTIVE SCRIPT
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

    // 3. Financial Calculator Simulator
    const calcAmount = document.getElementById('calc-amount');
    const calcTime = document.getElementById('calc-time');
    
    const amountLabel = document.getElementById('amount-label');
    const timeLabel = document.getElementById('time-label');
    
    const resultTotal = document.getElementById('result-total');
    const resultInvested = document.getElementById('result-invested');
    const resultProfit = document.getElementById('result-profit');

    const ANNUAL_RATE = 0.224; // 22.4% annual returns

    function formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }

    function calculateGrowth() {
        if (!calcAmount || !calcTime) return;

        const principal = parseFloat(calcAmount.value);
        const years = parseInt(calcTime.value);

        // Update UI Labels
        amountLabel.textContent = formatCurrency(principal).split(',')[0]; // Simple format without cents
        timeLabel.textContent = `${years} ${years === 1 ? 'Ano' : 'Anos'}`;

        // Compound Interest formula: A = P * (1 + r)^t
        const total = principal * Math.pow(1 + ANNUAL_RATE, years);
        const profit = total - principal;

        // Animate count-up for values
        animateValue(resultTotal, parseFloat(resultTotal.textContent.replace(/[^\d]/g, '')) / 100 || 0, total, 600, true);
        animateValue(resultInvested, parseFloat(resultInvested.textContent.replace(/[^\d]/g, '')) / 100 || 0, principal, 300, true);
        animateValue(resultProfit, parseFloat(resultProfit.textContent.replace(/[^\d]/g, '')) / 100 || 0, profit, 600, true);
    }

    function animateValue(element, start, end, duration, isCurrency = false) {
        if (!element) return;
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const currentValue = progress * (end - start) + start;
            
            if (isCurrency) {
                element.textContent = formatCurrency(currentValue);
            } else {
                element.textContent = Math.floor(currentValue);
            }

            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    if (calcAmount && calcTime) {
        calcAmount.addEventListener('input', calculateGrowth);
        calcTime.addEventListener('input', calculateGrowth);
        // Initial execution
        calculateGrowth();
    }

    // 4. Form Lead Submission
    const leadForm = document.getElementById('lead-form');
    if (leadForm) {
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = document.getElementById('form-submit-btn');
            const originalText = submitBtn.textContent;
            
            // Visual submission state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Processando...';

            setTimeout(() => {
                // Success feedback
                leadForm.innerHTML = `
                    <div style="text-align: center; padding: 40px 20px; color: var(--text-primary);">
                        <i class="fa-solid fa-circle-check" style="font-size: 4rem; color: var(--success); margin-bottom: 20px;"></i>
                        <h3 style="font-size: 1.8rem; margin-bottom: 12px; font-family: var(--font-heading);">Solicitação Recebida!</h3>
                        <p style="color: var(--text-secondary); margin-bottom: 24px;">Um consultor especializado entrará em contato nas próximas 2 horas úteis.</p>
                        <span style="font-size: 0.85rem; color: var(--color-accent-1); font-weight: 600; text-transform: uppercase;">Protocolo VIP: #${Math.floor(100000 + Math.random() * 900000)}</span>
                    </div>
                `;
            }, 1800);
        });
    }

    // 5. Active section navigation highlight
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
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
