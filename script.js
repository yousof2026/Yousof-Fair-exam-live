/* ════════════════════════════════════════════════════
   FairExam Landing Page — script.js
   ════════════════════════════════════════════════════ */

'use strict';

/* ─── Navbar scroll effect ─────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

/* ─── Hamburger menu ───────────────────────────────── */
document.getElementById('hamburger')?.addEventListener('click', () => {
  document.querySelector('.nav-links')?.classList.toggle('open');
});

/* ─── Particle canvas (hero background) ───────────── */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function createParticles(n = 90) {
    return Array.from({ length: n }, () => ({
      x:  Math.random() * W,
      y:  Math.random() * H,
      r:  Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      alpha: Math.random() * 0.5 + 0.15,
      color: Math.random() > 0.6 ? '0,212,255' : '124,58,237',
    }));
  }

  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 130) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,212,255,${0.07 * (1 - d / 130)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    connectParticles();
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  resize();
  particles = createParticles();
  draw();
  window.addEventListener('resize', () => { resize(); particles = createParticles(); });
})();

/* ─── Scroll reveal ────────────────────────────────── */
(function initReveal() {
  const items = document.querySelectorAll(
    '.reveal-up, .reveal-left, .reveal-right'
  );
  const observer = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        observer.unobserve(e.target);
      }
    }),
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  items.forEach(el => observer.observe(el));
})();

/* ─── Animated stat counters ───────────────────────── */
(function initCounters() {
  function animateCount(el) {
    const target = parseInt(el.dataset.target, 10);
    if (isNaN(target)) return;
    const duration = 1600;
    const step = 16;
    const steps = duration / step;
    let current = 0;
    const increment = target / steps;
    const timer = setInterval(() => {
      current = Math.min(current + increment, target);
      el.textContent = Math.round(current);
      if (current >= target) clearInterval(timer);
    }, step);
  }

  const counters = document.querySelectorAll('.stat-num[data-target]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCount(e.target);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => observer.observe(c));
})();

/* ─── Telegram demo animation ──────────────────────── */
(function initTelegramDemo() {
  const container = document.getElementById('tg-demo');
  if (!container) return;

  const messages = [
    { text: '🔔 <b>Student requesting entry</b>\n👤 Ahmed Hassan\n🪑 Seat: 12\n📋 Code: ABC789', delay: 1200, type: '' },
    { text: '✅ Student approved by teacher', delay: 3000, type: '' },
    { text: '▶️ <b>Exam started!</b>\n🕐 09:00:00\nMonitoring active.', delay: 4800, type: '' },
    { text: '⚠️ <b>Warning — Ahmed Hassan</b>\nHead turned right\nSeat: 12  🕐 09:14:22', delay: 7000, type: 'alert-msg' },
    { text: '🚨 <b>ALERT — Ahmed Hassan</b>\nMultiple violations detected\nPhoto attached 📸', delay: 9500, type: 'critical-msg' },
  ];

  let running = false;

  function runDemo() {
    if (running) return;
    running = true;
    container.innerHTML = '';

    messages.forEach(({ text, delay, type }) => {
      setTimeout(() => {
        if (!document.body.contains(container)) return;
        const div = document.createElement('div');
        div.className = `tg-msg${type ? ' ' + type : ''}`;
        // Simple html-like rendering
        div.innerHTML = text
          .replace(/<b>/g, '<strong>').replace(/<\/b>/g, '</strong>')
          .replace(/\n/g, '<br>');
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
      }, delay);
    });

    // Restart loop
    const total = messages[messages.length - 1].delay + 3500;
    setTimeout(() => { running = false; runDemo(); }, total);
  }

  // Start when hero is visible
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { runDemo(); obs.unobserve(e.target); } });
  }, { threshold: 0.3 });
  obs.observe(container);
})();

/* ─── Smooth anchor scrolling ──────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80; // navbar height
    const y = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  });
});

/* ─── Feature card tilt effect ─────────────────────── */
document.querySelectorAll('.feature-card, .det-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect  = card.getBoundingClientRect();
    const cx    = rect.left + rect.width  / 2;
    const cy    = rect.top  + rect.height / 2;
    const dx    = (e.clientX - cx) / (rect.width  / 2);
    const dy    = (e.clientY - cy) / (rect.height / 2);
    card.style.transform = `translateY(-4px) rotateX(${-dy * 4}deg) rotateY(${dx * 4}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ─── Timeline progress highlight ──────────────────── */
(function initTimeline() {
  const items = document.querySelectorAll('.timeline-item');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      e.target.querySelector('.timeline-card')?.classList.toggle(
        'timeline-active', e.isIntersecting
      );
    });
  }, { threshold: 0.5 });
  items.forEach(i => obs.observe(i));
})();
