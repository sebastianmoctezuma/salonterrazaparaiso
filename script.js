// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Fade in animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

            document.getElementById('navLinks').classList.remove('active');
        }
    });
});

// Mobile menu toggle
function toggleMenu() {
    document.getElementById('navLinks').classList.toggle('active');
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    const nav = document.querySelector('.nav-container');
    const navLinks = document.getElementById('navLinks');
    if (!nav.contains(e.target) && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
    }
});

// Netlify form submit
const form = document.querySelector('.contact-form');
const formMessage = document.getElementById('form-message');

if (form) {
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const submitButton = form.querySelector('.form-button');
        submitButton.disabled = true;
        submitButton.textContent = 'Enviando...';

        try {
            const formData = new FormData(form);

            const response = await fetch('/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams(formData).toString()
            });

            if (response.ok) {
                formMessage.style.display = 'block';
                formMessage.style.color = 'green';
                formMessage.textContent = '¡Tu solicitud fue enviada correctamente! Nos pondremos en contacto contigo pronto.';
                form.reset();

                setTimeout(() => {
                    formMessage.style.display = 'none';
                }, 5000);
            } else {
                formMessage.style.display = 'block';
                formMessage.style.color = 'red';
                formMessage.textContent = 'Hubo un problema al enviar la solicitud. Intenta nuevamente.';
            }
        } catch (error) {
            formMessage.style.display = 'block';
            formMessage.style.color = 'red';
            formMessage.textContent = 'Error de conexión. Intenta nuevamente.';
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Enviar solicitud';
        }
    });
}