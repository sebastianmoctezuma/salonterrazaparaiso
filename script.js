/* =============================================
   Terraza Paraíso — Advanced Interactions v2.0
   ============================================= */

/* ── 2. Navbar ────────────────────────────── */
(function initNavbar() {
    const navbar = document.getElementById('navbar');
    const logo = navbar ? navbar.querySelector('.logo') : null;

    function onScroll() {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Active nav link highlight on scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, { threshold: 0.4 });

    sections.forEach(s => sectionObserver.observe(s));
})();


/* ── 3. Mobile Menu ───────────────────────── */
function toggleMenu() {
    const toggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    const isOpen = navLinks.classList.toggle('active');
    toggle.classList.toggle('open', isOpen);
}

// Close on outside click
document.addEventListener('click', (e) => {
    const nav = document.querySelector('.nav-container');
    const navLinks = document.getElementById('navLinks');
    if (!nav.contains(e.target) && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        document.getElementById('menuToggle').classList.remove('open');
    }
});

// Smooth scroll + close menu
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'));
            const top = target.getBoundingClientRect().top + window.scrollY - navH;
            window.scrollTo({ top, behavior: 'smooth' });

            const navLinks = document.getElementById('navLinks');
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                document.getElementById('menuToggle').classList.remove('open');
            }
        }
    });
});


/* ── 4. Hero Parallax ─────────────────────── */
(function initParallax() {
    const heroBg = document.getElementById('heroBg');
    if (!heroBg) return;

    function updateParallax() {
        const scrollY = window.scrollY;
        const speed = 0.35;
        heroBg.style.transform = `translateY(${scrollY * speed}px)`;
    }

    window.addEventListener('scroll', updateParallax, { passive: true });
})();


/* ── 5. Scroll Reveal — data-reveal ──────── */
(function initScrollReveal() {
    const revealEls = document.querySelectorAll('[data-reveal], [data-stagger]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -60px 0px'
    });

    revealEls.forEach(el => observer.observe(el));

    // Legacy fade-in support
    document.querySelectorAll('.fade-in').forEach(el => {
        const legacyObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    legacyObs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -80px 0px' });
        legacyObs.observe(el);
    });
})();


/* ── 6. Gallery — 3D Tilt + Lightbox ────── */
(function initGallery() {
    const items = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lbImg = document.getElementById('lightboxImg');
    const lbClose = document.getElementById('lightboxClose');

    // 3D tilt on mouse move
    items.forEach(item => {
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const midX = rect.width / 2;
            const midY = rect.height / 2;
            const tiltX = ((y - midY) / midY * -6).toFixed(2);
            const tiltY = ((x - midX) / midX * 6).toFixed(2);
            item.style.setProperty('--tilt-x', tiltX + 'deg');
            item.style.setProperty('--tilt-y', tiltY + 'deg');
            item.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-8px)`;
        });

        item.addEventListener('mouseleave', () => {
            item.style.transform = '';
        });

        // Lightbox
        item.addEventListener('click', () => {
            const src = item.querySelector('img')?.src;
            if (src && lightbox && lbImg) {
                lbImg.src = src;
                lightbox.classList.add('open');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    function closeLightbox() {
        if (lightbox) {
            lightbox.classList.remove('open');
            document.body.style.overflow = '';
            setTimeout(() => { if (lbImg) lbImg.src = ''; }, 400);
        }
    }

    if (lbClose) lbClose.addEventListener('click', closeLightbox);
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    });
})();


/* ── 7. Animated Number Counters ─────────── */
(function initCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-counter'));
                const suffix = el.getAttribute('data-suffix') || '+';
                let current = 0;
                const step = Math.ceil(target / 50);
                const timer = setInterval(() => {
                    current += step;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    el.textContent = current + suffix;
                }, 30);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(el => counterObserver.observe(el));
})();


/* ── 8. Promo Cards — Magnetic Effect ────── */
(function initMagneticCards() {
    const cards = document.querySelectorAll('.promo-card, .service-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            const mag = 0.06;
            card.style.transform = `translate(${x * mag}px, ${y * mag - 12}px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
})();


/* ── 9. Contact Item — Ripple ─────────────── */
(function initRipple() {
    const items = document.querySelectorAll('.contact-item');
    items.forEach(item => {
        item.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.cssText = `
        position:absolute; border-radius:50%;
        width:${size}px; height:${size}px;
        left:${e.clientX - rect.left - size / 2}px;
        top:${e.clientY - rect.top - size / 2}px;
        background:rgba(212,165,116,0.25);
        transform:scale(0); animation:rippleAnim 0.6s ease forwards;
        pointer-events:none;
      `;
            if (!this.style.position) this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            ripple.addEventListener('animationend', () => ripple.remove());
        });
    });

    // Inject ripple keyframe
    const style = document.createElement('style');
    style.textContent = `
    @keyframes rippleAnim {
      to { transform: scale(2); opacity: 0; }
    }
  `;
    document.head.appendChild(style);
})();


/* ── 10. Form Section ─────────────────────── */
(function initForm() {
    const form = document.querySelector('.contact-form');
    const formMessage = document.getElementById('form-message');
    if (!form) return;

    // Floating label effect
    form.querySelectorAll('input, select, textarea').forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        input.addEventListener('blur', () => {
            if (!input.value) input.parentElement.classList.remove('focused');
        });
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const btn = this.querySelector('.form-button');
        btn.textContent = 'Enviando…';
        btn.disabled = true;

        setTimeout(() => {
            formMessage.style.display = 'block';
            form.reset();
            btn.textContent = 'Enviar solicitud';
            btn.disabled = false;
            setTimeout(() => { formMessage.style.display = 'none'; }, 5000);
        }, 1000);
    });
})();


/* ── 11. Section Header — Typewriter tag ─── */
(function initTypewriter() {
    const tags = document.querySelectorAll('.section-tag');
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const text = el.textContent;
                el.textContent = '';
                let i = 0;
                const t = setInterval(() => {
                    el.textContent += text[i];
                    i++;
                    if (i >= text.length) clearInterval(t);
                }, 55);
                obs.unobserve(el);
            }
        });
    }, { threshold: 0.8 });
    tags.forEach(t => obs.observe(t));
})();