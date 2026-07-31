// Hero wireframe pineapple
(function initPineapple() {
    const canvas = document.getElementById('pineappleCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const RINGS = 9;
    const SEGMENTS = 14;
    const LEAF_COUNT = 11;

    // Barrel profile: narrower at both ends, bulging in the middle
    function bodyRadius(t) {
        return 0.34 + 0.30 * Math.pow(Math.sin(Math.PI * t), 0.7);
    }

    const body = [];
    for (let i = 0; i <= RINGS; i++) {
        const t = i / RINGS;
        const y = (t - 0.5) * 1.5;
        const r = bodyRadius(t);
        const ring = [];
        for (let j = 0; j < SEGMENTS; j++) {
            const theta = (j / SEGMENTS) * Math.PI * 2;
            ring.push({ x: r * Math.cos(theta), y, z: r * Math.sin(theta) });
        }
        body.push(ring);
    }

    const crownY = 0.5 * 1.5;
    const LEAF_SECTIONS = 6;
    const leaves = [];
    for (let k = 0; k < LEAF_COUNT; k++) {
        const theta = (k / LEAF_COUNT) * Math.PI * 2;
        const baseR = 0.16;
        const len = k % 2 === 0 ? 0.95 : 0.68;
        const baseWidth = 0.17;

        const left = [];
        const right = [];
        const mid = [];
        for (let s = 0; s < LEAF_SECTIONS; s++) {
            const t = s / (LEAF_SECTIONS - 1);
            const u = len * 0.55 * t;
            const v = crownY + len * t * (1 - 0.3 * t);
            const r = baseR + u;
            const halfWidth = (baseWidth / 2) * Math.pow(1 - t, 1.4);
            const dTheta = halfWidth / Math.max(r, 0.05);
            left.push({ x: r * Math.cos(theta - dTheta), y: v, z: r * Math.sin(theta - dTheta) });
            right.push({ x: r * Math.cos(theta + dTheta), y: v, z: r * Math.sin(theta + dTheta) });
            mid.push({ x: r * Math.cos(theta), y: v, z: r * Math.sin(theta) });
        }
        leaves.push({ left, right, mid });
    }

    let size = 0;
    let angle = 0;

    function resize() {
        size = canvas.clientWidth || canvas.width;
        canvas.width = size * dpr;
        canvas.height = size * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function rotateY(p, a) {
        const cosA = Math.cos(a), sinA = Math.sin(a);
        return { x: p.x * cosA - p.z * sinA, y: p.y, z: p.x * sinA + p.z * cosA };
    }

    function project(p, scale) {
        return { x: size / 2 + p.x * scale, y: size / 2 - p.y * scale };
    }

    function strokeEdge(p1, p2, scale, colorFn) {
        const r1 = rotateY(p1, angle);
        const r2 = rotateY(p2, angle);
        const s1 = project(r1, scale);
        const s2 = project(r2, scale);
        const depth = Math.max(0.15, Math.min(1, ((r1.z + r2.z) / 2 + 0.6) / 1.2));
        ctx.strokeStyle = colorFn(depth);
        ctx.beginPath();
        ctx.moveTo(s1.x, s1.y);
        ctx.lineTo(s2.x, s2.y);
        ctx.stroke();
    }

    function draw() {
        ctx.clearRect(0, 0, size, size);
        const scale = size * 0.34;

        const bodyColor = (d) => `rgba(94, 200, 216, ${0.15 + d * 0.55})`;
        const leafColor = (d) => `rgba(255, 140, 61, ${0.25 + d * 0.6})`;

        ctx.lineWidth = 1;
        for (let i = 0; i <= RINGS; i++) {
            const ring = body[i];
            for (let j = 0; j < SEGMENTS; j++) {
                strokeEdge(ring[j], ring[(j + 1) % SEGMENTS], scale, bodyColor);
            }
        }

        for (let i = 0; i < RINGS; i++) {
            const a = body[i];
            const b = body[i + 1];
            for (let j = 0; j < SEGMENTS; j++) {
                strokeEdge(a[j], b[(j + 1) % SEGMENTS], scale, bodyColor);
                strokeEdge(a[j], b[(j - 1 + SEGMENTS) % SEGMENTS], scale, bodyColor);
            }
        }

        ctx.lineWidth = 1.2;
        leaves.forEach(({ left, right, mid }) => {
            for (let s = 0; s < left.length - 1; s++) {
                strokeEdge(left[s], left[s + 1], scale, leafColor);
                strokeEdge(right[s], right[s + 1], scale, leafColor);
                strokeEdge(mid[s], mid[s + 1], scale, leafColor);
            }
            for (let s = 0; s < left.length; s++) {
                strokeEdge(left[s], right[s], scale, leafColor);
            }
        });
    }

    resize();
    window.addEventListener('resize', resize);
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
            resize();
            if (prefersReducedMotion) draw();
        });
    }

    if (prefersReducedMotion) {
        draw();
        return;
    }

    function loop() {
        angle += 0.006;
        if (angle > Math.PI * 2) angle -= Math.PI * 2;
        draw();
        requestAnimationFrame(loop);
    }
    loop();
})();

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

// Grid background parallax
const gridBg = document.getElementById('gridBg');
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            if (gridBg) {
                const offset = window.pageYOffset * 0.15;
                gridBg.style.backgroundPosition = `${offset}px ${offset}px`;
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
        nav.style.background = 'rgba(11, 22, 34, 0.98)';
        nav.style.borderBottomColor = 'rgba(94, 200, 216, 0.25)';
    } else {
        nav.style.background = 'rgba(11, 22, 34, 0.9)';
        nav.style.borderBottomColor = 'rgba(94, 200, 216, 0.15)';
    }
});

// Console easter egg
console.log('%c+-----------------------------------+', 'color: #ff8c3d; font-family: monospace;');
console.log('%c|  DWG NO. 001 -- REV. 2026          |', 'color: #ff8c3d; font-family: monospace;');
console.log('%c|  DRAFTER: MICAIAH RAJ              |', 'color: #ff8c3d; font-family: monospace;');
console.log('%c|  STATUS: PORTFOLIO LOADED          |', 'color: #ff8c3d; font-family: monospace;');
console.log('%c|  "Talk is cheap. Show me the       |', 'color: #ff8c3d; font-family: monospace;');
console.log('%c|   code." -- Linus Torvalds         |', 'color: #ff8c3d; font-family: monospace;');
console.log('%c+-----------------------------------+', 'color: #ff8c3d; font-family: monospace;');
