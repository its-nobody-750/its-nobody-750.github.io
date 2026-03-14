// Mobile Navigation
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    const spans = navToggle.querySelectorAll('span');
    if (navMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translateY(9px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translateY(-9px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Close menu on link click
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const spans = navToggle.querySelectorAll('span');
        spans.forEach(span => span.style.transform = 'none');
        spans[1].style.opacity = '1';
    });
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply fade-in animations
document.querySelectorAll('.timeline-item, .project-card, .capability-module, .contact-panel, .data-block').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(el);
});

// Hologram rotation effect
const hologramRing = document.querySelector('.hologram-ring');
if (hologramRing) {
    let rotation = 0;
    setInterval(() => {
        rotation += 1;
        hologramRing.style.transform = `rotate(${rotation}deg)`;
    }, 50);
}

// Parallax effect for grid
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            const gridOverlay = document.querySelector('.grid-overlay');
            if (gridOverlay) {
                gridOverlay.style.transform = `translateY(${scrolled * 0.3}px)`;
            }
            ticking = false;
        });
        ticking = true;
    }
});

// Random tech glitch effect on project cards
function glitchEffect() {
    const projectCards = document.querySelectorAll('.project-card');
    setInterval(() => {
        const randomCard = projectCards[Math.floor(Math.random() * projectCards.length)];
        if (randomCard) {
            randomCard.style.transform = 'translateX(2px)';
            setTimeout(() => {
                randomCard.style.transform = 'translateX(-2px)';
                setTimeout(() => {
                    randomCard.style.transform = 'translateX(0)';
                }, 50);
            }, 50);
        }
    }, 5000);
}

glitchEffect();

// Mouse trail effect
const canvas = document.createElement('canvas');
canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.width = '100%';
canvas.style.height = '100%';
canvas.style.pointerEvents = 'none';
canvas.style.zIndex = '9999';
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.life = 30;
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life--;
        if (this.size > 0.2) this.size -= 0.1;
    }
    
    draw() {
        ctx.fillStyle = `rgba(0, 217, 255, ${this.life / 30})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00d9ff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

document.addEventListener('mousemove', (e) => {
    for (let i = 0; i < 2; i++) {
        particles.push(new Particle(e.clientX, e.clientY));
    }
});

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        
        if (particles[i].life <= 0) {
            particles.splice(i, 1);
            i--;
        }
    }
    
    requestAnimationFrame(animateParticles);
}

animateParticles();

// Resize canvas
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Console message
console.log('%c JARVIS INTERFACE INITIALIZED ', 'background: #00d9ff; color: #000814; font-size: 16px; font-weight: bold; padding: 8px 16px; font-family: Orbitron;');
console.log('%c ALL SYSTEMS OPERATIONAL ', 'background: #000814; color: #00d9ff; font-size: 12px; padding: 6px 12px; border: 2px solid #00d9ff; font-family: Rajdhani;');
console.log('%c Neural Network: ONLINE | Holographic Display: ACTIVE | AI Cores: STABLE ', 'color: #90e0ef; font-size: 11px; font-family: Rajdhani;');
