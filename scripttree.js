const arr = []; // tree particles
const c = document.querySelector("#c");
const ctx = c.getContext("2d");
const cw = (c.width = 4000);
const ch = (c.height = 4000);
const T = Math.PI * 2;
const m = { x: cw / 2, y: 0 };
const xTo = gsap.quickTo(m, "x", { duration: 1.5, ease: "expo" });
const yTo = gsap.quickTo(m, "y", { duration: 1.5, ease: "expo" });

const arr2 = []; // snow particles
const c2 = document.querySelector("#c2");
const ctx2 = c2.getContext("2d");
c2.width = c2.height = 4000;

c.addEventListener("pointermove", (e) => {
  const rect = c.getBoundingClientRect();
  const mouseX = e.x - rect.left;
  const mouseY = e.y - rect.top;
  const scaleX = c.width / rect.width;
  const scaleY = c.height / rect.height;
  const scaledMouseX = mouseX * scaleX;
  const scaledMouseY = mouseY * scaleY;
  xTo(scaledMouseX);
  yTo(scaledMouseY);
});

for (let i = 0; i < 999; i++) {
  arr.push({
    i: i,
    cx: cw / 2,
    cy: gsap.utils.mapRange(0, 999, 600, 3700, i),
    r: i < 900 ? gsap.utils.mapRange(0, 999, 3, 770, i) : 50,
    dot: 9, // dot radius
    prog: 0.25,
    s: 1,
  });

  const d = 99; // tree spin duration
  arr[i].t = gsap
    .timeline({ repeat: -1 })
    .to(arr[i], { duration: d, prog: "+=1", ease: "slow(0.3, 0.4)" })
    .to(arr[i], { duration: d / 2, s: 0.15, repeat: 1, yoyo: true, ease: "power3.inOut" }, 0)
    .seek(Math.random() * d);

  arr2.push({
    x: cw * Math.random(),
    y: -9,
    i: i,
    s: 3 + 5 * Math.random(),
    a: 0.1 + 0.5 * Math.random(),
  });

  arr2[i].t = gsap
    .to(arr2[i], { ease: "none", y: ch, repeat: -1 })
    .seek(Math.random() * 99)
    .timeScale(arr2[i].s / 700);
}

gsap.ticker.add(render);

function render() {
  ctx.clearRect(0, 0, cw, ch);
  ctx2.clearRect(0, 0, cw, ch);
  arr.forEach((p) => drawDot(p));
  arr2.forEach((p) => drawSnow(p));
}

ctx.fillStyle = ctx2.fillStyle = "#fff";
ctx.strokeStyle = "rgba(255,255,255,0.05)";
ctx.globalCompositeOperation = "lighter";

function drawDot(p) {
  const angle = p.prog * T;
  const vs = 0.2; // vertical scale of path
  const x = Math.cos(angle) * p.r + p.cx;
  const y = Math.sin(angle) * p.r * vs + p.cy;

  const d = Math.sqrt((x - m.x) ** 2 + (y - m.y) ** 2);
  const ms = gsap.utils.clamp(0.07, 1, d / cw);

  ctx.beginPath();
  ctx.arc(x, y, (p.dot * p.s) / 2 / ms, 0, T);
  ctx.fill();

  ctx.lineWidth = (p.dot * p.s * 2) / ms;
  ctx.stroke();
}

function drawSnow(p) {
  const ys = gsap.utils.interpolate(1.3, 0.1, p.y / ch);
  ctx2.save();

  ctx2.beginPath();
  ctx2.translate(p.x, p.y);
  ctx2.rotate(50 * p.t.progress());
  ctx2.arc(
    gsap.utils.interpolate(-55, 55, p.i / 999),
    gsap.utils.interpolate(-25, 25, p.i / 999),
    p.s * ys,
    0,
    T
  );
  ctx2.globalAlpha = p.a * ys;
  ctx2.fill();

  ctx2.restore();
}

// intro
gsap.from(arr, { duration: 1, dot: 0, ease: "back.out(9)", stagger: -0.0009 });
gsap.from(m, { duration: 1.5, y: ch * 1.2, ease: "power2.inOut" });
