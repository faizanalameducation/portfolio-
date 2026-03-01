'use strict';

// ── Double skill tickers for seamless loop ─
document.querySelectorAll('.skills-ticker').forEach(t => {
    t.innerHTML += t.innerHTML;
});

// ── Init chip bars to 0 (animate on scroll) ─
document.querySelectorAll('.chip-bar-fill').forEach(b => { b.style.width = '0'; });

// ── GlowCard Spotlight (Vanilla JS port) ──────────────────────────────────────
// Stamp data-glow attribute on all portfolio and pricing cards
document.querySelectorAll('.dest-card, .pricing-card').forEach(el => {
    el.setAttribute('data-glow', '');
});

// Global pointermove tracker — feeds CSS vars for background-attachment:fixed gradient
document.addEventListener('pointermove', e => {
    const hue = (265 + (e.clientX / window.innerWidth) * 80).toFixed(0);
    const gx = e.clientX + 'px';
    const gy = e.clientY + 'px';
    document.querySelectorAll('[data-glow]').forEach(el => {
        el.style.setProperty('--gx', gx);
        el.style.setProperty('--gy', gy);
        el.style.setProperty('--ghue', hue);
    });
}, { passive: true });

// Reset glow when cursor leaves window
document.addEventListener('mouseleave', () => {
    document.querySelectorAll('[data-glow]').forEach(el => {
        el.style.setProperty('--gx', '-9999px');
        el.style.setProperty('--gy', '-9999px');
    });
});


// ── Navbar ─────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── Hamburger ──────────────────────────────
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        const open = navLinks.classList.toggle('open');
        const s = hamburger.querySelectorAll('span');
        if (open) {
            s[0].style.transform = 'rotate(45deg) translate(5px,5px)';
            s[1].style.opacity = '0';
            s[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
        } else resetHamburger();
    });
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
        navLinks.classList.remove('open'); resetHamburger();
    }));
    function resetHamburger() {
        const s = hamburger.querySelectorAll('span');
        s[0].style.transform = s[2].style.transform = '';
        s[1].style.opacity = '';
    }
}

// ── Scroll Reveal ──────────────────────────
const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ── Parallax Hero ──────────────────────────
const heroBg = document.querySelector('.hero-bg');
const heroWrap = document.querySelector('.hero-photo-wrap');
window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    if (heroBg) heroBg.style.transform = `translateY(${sy * .35}px)`;
    if (heroWrap) heroWrap.style.transform = `translateY(${sy * .15}px)`;
}, { passive: true });

document.addEventListener('mousemove', e => {
    const dx = (e.clientX / window.innerWidth - .5);
    const dy = (e.clientY / window.innerHeight - .5);
    if (heroWrap && window.scrollY < window.innerHeight) {
        heroWrap.style.transform = `translate(${dx * 14}px,${dy * 10}px)`;
    }
});

// ── Orb Parallax ──────────────────────────
document.querySelectorAll('.orb').forEach((o, i) => {
    window.addEventListener('scroll', () => {
        o.style.transform = `translateY(${window.scrollY * (i % 2 === 0 ? .1 : -.07)}px)`;
    }, { passive: true });
});

// ── Horizontal Project Scroll – drag ──────
const track = document.querySelector('.projects-scroll-track');
const dots = document.querySelectorAll('.scroll-dot');
if (track) {
    let down = false, startX, sl;
    track.addEventListener('mousedown', e => {
        down = true; track.classList.add('grabbing');
        startX = e.pageX - track.offsetLeft; sl = track.scrollLeft;
    });
    ['mouseup', 'mouseleave'].forEach(ev => document.addEventListener(ev, () => {
        down = false; track.classList.remove('grabbing');
    }));
    track.addEventListener('mousemove', e => {
        if (!down) return;
        e.preventDefault();
        track.scrollLeft = sl - (e.pageX - track.offsetLeft - startX) * 1.4;
    });
    function updateDots() {
        const cards = track.querySelectorAll('.dest-card');
        if (!cards.length || !dots.length) return;
        const idx = Math.round(track.scrollLeft / (cards[0].offsetWidth + 20));
        dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    }
    track.addEventListener('scroll', updateDots, { passive: true });
    dots.forEach((d, i) => d.addEventListener('click', () => {
        const cards = track.querySelectorAll('.dest-card');
        if (cards[i]) track.scrollTo({ left: cards[i].offsetLeft - 24, behavior: 'smooth' });
    }));
    updateDots();
}

