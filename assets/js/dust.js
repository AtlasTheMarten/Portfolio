/* Dust: golden motes drifting through the footer, around the marten, after the Dust in His Dark Materials.
   The canvas lives inside the footer (plus a soft-faded strip above it), so the rest of the page stays clear.
   - Streams: motes flow in a few breathing, wispy ribbons across the screen.
   - Branching: now and then a small cohort peels off one stream and arcs over to join a neighbour, together.
   - Signals: soft pulses run down a stream faster than the drift, brightening the motes they pass.
   - Somas: faint neuron cell bodies bloom on a stream, gather the Dust through them, then fade and reappear elsewhere.
   - Attention: streams bow toward the cursor and nearby motes lean in.
   Respects prefers-reduced-motion (draws one still frame). */
(function () {
  const host = document.querySelector(".contact");
  if (!host) return;
  const cv = document.createElement("canvas");
  cv.className = "dust"; cv.setAttribute("aria-hidden", "true");
  host.prepend(cv);
  const ctx = cv.getContext("2d");
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let W = -1, H = -1, dpr = Math.min(devicePixelRatio || 1, 2), parts = [], streams = [], somas = [], raf = 0, t = 0, nextMigrate = 200;
  const mouse = { x: 0, y: 0, on: false };
  const att = { x: 0, y: 0, k: 0 };   // eased 'attention' that drifts after the cursor and fades in/out
  const COHORTS = 6;
  const rnd = (a, b) => a + Math.random() * (b - a);
  const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;

  function makeStreams() {
    const n = Math.max(3, Math.round(H / 380));
    streams = Array.from({ length: n }, (_, i) => ({
      i, base: (i + .5) * H / n + rnd(-50, 50), amp: Math.min(rnd(40, 100), H * .12), k: rnd(.0018, .004), ph: rnd(0, 6.28),
      slope: rnd(-.1, .05), speed: rnd(.18, .3), width: rnd(12, 26), pulses: [], nextPulse: rnd(60, 400) }));
  }
  function pathY(s, x) {
    let y = s.base + s.slope * x + s.amp * Math.sin(x * s.k + s.ph + t * .00012) + s.amp * .4 * Math.sin(x * s.k * 2.3 + s.ph * 1.7 - t * .00008);
    if (att.k > .001) {   // bow toward the cursor, fading smoothly with distance
      const dx = x - att.x, dy = att.y - y;
      y += dy * .16 * att.k * Math.exp(-(dx * dx) / 70000) * Math.exp(-(dy * dy) / 90000);
    }
    return y;
  }
  function spawn(anywhere) {
    const loose = Math.random() < .08;
    return { s: loose ? null : streams[Math.floor(Math.random() * streams.length)], c: Math.floor(Math.random() * COHORTS),
      x: anywhere ? rnd(0, W) : rnd(-40, -5), y: rnd(0, H), off: gauss(), sp: rnd(.75, 1.25), r: rnd(.3, 1.4),
      a: rnd(0, 6.28), tw: rnd(.004, .014), carry: 0, dx: 0, dy: 0, lit: 0 };
  }
  // Somas: a few faint cell bodies that bloom on a stream, gather the Dust through them, then fade and reappear elsewhere.
  function newSoma(phase = 0) {
    const s = streams[Math.floor(Math.random() * streams.length)], x = rnd(W * .12, W * .88);
    const dendrites = Array.from({ length: Math.round(rnd(5, 8)) }, () => {
      const a = rnd(0, 6.28), len = rnd(35, 110), bend = rnd(-.6, .6);
      return { a, len, bend, fork: Math.random() < .5 ? rnd(.45, .75) : 0, fa: a + rnd(-.8, .8) };
    });
    return { s, x, y: pathY(s, x), R: rnd(60, 95), phase, life: rnd(1800, 2800), k: 0, dendrites };
  }
  function drawSoma(n) {
    if (n.k < .01) return;
    ctx.strokeStyle = `rgba(242, 196, 107, ${.016 * n.k})`; ctx.lineWidth = .7;
    for (const d of n.dendrites) {
      const ex = n.x + Math.cos(d.a) * d.len, ey = n.y + Math.sin(d.a) * d.len;
      const cx = n.x + Math.cos(d.a + d.bend) * d.len * .5, cy = n.y + Math.sin(d.a + d.bend) * d.len * .5;
      ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.quadraticCurveTo(cx, cy, ex, ey); ctx.stroke();
      if (d.fork) {
        const u = d.fork, v = 1 - u, fx = v * v * n.x + 2 * v * u * cx + u * u * ex, fy = v * v * n.y + 2 * v * u * cy + u * u * ey;
        ctx.beginPath(); ctx.moveTo(fx, fy); ctx.lineTo(fx + Math.cos(d.fa) * d.len * .4, fy + Math.sin(d.fa) * d.len * .4); ctx.stroke();
      }
    }
    const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.R * .55);
    g.addColorStop(0, `rgba(242, 196, 107, ${.018 * n.k})`); g.addColorStop(1, "rgba(242, 196, 107, 0)");
    ctx.fillStyle = g; ctx.fillRect(n.x - n.R, n.y - n.R, n.R * 2, n.R * 2);
  }
  function gather(p) {
    for (const n of somas) {
      if (n.k < .01) continue;
      const dx = p.x - n.x, dy = p.y - n.y, d = Math.hypot(dx, dy);
      if (d > n.R * 1.6) continue;
      const w = n.k * Math.pow(Math.max(0, 1 - d / (n.R * 1.6)), 2);
      p.x -= p.s.speed * p.sp * .55 * w;                 // linger inside the cell body
      p.y = n.y + dy * (1 - .6 * w);                              // draw the stream in, so it swells into a bulb
      const sw = Math.sin(t * .0025 + p.a) * 7 * w;               // slow swirl around the centre
      p.y += (dx / (d + 1)) * sw; p.x -= (dy / (d + 1)) * sw * .15;
    }
  }
  function size() {
    const w = cv.clientWidth, h = cv.clientHeight, rebuild = w !== W || Math.abs(h - H) > 150;   // ignore phone toolbar wobble
    W = w; H = h;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!rebuild) return;
    makeStreams();
    parts = Array.from({ length: Math.min(340, Math.max(160, Math.round(W * H / 4000))) }, () => spawn(true));
    somas = Array.from({ length: Math.max(2, Math.round(H / 750)) }, () => newSoma(Math.random()));
  }
  function migrate() {
    // one cohort, within a window of one stream, crosses to a neighbouring stream as a group
    const from = streams[Math.floor(Math.random() * streams.length)];
    const to = streams[from.i + (Math.random() < .5 ? -1 : 1)] || streams[from.i - 1] || streams[from.i + 1];
    if (!to) return;
    const c = Math.floor(Math.random() * COHORTS), x0 = rnd(W * .1, W * .7);
    for (const p of parts) if (p.s === from && p.c === c && Math.abs(p.x - x0) < 180) {
      const before = p.y; p.s = to; p.carry = before - (pathY(to, p.x) + p.off * to.width);
    }
  }
  function place(p) {
    if (p.s) {
      const s = p.s;
      p.x += s.speed * p.sp;
      for (const q of s.pulses) { const d = p.x - q.x; if (d > -50 && d < 30) { p.x += .5; p.lit = Math.max(p.lit, 1 - Math.abs(d + 10) / 40); } }
      p.off += gauss() * .03; p.off *= .999;
      const breathe = 1 + .9 * Math.sin(p.x * .006 + t * .0003 + s.ph);
      p.carry *= .992;   // slow, graceful arc between streams
      p.y = pathY(s, p.x) + p.off * s.width * Math.max(.25, breathe) + p.carry;
    } else {
      p.x += .16 * p.sp; p.y += Math.sin(p.x * .01 + p.a) * .12;
    }
    if (att.k > .001) {
      const mx = att.x - (p.x + p.dx), my = att.y - (p.y + p.dy), d2 = mx * mx + my * my;
      const f = .06 * att.k * Math.exp(-d2 / 25000) / Math.sqrt(d2 + 1); p.dx += mx * f; p.dy += my * f;
    }
    if (p.s) gather(p);
    p.dx *= .985; p.dy *= .985; p.lit *= .95;
    if (p.x > W + 40) Object.assign(p, spawn(false));
  }
  function draw(p, alpha) {
    ctx.fillStyle = `rgba(242, 196, 107, ${Math.min(1, alpha)})`;
    ctx.beginPath(); ctx.arc(p.x + p.dx, p.y + p.dy, p.r * (1 + p.lit * .6), 0, 6.283); ctx.fill();
  }
  function frame() {
    t += 8;
    for (const s of streams) {
      if (--s.nextPulse <= 0) { s.pulses.push({ x: -60, v: rnd(1.4, 2.2) }); s.nextPulse = rnd(500, 1100); }
      s.pulses.forEach(q => q.x += q.v); s.pulses = s.pulses.filter(q => q.x < W + 80);
    }
    if (mouse.on) { att.x += (mouse.x - att.x) * .025; att.y += (mouse.y - att.y) * .025; att.k += (1 - att.k) * .015; } else att.k *= .985;
    somas = somas.map(n => {
      n.phase += 1 / n.life; if (n.phase >= 1) return newSoma();
      n.k = Math.pow(Math.sin(Math.PI * n.phase), 2);
      n.y = pathY(n.s, n.x);                                      // fixed along the flow, rising and falling with it
      return n;
    });
    if (--nextMigrate <= 0) { migrate(); nextMigrate = rnd(240, 520); }
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = "rgba(0,0,0,.14)"; ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = "lighter";
    somas.forEach(drawSoma);
    for (const p of parts) { place(p); p.a += p.tw; draw(p, (.35 + .65 * Math.abs(Math.sin(p.a))) * .58 + p.lit * .45); }
    raf = requestAnimationFrame(frame);
  }
  new ResizeObserver(size).observe(cv); size();
  addEventListener("pointermove", e => { const r = cv.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; if (att.k < .01) { att.x = mouse.x; att.y = mouse.y; } mouse.on = true; });
  document.addEventListener("pointerleave", () => { mouse.on = false; });
  addEventListener("blur", () => { mouse.on = false; });
  if (still) parts.forEach(p => { place(p); draw(p, .5); });
  else new IntersectionObserver(([e]) => {   // only animate while the footer is on screen
    if (e.isIntersecting && !raf) raf = requestAnimationFrame(frame);
    else if (!e.isIntersecting && raf) { cancelAnimationFrame(raf); raf = 0; }
  }).observe(cv);
})();
