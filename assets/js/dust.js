/* Dust: golden motes drifting behind the page, after the Dust in His Dark Materials.
   - Streams: motes flow in a few breathing, wispy ribbons across the screen.
   - Branching: now and then a small cohort peels off one stream and arcs over to join a neighbour, together.
   - Signals: soft pulses run down a stream faster than the drift, brightening the motes they pass.
   - Somas: faint neuron cell bodies bloom on a stream, gather the Dust through them, then fade and reappear elsewhere.
   - Attention: streams bow toward the cursor and nearby motes lean in.
   - Circuit: across the content column each stream locks onto a fixed, grid-snapped trace (45° jogs, pads, stubs),
     like a circuit diagram, then loosens back into organic Dust toward the right edge. Somas live only at the edges.
   Respects prefers-reduced-motion (draws one still frame). */
(function () {
  const cv = document.createElement("canvas");
  cv.className = "dust"; cv.setAttribute("aria-hidden", "true");
  document.body.prepend(cv);
  const ctx = cv.getContext("2d");
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let W = -1, H = -1, Z = {}, dpr = Math.min(devicePixelRatio || 1, 2), parts = [], streams = [], somas = [], raf = 0, t = 0, nextMigrate = 200;
  const mouse = { x: 0, y: 0, on: false };
  const att = { x: 0, y: 0, k: 0 };   // eased 'attention' that drifts after the cursor and fades in/out
  const COHORTS = 6;
  const rnd = (a, b) => a + Math.random() * (b - a);
  const ss = (a, b, x) => { const u = Math.min(1, Math.max(0, (x - a) / (b - a))); return u * u * (3 - 2 * u); };
  const G = 22, snap = v => Math.round(v / G) * G + .5;   // matches the 22px blueprint grid (background is fixed too)
  const ri = (a, b) => Math.floor(rnd(a, b + 1));
  const circ = x => ss(Z.L0, Z.L1, x) * (1 - ss(Z.R0, Z.R1, x));   // 0 = organic edge, 1 = circuit centre
  const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;

  function makeStreams() {
    const n = Math.max(3, Math.round(H / 380));
    streams = Array.from({ length: n }, (_, i) => ({
      i, base: (i + .5) * H / n + rnd(-50, 50), amp: rnd(40, 100), k: rnd(.0018, .004), ph: rnd(0, 6.28),
      slope: rnd(-.1, .05), speed: rnd(.18, .3), width: rnd(12, 26), pulses: [], nextPulse: rnd(60, 400) }));
  }
  function makeZones() {
    const m = Math.max((W - 1040) / 2, W * .16), T = Math.min(200, Math.max(60, m * .7));
    Z.L1 = snap(m + Math.min(40, W * .04)) - .5; Z.L0 = Z.L1 - T; Z.R0 = W - Z.L1; Z.R1 = Z.R0 + T;
    Z.grad = ctx.createLinearGradient(Z.L0, 0, Z.R1, 0);
    const span = Z.R1 - Z.L0, col = a => `rgba(242, 196, 107, ${a})`;
    Z.grad.addColorStop(0, col(0)); Z.grad.addColorStop((Z.L1 - Z.L0) / span, col(.009));
    Z.grad.addColorStop((Z.R0 - Z.L0) / span, col(.009)); Z.grad.addColorStop(1, col(0));
  }
  // A fixed trace per stream: a grid lane with a few 45° jogs, plus dead-end stubs that end in pads.
  function makeTraces() {
    for (const s of streams) {
      s.lane = Math.min(H - 44, Math.max(44, snap(s.base + s.slope * Z.L1)));
      s.jogs = []; s.pads = [[Z.L1, s.lane]]; s.stubs = [];
      let x = Z.L1 + G * ri(2, 6), cum = 0;
      while (x < Z.R0 - G * 4) {
        if (Math.random() < .55) {
          let k = ri(1, 3) * (Math.random() < .5 ? -1 : 1);
          if (Math.abs(cum + k) > 4 || s.lane + (cum + k) * G < 44 || s.lane + (cum + k) * G > H - 44) k = -k;
          const y0 = s.lane + cum * G; cum += k;
          s.jogs.push({ x, dy: k * G }); s.pads.push([x, y0], [x + Math.abs(k) * G, y0 + k * G]);
          x += Math.abs(k) * G + G * ri(3, 8);
        } else {
          if (Math.random() < .5) {   // stub: short diagonal, then a run, ending in a pad
            const d = Math.random() < .5 ? -1 : 1, y0 = s.lane + cum * G, len = G * ri(2, 4);
            s.stubs.push([x, y0, x + G, y0 + d * G, x + G + len, y0 + d * G]);
          }
          x += G * ri(2, 5);
        }
      }
      s.pads.push([Z.R0, s.lane + cum * G]);
    }
  }
  function circY(s, x) {
    let y = s.lane;
    for (const j of s.jogs) { if (x <= j.x) break; y += j.dy * Math.min(1, (x - j.x) / Math.abs(j.dy)); }
    return y;
  }
  function drawTraces() {
    ctx.strokeStyle = Z.grad; ctx.lineWidth = 1;
    for (const s of streams) {
      ctx.beginPath(); ctx.moveTo(Z.L0, s.lane);
      for (const j of s.jogs) { const y = circY(s, j.x); ctx.lineTo(j.x, y); ctx.lineTo(j.x + Math.abs(j.dy), y + j.dy); }
      ctx.lineTo(Z.R1, circY(s, Z.R1)); ctx.stroke();
      for (const b of s.stubs) { ctx.beginPath(); ctx.moveTo(b[0], b[1]); ctx.lineTo(b[2], b[3]); ctx.lineTo(b[4], b[5]); ctx.stroke(); }
    }
    ctx.strokeStyle = "rgba(242, 196, 107, .02)";
    for (const s of streams) {
      for (const [x, y] of s.pads) { ctx.beginPath(); ctx.arc(x, y, 2.6, 0, 6.283); ctx.stroke(); }
      for (const b of s.stubs) { ctx.beginPath(); ctx.arc(b[4], b[5], 2.2, 0, 6.283); ctx.stroke(); }
    }
  }
  function pathY(s, x) {   // the organic ribbon
    return s.base + s.slope * x + s.amp * Math.sin(x * s.k + s.ph + t * .00012) + s.amp * .4 * Math.sin(x * s.k * 2.3 + s.ph * 1.7 - t * .00008);
  }
  function flowY(s, x) {   // organic at the edges, locked to the trace in the centre
    const c = circ(x);
    let y = c < .001 ? pathY(s, x) : c > .999 ? circY(s, x) : pathY(s, x) * (1 - c) + circY(s, x) * c;
    if (att.k > .001) {   // bow toward the cursor, fading smoothly with distance (barely, on the circuit)
      const dx = x - att.x, dy = att.y - y;
      y += dy * .16 * att.k * (1 - .85 * c) * Math.exp(-(dx * dx) / 70000) * Math.exp(-(dy * dy) / 90000);
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
    const s = streams[Math.floor(Math.random() * streams.length)], e = Math.max(40, Z.L0 + (Z.L1 - Z.L0) * .3);
    const x = Math.random() < .5 ? rnd(W * .02, e) : W - rnd(W * .02, e);
    const dendrites = Array.from({ length: Math.round(rnd(5, 8)) }, () => {
      const a = rnd(0, 6.28), len = rnd(35, 110), bend = rnd(-.6, .6);
      return { a, len, bend, fork: Math.random() < .5 ? rnd(.45, .75) : 0, fa: a + rnd(-.8, .8) };
    });
    return { s, x, y: flowY(s, x), R: rnd(60, 95), phase, life: rnd(1800, 2800), k: 0, dendrites };
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
    const w = innerWidth, h = innerHeight, rebuild = w !== W || Math.abs(h - H) > 150;   // ignore phone toolbar wobble
    W = w; H = h;
    cv.width = W * dpr; cv.height = H * dpr; cv.style.width = W + "px"; cv.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!rebuild) { if (Z.grad) makeZones(); return; }
    makeStreams(); makeZones(); makeTraces();
    parts = Array.from({ length: Math.min(340, Math.round(W * H / 4000)) }, () => spawn(true));
    somas = Array.from({ length: Math.max(2, Math.round(H / 500)) }, () => newSoma(Math.random()));
  }
  function migrate() {
    // one cohort, within a window of one stream, crosses to a neighbouring stream as a group
    const from = streams[Math.floor(Math.random() * streams.length)];
    const to = streams[from.i + (Math.random() < .5 ? -1 : 1)] || streams[from.i - 1] || streams[from.i + 1];
    if (!to) return;
    const c = Math.floor(Math.random() * COHORTS), x0 = Math.random() < .5 ? rnd(0, Math.max(60, Z.L0)) : rnd(Math.min(W - 60, Z.R1), W);
    for (const p of parts) if (p.s === from && p.c === c && Math.abs(p.x - x0) < 180) {
      const before = p.y; p.s = to; p.carry = before - (flowY(to, p.x) + p.off * to.width);
    }
  }
  function place(p) {
    if (p.s) {
      const s = p.s;
      p.x += s.speed * p.sp;
      for (const q of s.pulses) { const d = p.x - q.x; if (d > -50 && d < 30) { p.x += .5; p.lit = Math.max(p.lit, 1 - Math.abs(d + 10) / 40); } }
      p.off += gauss() * .03; p.off *= .999;
      const breathe = 1 + .9 * Math.sin(p.x * .006 + t * .0003 + s.ph), c = circ(p.x);
      const free = 1 + 1.3 * ss(Z.R1, W + 40, p.x);   // past the circuit the stream loosens out again
      p.carry *= .992 - .06 * c;   // slow, graceful arc between streams; snaps onto the trace in the centre
      p.y = flowY(s, p.x) + p.off * s.width * (Math.max(.25, breathe) * free * (1 - c) + .12 * c) + p.carry;
    } else {
      p.x += .16 * p.sp; p.y += Math.sin(p.x * .01 + p.a) * .12;
    }
    if (att.k > .001) {
      const mx = att.x - (p.x + p.dx), my = att.y - (p.y + p.dy), d2 = mx * mx + my * my;
      const f = .06 * att.k * (1 - .7 * circ(p.x)) * Math.exp(-d2 / 25000) / Math.sqrt(d2 + 1); p.dx += mx * f; p.dy += my * f;
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
      n.y = flowY(n.s, n.x);                                      // fixed along the flow, rising and falling with it
      return n;
    });
    if (--nextMigrate <= 0) { migrate(); nextMigrate = rnd(240, 520); }
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = "rgba(0,0,0,.14)"; ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = "lighter";
    drawTraces(); somas.forEach(drawSoma);
    for (const p of parts) { place(p); p.a += p.tw; draw(p, ((.35 + .65 * Math.abs(Math.sin(p.a))) * .58 + p.lit * .45) * (p.s ? 1 : 1 - .75 * circ(p.x))); }
    raf = requestAnimationFrame(frame);
  }
  addEventListener("resize", size); size();
  addEventListener("pointermove", e => { mouse.x = e.clientX; mouse.y = e.clientY; if (att.k < .01) { att.x = mouse.x; att.y = mouse.y; } mouse.on = true; });
  document.addEventListener("pointerleave", () => { mouse.on = false; });
  addEventListener("blur", () => { mouse.on = false; });
  if (still) parts.forEach(p => { place(p); draw(p, .5); });
  else raf = requestAnimationFrame(frame);
})();
