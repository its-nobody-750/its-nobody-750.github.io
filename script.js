// Matrix Rain
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

let fontSize = 14;
let columns, drops;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    columns = Math.floor(canvas.width / fontSize);
    drops = Array(columns).fill(1);
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@%^&*()_+-=[]{}|;:,.<>?/~`';

function drawMatrix() {
    ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#00ff41';
    ctx.font = `${fontSize}px monospace`;

    for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillStyle = Math.random() > 0.98 ? '#ffffff' : '#00ff41';
        ctx.fillText(char, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

setInterval(drawMatrix, 50);

// Boot Sequence
document.addEventListener('DOMContentLoaded', () => {
    const bootLines = document.querySelectorAll('.boot-line');
    bootLines.forEach((line, index) => {
        const delay = parseInt(line.getAttribute('data-delay')) || index * 500;
        setTimeout(() => {
            line.style.animation = 'none';
            line.style.opacity = '1';
        }, delay);
    });

    setTimeout(() => {
        const bootSequence = document.getElementById('bootSequence');
        const mainContent = document.getElementById('mainContent');

        document.addEventListener('keydown', () => {
            bootSequence.style.display = 'none';
            mainContent.style.opacity = '1';
        });

        document.addEventListener('click', () => {
            bootSequence.style.display = 'none';
            mainContent.style.opacity = '1';
        });
    }, 3500);
});

// Typewriter Effect
function typewriter(element, text, speed = 30) {
    let i = 0;
    element.textContent = '';

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed + Math.random() * 20);
        }
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                type();
                observer.unobserve(element);
            }
        });
    }, { threshold: 0.5 });

    observer.observe(element);
}

document.addEventListener('DOMContentLoaded', () => {
    const typewriterEl = document.querySelector('.typewriter');
    if (typewriterEl) {
        const text = typewriterEl.getAttribute('data-text');
        if (text) {
            typewriter(typewriterEl, text, 25);
        }
    }
});

// Mobile Navigation
const navBurger = document.getElementById('navBurger');
const navLinks = document.getElementById('navLinks');

if (navBurger && navLinks) {
    navBurger.addEventListener('click', () => {
        navLinks.classList.toggle('active');

        const spans = navBurger.querySelectorAll('span');
        if (navLinks.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translateY(6px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translateY(-6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const spans = navBurger.querySelectorAll('span');
            spans.forEach(span => {
                span.style.transform = 'none';
                span.style.opacity = '1';
            });
        });
    });
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80;
            const targetPosition = target.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.timeline-card, .project-card, .skill-category, .highlight, .contact-link').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Parallax effect for orbs (keeping for bg-gradient)
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            const bgGradient = document.querySelector('.bg-gradient');
            if (bgGradient) {
                bgGradient.style.transform = `translateY(${scrolled * 0.3}px)`;
            }
            ticking = false;
        });
        ticking = true;
    }
});

// Nav background on scroll
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        nav.style.background = 'rgba(10, 10, 10, 0.98)';
        nav.style.borderBottomColor = 'rgba(0, 255, 65, 0.2)';
    } else {
        nav.style.background = 'rgba(10, 10, 10, 0.9)';
        nav.style.borderBottomColor = 'rgba(0, 255, 65, 0.15)';
    }
});

// Random glitch effect on section titles
setInterval(() => {
    const titles = document.querySelectorAll('.section-title, .gradient-text');
    titles.forEach(title => {
        if (Math.random() > 0.97) {
            title.style.textShadow = `${Math.random() > 0.5 ? '#00ff41' : '#ff3333'} ${Math.random() > 0.5 ? '2px' : '-2px'} 0 2px`;
            setTimeout(() => {
                title.style.textShadow = 'none';
            }, 100);
        }
    });
}, 3000);

// Console easter egg
console.log('%c┌─────────────────────────────────┐', 'color: #00ff41; font-family: monospace;');
console.log('%c│  SYSTEM ACCESS: GRANTED          │', 'color: #00ff41; font-family: monospace;');
console.log('%c│  USER: MICAIAH RAJ               │', 'color: #00ff41; font-family: monospace;');
console.log('%c│  STATUS: PORTFOLIO LOADED        │', 'color: #00ff41; font-family: monospace;');
console.log('%c│  "Talk is cheap. Show me the     │', 'color: #00ff41; font-family: monospace;');
console.log('%c│   code." — Linus Torvalds        │', 'color: #00ff41; font-family: monospace;');
console.log('%c└─────────────────────────────────┘', 'color: #00ff41; font-family: monospace;');
