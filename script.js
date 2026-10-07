// ---------- section navigation ----------
document.querySelectorAll("[data-next]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const next = document.getElementById(btn.dataset.next);
    if (!next) return;
    next.classList.remove("hidden");
    next.classList.add("reveal");
    next.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// ---------- floating hearts background ----------
const heartsBox = document.getElementById("hearts");
const heartEmojis = ["❤️", "💖", "💕", "💗", "🌸"];

function spawnHeart() {
  const h = document.createElement("span");
  h.className = "heart";
  h.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
  h.style.left = Math.random() * 100 + "vw";
  h.style.fontSize = 14 + Math.random() * 22 + "px";
  h.style.animationDuration = 7 + Math.random() * 7 + "s";
  heartsBox.appendChild(h);
  setTimeout(() => h.remove(), 15000);
}
setInterval(spawnHeart, 900);

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

const colors = ["#fb7185", "#e11d48", "#fbbf24", "#f9a8d4", "#a78bfa", "#34d399", "#60a5fa"];

function burst() {
  for (let i = 0; i < 180; i++) {
    pieces.push({
      x: canvas.width / 2,
      y: canvas.height * 0.6,
      vx: (Math.random() - 0.5) * 18,
      vy: -Math.random() * 18 - 4,
      size: 6 + Math.random() * 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      life: 0,
    });
  }
  if (!running) { running = true; requestAnimationFrame(tick); }
}

function tick() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  pieces.forEach((p) => {
    p.vy += 0.35;
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vr;
    p.life++;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
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
  burst();
  setTimeout(burst, 350);
  setTimeout(burst, 700);
});