// ── Testimonials Track – Auto-scroll + Drag ──
const tTrack = document.querySelector('.testimonials-track');
if (tTrack) {
    // Clone children for infinite scroll
    const cards = Array.from(tTrack.children);
    cards.forEach(c => {
        const clone = c.cloneNode(true);
        tTrack.appendChild(clone);
    });

    let down = false, startX, sl;
    let autoScrollSpeed = 0.8;
    let isHovering = false;
    let exactScroll = tTrack.scrollLeft;

    // Auto scroll loop
    function autoScroll() {
        if (!down && !isHovering) {
            exactScroll += autoScrollSpeed;
            tTrack.scrollLeft = exactScroll;
            // if scrolled past the first set, reset to 0 seamlessly
            if (tTrack.scrollLeft >= tTrack.scrollWidth / 2) {
                exactScroll = 0;
                tTrack.scrollLeft = 0;
            }
        } else {
            // Sync exactScroll so dragging doesn't jump when auto-scroll resumes
            exactScroll = tTrack.scrollLeft;
        }
        requestAnimationFrame(autoScroll);
    }
    requestAnimationFrame(autoScroll);

    tTrack.addEventListener('mouseenter', () => isHovering = true);
    tTrack.addEventListener('mouseleave', () => { isHovering = false; down = false; tTrack.classList.remove('grabbing'); });

    tTrack.addEventListener('mousedown', e => {
        down = true; tTrack.classList.add('grabbing');
        startX = e.pageX - tTrack.offsetLeft; sl = tTrack.scrollLeft;
        exactScroll = sl;
    });

    document.addEventListener('mouseup', () => {
        down = false; tTrack.classList.remove('grabbing');
    });

    tTrack.addEventListener('mousemove', e => {
        if (!down) return;
        e.preventDefault();
        tTrack.scrollLeft = sl - (e.pageX - tTrack.offsetLeft - startX) * 1.5;
    });

    // Touch support
    let tx = 0;
    tTrack.addEventListener('touchstart', e => { tx = e.touches[0].pageX; down = true; isHovering = true; }, { passive: true });
    tTrack.addEventListener('touchend', () => { down = false; isHovering = false; });
    tTrack.addEventListener('touchmove', e => {
        if (!down) return;
        tTrack.scrollLeft -= e.touches[0].pageX - tx;
        tx = e.touches[0].pageX;
    }, { passive: true });
}

// ── Glow Spotlight (Pricing, Service, Exp chips) ──
function initSpotlight(selector, glowClass) {
    document.querySelectorAll(selector).forEach(card => {
        let glow = card.querySelector(glowClass ? glowClass : '.card-glow');
        if (!glow) {
            glow = Object.assign(document.createElement('div'), { className: 'card-glow' });
            card.prepend(glow);
        }
        card.addEventListener('mousemove', e => {
            const r = card.getBoundingClientRect();
            card.style.setProperty('--cx', (e.clientX - r.left) + 'px');
            card.style.setProperty('--cy', (e.clientY - r.top) + 'px');
        });
    });
}
initSpotlight('.pricing-card');
initSpotlight('.service-card');
initSpotlight('.exp-chip', '.chip-glow');

// Fix chip glow var names
document.querySelectorAll('.exp-chip').forEach(card => {
    card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        card.querySelector('.chip-glow')?.style.setProperty('--cx', (e.clientX - r.left) + 'px');
        card.querySelector('.chip-glow')?.style.setProperty('--cy', (e.clientY - r.top) + 'px');
    });
});

// ── Ticker pause on hover ──────────────────
document.querySelectorAll('.skills-ticker').forEach(t => {
    t.addEventListener('mouseenter', () => t.style.animationPlayState = 'paused');
    t.addEventListener('mouseleave', () => t.style.animationPlayState = 'running');
});

