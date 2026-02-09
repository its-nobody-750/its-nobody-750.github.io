document.addEventListener('DOMContentLoaded', () => {
    // 1. Dynamic Greeting
    const subtitle = document.querySelector('.subtitle');
    const hour = new Date().getHours();
    let greeting = "AI & ML Engineer";

    if (hour < 12) greeting = "Good Morning! I'm an AI & ML Engineer";
    else if (hour < 18) greeting = "Good Afternoon! I'm an AI & ML Engineer";
    else greeting = "Good Evening! I'm an AI & ML Engineer";
    
    subtitle.innerText = greeting + " • AOSP Developer";

    // 2. Scroll Reveal Effect
    const cards = document.querySelectorAll('.card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    cards.forEach(card => {
        card.style.opacity = 0;
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.6s ease-out';
        observer.observe(card);
    });
});
