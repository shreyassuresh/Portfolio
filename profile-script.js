// DSA Profile Page JavaScript

// Theme Toggle Functionality
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

let currentTheme = 'dark';
const themes = ['dark', 'light', 'matrix'];
const themeIcons = ['🌙', '☀️', '💚'];

themeToggle.addEventListener('click', () => {
    const currentIndex = themes.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    currentTheme = themes[nextIndex];
    
    body.setAttribute('data-theme', currentTheme);
    themeToggle.textContent = themeIcons[nextIndex];
    
    // Add transition effect
    body.style.transition = 'all 0.3s ease';
    setTimeout(() => {
        body.style.transition = '';
    }, 300);
});

// Animate stats on scroll
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

// Observe all stat cards
document.querySelectorAll('.stat-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s ease';
    observer.observe(card);
});

// Observe activity items
document.querySelectorAll('.activity-item').forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-30px)';
    item.style.transition = `all 0.6s ease ${index * 0.1}s`;
    observer.observe(item);
});

// Animate rating numbers
function animateNumber(element, target, duration = 1000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

// Animate ratings when cards come into view
const ratingObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const ratingElement = entry.target.querySelector('.rating');
            const targetValue = parseInt(ratingElement.textContent);
            animateNumber(ratingElement, targetValue);
            ratingObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-card').forEach(card => {
    ratingObserver.observe(card);
});

// Add hover effects to friend cards
document.querySelectorAll('.friend-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-5px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Add click effects to badges
document.querySelectorAll('.badge-item').forEach(badge => {
    badge.addEventListener('click', () => {
        badge.style.transform = 'scale(0.95)';
        setTimeout(() => {
            badge.style.transform = 'scale(1.05)';
        }, 100);
        setTimeout(() => {
            badge.style.transform = 'scale(1)';
        }, 200);
    });
});

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add typing effect to bio
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect when page loads
document.addEventListener('DOMContentLoaded', () => {
    const bioElement = document.querySelector('.bio');
    const originalText = bioElement.textContent;
    
    setTimeout(() => {
        typeWriter(bioElement, originalText, 80);
    }, 1000);
});

// Add particle effect to profile header
function createParticle() {
    const particle = document.createElement('div');
    particle.style.cssText = `
        position: absolute;
        width: 4px;
        height: 4px;
        background: var(--chess-green);
        border-radius: 50%;
        pointer-events: none;
        opacity: 0.7;
        animation: float 3s linear infinite;
    `;
    
    const profileHeader = document.querySelector('.profile-header');
    profileHeader.style.position = 'relative';
    profileHeader.style.overflow = 'hidden';
    
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = '100%';
    
    profileHeader.appendChild(particle);
    
    setTimeout(() => {
        particle.remove();
    }, 3000);
}

// Add floating animation CSS
const floatingCSS = `
@keyframes float {
    0% {
        transform: translateY(0) rotate(0deg);
        opacity: 0;
    }
    10% {
        opacity: 0.7;
    }
    90% {
        opacity: 0.7;
    }
    100% {
        transform: translateY(-100vh) rotate(360deg);
        opacity: 0;
    }
}
`;

const style = document.createElement('style');
style.textContent = floatingCSS;
document.head.appendChild(style);

// Create particles periodically
setInterval(createParticle, 2000);

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Add edit profile functionality
document.querySelector('.btn-edit').addEventListener('click', () => {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    `;
    
    modal.innerHTML = `
        <div style="
            background: var(--bg-secondary);
            padding: 30px;
            border-radius: 16px;
            border: 1px solid var(--border-color);
            max-width: 400px;
            width: 90%;
            text-align: center;
        ">
            <h3 style="color: var(--text-primary); margin-bottom: 20px;">Edit Profile</h3>
            <p style="color: var(--text-secondary); margin-bottom: 20px;">
                This is a demo profile page. In a real application, this would open an edit form.
            </p>
            <button onclick="this.closest('div').parentElement.remove()" style="
                background: var(--chess-green);
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 600;
            ">Close</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
});

// Add platform-specific hover effects
document.querySelectorAll('.stat-card').forEach(card => {
    const platform = card.classList[1]; // leetcode, hackerrank, etc.
    
    card.addEventListener('mouseenter', () => {
        const icon = card.querySelector('.platform-icon');
        icon.style.transform = 'scale(1.1) rotate(5deg)';
        icon.style.transition = 'transform 0.3s ease';
    });
    
    card.addEventListener('mouseleave', () => {
        const icon = card.querySelector('.platform-icon');
        icon.style.transform = 'scale(1) rotate(0deg)';
    });
});

console.log('🚀 DSA Profile page loaded successfully!');