// ---------- section navigation ----------
document.querySelectorAll("[data-next]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const current = btn.closest(".screen");
    const next = document.getElementById(btn.dataset.next);
    if (!next) return;

    // Hide current section's button after clicking
    btn.style.opacity = "0.5";
    btn.style.pointerEvents = "none";

    // Reveal next section
    next.classList.remove("hidden");
    next.classList.add("reveal");

    // Smooth scroll with a tiny delay for the animation to start
    setTimeout(() => {
      next.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  });
});

// ---------- floating hearts background ----------
const heartsBox = document.getElementById("hearts");
const heartEmojis = ["❤️", "💖", "💕", "💗", "🌸", "💜", "✨"];

function spawnHeart() {
  const h = document.createElement("span");
  h.className = "heart";
  h.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
  h.style.left = Math.random() * 100 + "vw";
  h.style.fontSize = 12 + Math.random() * 20 + "px";
  h.style.animationDuration = 8 + Math.random() * 8 + "s";
  heartsBox.appendChild(h);
  setTimeout(() => h.remove(), 17000);
}
setInterval(spawnHeart, 1200);

// ---------- sparkle cursor trail ----------
const sparklesBox = document.getElementById("sparkles");
const sparkleColors = ["#ff4d8d", "#a855f7", "#fbbf24", "#ff7eb3", "#7c3aed"];
let lastSparkle = 0;

document.addEventListener("mousemove", (e) => {
  const now = Date.now();
  if (now - lastSparkle < 60) return; // throttle
  lastSparkle = now;

  const s = document.createElement("div");
  s.className = "sparkle";
  s.style.left = e.clientX + "px";
  s.style.top = e.clientY + "px";
  s.style.background = sparkleColors[Math.floor(Math.random() * sparkleColors.length)];
  s.style.width = s.style.height = 3 + Math.random() * 5 + "px";
  s.style.boxShadow = `0 0 6px ${s.style.background}`;
  sparklesBox.appendChild(s);
  setTimeout(() => s.remove(), 800);
});

// ---------- intersection observer for scroll animations ----------
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal");
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll(".screen").forEach((section) => {
  if (!section.classList.contains("hidden")) {
    observer.observe(section);
  }
});

// ---------- confetti ----------
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");
let pieces = [];
let running = false;

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

const colors = [
  "#ff4d8d", "#a855f7", "#fbbf24", "#ff7eb3", "#7c3aed",
  "#34d399", "#60a5fa", "#f472b6", "#e879f9", "#fb923c"
];

function burst(originX, originY) {
  const x = originX || canvas.width / 2;
  const y = originY || canvas.height * 0.5;

  for (let i = 0; i < 200; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 4 + Math.random() * 16;
    pieces.push({
      x: x,
      y: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 6,
      size: 5 + Math.random() * 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.4,
      life: 0,
      shape: Math.random() > 0.5 ? "rect" : "circle",
    });
  }
  if (!running) {
    running = true;
    requestAnimationFrame(tick);
  }
}

function tick() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  pieces.forEach((p) => {
    p.vy += 0.3;
    p.vx *= 0.99;
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vr;
    p.life++;

    const alpha = Math.max(0, 1 - p.life / 200);
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 4;

    if (p.shape === "circle") {
      ctx.beginPath();
      ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
    }
    ctx.restore();
  });

  pieces = pieces.filter((p) => p.y < canvas.height + 40 && p.life < 300);
  if (pieces.length) {
    requestAnimationFrame(tick);
  } else {
    running = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

document.getElementById("celebrate").addEventListener("click", () => {
  // Multiple bursts from different positions
  burst(canvas.width * 0.3, canvas.height * 0.5);
  setTimeout(() => burst(canvas.width * 0.7, canvas.height * 0.4), 300);
  setTimeout(() => burst(canvas.width * 0.5, canvas.height * 0.3), 600);
  setTimeout(() => burst(canvas.width * 0.2, canvas.height * 0.6), 900);
  setTimeout(() => burst(canvas.width * 0.8, canvas.height * 0.5), 1100);
});
