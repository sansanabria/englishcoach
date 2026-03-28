// ─── CONFETTI CELEBRATION SYSTEM ─────────────────────────────────────────────
// Lightweight confetti burst for correct answers and completions

(function() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animId = null;

  const COLORS = ['#B91C1C', '#DC2626', '#C94F1A', '#F06A38', '#276047', '#1B3D7A', '#F5A623', '#6B3FA0'];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  function createParticle(x, y) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 3 + Math.random() * 6;
    return {
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 4,
      size: 4 + Math.random() * 6,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 12,
      life: 1,
      decay: 0.012 + Math.random() * 0.008,
      shape: Math.random() > 0.5 ? 'rect' : 'circle'
    };
  }

  function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.12; // gravity
      p.vx *= 0.99;
      p.rotation += p.rotSpeed;
      p.life -= p.decay;

      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation * Math.PI / 180);
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;

      if (p.shape === 'rect') {
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    if (particles.length > 0) {
      animId = requestAnimationFrame(update);
    } else {
      animId = null;
    }
  }

  // Public API: burst confetti at a position or center
  window.burstConfetti = function(x, y, count) {
    if (x === undefined) x = canvas.width / 2;
    if (y === undefined) y = canvas.height / 3;
    if (!count) count = 50;

    for (let i = 0; i < count; i++) {
      particles.push(createParticle(x + (Math.random() - 0.5) * 40, y + (Math.random() - 0.5) * 20));
    }

    if (!animId) {
      animId = requestAnimationFrame(update);
    }
  };

  // Hook into existing feedback: watch for correct answers
  const origCheckAnswer = window.checkAnswer;
  if (origCheckAnswer) {
    window.checkAnswer = function() {
      origCheckAnswer.apply(this, arguments);

      // Check if the feedback shows success
      setTimeout(function() {
        const fb = document.getElementById('ex-feedback');
        if (fb && fb.classList.contains('success') && fb.classList.contains('show')) {
          burstConfetti();
        }
      }, 50);
    };
  }

  // Also hook into congrats panel showing
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(m) {
      if (m.target.classList && m.target.classList.contains('congrats-panel') && m.target.classList.contains('show')) {
        burstConfetti(canvas.width / 2, canvas.height / 4, 80);
      }
    });
  });

  const congratsEl = document.getElementById('ex-congrats');
  if (congratsEl) {
    observer.observe(congratsEl, { attributes: true, attributeFilter: ['class'] });
  }
})();
