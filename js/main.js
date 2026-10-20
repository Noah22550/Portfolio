/* ============================================================
   PORTFOLIO BTS SIO — JavaScript
   Particles, typing effect, scroll animations, news API, filters
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initTypingEffect();
    initScrollReveal();
    initNavbar();
    initProjectFilters();
    initContactForm();
    initBackToTop();
    initCountUp();
    loadNews();
});

/* ─── Particle System (Canvas) ─────────────────────── */
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null, radius: 120 };
    let animationId;

    function resize() {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    canvas.addEventListener('mousemove', e => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });
    canvas.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.6;
            this.speedY = (Math.random() - 0.5) * 0.6;
            this.opacity = Math.random() * 0.5 + 0.1;
            // Color: mix of purple and cyan
            this.hue = Math.random() > 0.5 ? 270 : 185;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Mouse interaction
            if (mouse.x !== null) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    this.x += dx * force * 0.02;
                    this.y += dy * force * 0.02;
                }
            }

            // Wrap around
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 70%, 65%, ${this.opacity})`;
            ctx.fill();
        }
    }

    function createParticles() {
        const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 100);
        particles = [];
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function connectParticles() {
        const maxDist = 130;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < maxDist) {
                    const opacity = (1 - dist / maxDist) * 0.15;
                    ctx.strokeStyle = `rgba(168, 85, 247, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        connectParticles();
        animationId = requestAnimationFrame(animate);
    }

    createParticles();
    animate();

    // Recreate particles on resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(createParticles, 200);
    });
}

/* ─── Typing Effect ────────────────────────────────── */
function initTypingEffect() {
    const element = document.getElementById('typing-text');
    if (!element) return;

    const texts = [
        'Développeur Web',
        'Étudiant BTS SIO',
        'Passionné de Tech',
        'Développeur Full-Stack',
        'Créateur d\'applications'
    ];

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 80;

    function type() {
        const currentText = texts[textIndex];

        if (isDeleting) {
            element.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 40;
        } else {
            element.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 80;
        }

        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause before deleting
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typingSpeed = 500; // Pause before next word
        }

        setTimeout(type, typingSpeed);
    }

    setTimeout(type, 1500);
}

/* ─── Scroll Reveal ────────────────────────────────── */
function initScrollReveal() {
    const elements = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger animation for siblings
                const parent = entry.target.parentElement;
                const siblings = parent ? parent.querySelectorAll('.reveal') : [];
                let delay = 0;

                siblings.forEach((sibling, i) => {
                    if (sibling === entry.target) {
                        delay = i * 100;
                    }
                });

                setTimeout(() => {
                    entry.target.classList.add('revealed');

                    // Trigger skill bars animation
                    const skillBars = entry.target.querySelectorAll('.skill-progress');
                    skillBars.forEach(bar => {
                        const width = bar.getAttribute('data-width');
                        bar.style.width = width + '%';
                    });
                }, delay);

                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(el => observer.observe(el));
}

/* ─── Navbar ───────────────────────────────────────── */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Scroll spy
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY + 100;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollY >= top && scrollY < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

/* ─── Project Filters ──────────────────────────────── */
function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');

                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                    card.style.animation = 'fadeInUp 0.5s ease-out forwards';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
}

/* ─── Load News from API ───────────────────────────── */
function loadNews() {
    const grid = document.getElementById('news-grid');
    const errorDiv = document.getElementById('news-error');

    if (!grid) return;

    // Show skeletons
    grid.style.display = 'grid';
    errorDiv.style.display = 'none';

    fetch('php/news-proxy.php')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            if (data.error) {
                throw new Error(data.error);
            }

            if (data.articles && data.articles.length > 0) {
                renderNews(data.articles, data.isDemo);
            } else {
                throw new Error('Aucun article trouvé');
            }
        })
        .catch(error => {
            console.error('Erreur de chargement des news:', error);
            grid.style.display = 'none';
            errorDiv.style.display = 'block';
        });
}

function renderNews(articles, isDemo) {
    const grid = document.getElementById('news-grid');
    if (!grid) return;

    // Icons for demo articles
    const demoIcons = [
        'ri-robot-line',
        'ri-shield-keyhole-line',
        'ri-reactjs-line',
        'ri-cloud-line',
        'ri-code-box-line',
        'ri-briefcase-4-line'
    ];

    grid.innerHTML = articles.map((article, index) => {
        const date = formatDate(article.publishedAt);
        const sourceName = article.source ? article.source.name : 'Source inconnue';
        const hasImage = article.image && !isDemo;

        return `
            <a href="${article.url}" target="_blank" rel="noopener" class="news-card reveal revealed" style="animation: fadeInUp 0.5s ease-out ${index * 100}ms both;">
                ${hasImage
                    ? `<img src="${article.image}" alt="${escapeHtml(article.title)}" class="news-card-image" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                       <div class="news-card-placeholder" style="display:none;"><i class="${demoIcons[index % demoIcons.length]}"></i></div>`
                    : `<div class="news-card-placeholder"><i class="${demoIcons[index % demoIcons.length]}"></i></div>`
                }
                <div class="news-card-content">
                    <div class="news-card-meta">
                        <span class="news-card-source">${escapeHtml(sourceName)}</span>
                        <span class="news-card-date">${date}</span>
                    </div>
                    <h3 class="news-card-title">${escapeHtml(article.title)}</h3>
                    <p class="news-card-excerpt">${escapeHtml(article.description || '')}</p>
                    <span class="news-card-read">Lire l'article <i class="ri-arrow-right-line"></i></span>
                </div>
            </a>
        `;
    }).join('');
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'Il y a quelques minutes';
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/* ─── Contact Form ─────────────────────────────────── */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const btn = form.querySelector('button[type="submit"]');
        const originalHTML = btn.innerHTML;

        // Simulate sending
        btn.innerHTML = '<i class="ri-loader-4-line" style="animation: spin 1s linear infinite;"></i> Envoi en cours...';
        btn.disabled = true;

        setTimeout(() => {
            btn.innerHTML = '<i class="ri-check-line"></i> Message envoyé !';
            btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';

            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.style.background = '';
                btn.disabled = false;
                form.reset();
            }, 3000);
        }, 1500);
    });

    // Add spin animation dynamically
    const style = document.createElement('style');
    style.textContent = `@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`;
    document.head.appendChild(style);
}

/* ─── Back to Top ──────────────────────────────────── */
function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ─── Count Up Animation ──────────────────────────── */
function initCountUp() {
    const counters = document.querySelectorAll('.stat-number');
    let animated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                counters.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-count'));
                    const duration = 2000;
                    const start = performance.now();

                    function update(currentTime) {
                        const elapsed = currentTime - start;
                        const progress = Math.min(elapsed / duration, 1);
                        // Ease out cubic
                        const eased = 1 - Math.pow(1 - progress, 3);
                        counter.textContent = Math.floor(target * eased);

                        if (progress < 1) {
                            requestAnimationFrame(update);
                        } else {
                            counter.textContent = target;
                        }
                    }

                    requestAnimationFrame(update);
                });
            }
        });
    }, { threshold: 0.5 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) observer.observe(heroStats);
}