// ── 3D Tilt ────────────────────────────────
['pricing-card', 'service-card', 'tp-card', 'tp-featured'].forEach(cls => {
    document.querySelectorAll('.' + cls).forEach(card => {
        card.addEventListener('mousemove', e => {
            const r = card.getBoundingClientRect();
            const dx = (e.clientX - r.left - r.width / 2) / (r.width / 2);
            const dy = (e.clientY - r.top - r.height / 2) / (r.height / 2);
            card.style.transform = `perspective(800px) rotateY(${dx * 5}deg) rotateX(${-dy * 5}deg) translateY(-8px)`;
        });
        card.addEventListener('mouseleave', () => card.style.transform = '');
    });
});

// ── Experience Tabs ────────────────────────
const tabBtns = document.querySelectorAll('.exp-tab-btn');
const tabPanels = document.querySelectorAll('.exp-panel');
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanels.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const panel = document.getElementById('panel-' + btn.dataset.panel);
        if (panel) panel.classList.add('active');
    });
});

// Chip bar animation on scroll
const chipObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.querySelectorAll('.chip-bar-fill').forEach(bar => {
                bar.style.width = bar.dataset.w;
            });
        }
    });
}, { threshold: 0.2 });
document.querySelectorAll('.exp-panel').forEach(p => chipObs.observe(p));
// Also init for tab switch
tabBtns.forEach(btn => btn.addEventListener('click', () => {
    const panel = document.getElementById('panel-' + btn.dataset.panel);
    if (panel) panel.querySelectorAll('.chip-bar-fill').forEach(bar => { bar.style.width = bar.dataset.w; });
}));

// ── Count-up ───────────────────────────────
function animateCount(el, target) {
    let s = 0;
    const step = ts => {
        if (!s) s = ts;
        const p = Math.min((ts - s) / 1800, 1);
        const e = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(e * target) + (el.dataset.suffix || '');
        if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
}
const statObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { animateCount(e.target, +e.target.dataset.count); statObs.unobserve(e.target); } });
}, { threshold: .5 });
document.querySelectorAll('[data-count]').forEach(el => statObs.observe(el));

// ── Active nav link ────────────────────────
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
const activeObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            const id = e.target.id;
            navAnchors.forEach(a => {
                const on = a.getAttribute('href') === '#' + id;
                a.style.color = on ? 'var(--al)' : '';
                a.style.background = on ? 'rgba(124,58,237,.13)' : '';
            });
        }
    });
}, { threshold: .35 });
sections.forEach(s => activeObs.observe(s));

// ── WhatsApp & Gmail ───────────────────────
function getForm() {
    return {
        name: ((document.getElementById('fname')?.value || '') + ' ' + (document.getElementById('lname')?.value || '')).trim(),
        email: document.getElementById('email')?.value?.trim() || '',
        subject: document.getElementById('subject')?.value?.trim() || 'Portfolio Enquiry',
        message: document.getElementById('message')?.value?.trim() || '',
    };
}
document.getElementById('btnWhatsApp')?.addEventListener('click', () => {
    const { name, email, subject, message } = getForm();
    if (!name || !message) { alert('Please fill in your name and message.'); return; }
    const txt = `👋 Hello Faizan!\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`;
    window.open(`https://wa.me/917061969508?text=${encodeURIComponent(txt)}`, '_blank');
});
document.getElementById('btnGmail')?.addEventListener('click', () => {
    const { name, email, subject, message } = getForm();
    if (!name || !message) { alert('Please fill in your name and message.'); return; }
    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
    window.open(`https://mail.google.com/mail/?view=cm&to=faizanalameducation@gmail.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
});

// ── Smooth scroll ──────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const t = document.querySelector(a.getAttribute('href'));
        if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
    });
});

// ── Section parallax ───────────────────────
const pSecs = document.querySelectorAll('[data-parallax]');
function runParallax() {
    pSecs.forEach(el => {
        const r = el.getBoundingClientRect();
        const spd = parseFloat(el.dataset.parallax) || .2;
        el.style.transform = `translateY(${(r.top + r.height / 2 - window.innerHeight / 2) * spd}px)`;
    });
}
window.addEventListener('scroll', runParallax, { passive: true });
runParallax();

// ── Make Portfolio Cards Clickable ─────────
document.querySelectorAll('.dest-card').forEach(card => {
    card.addEventListener('click', (e) => {
        if (!e.target.closest('.dest-card-link')) {
            const link = card.querySelector('.dest-card-link');
            if (link) link.click();
        }
    });
});
