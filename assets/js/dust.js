/* Dust: golden motes drifting through the footer, after the Dust in His Dark Materials.
   The canvas lives only inside the footer, so the rest of the page stays clear.
   - Marten: Dust is drawn to the marten (a nod to a dæmon). Part of it gathers into a slow, tilted cloud that
     circles the marten, passing behind it, while streams that come near bend in, and motes drift back out to rejoin them.
   - Streams: motes flow in a few breathing, wispy ribbons across the screen.
   - Branching: now and then a small cohort peels off one stream and arcs over to join a neighbour, together.
   - Signals: soft pulses run down a stream faster than the drift, brightening the motes they pass.
   - Knots: unseen gathering points away from the marten; a stream swells into a slow swirl there, then they fade
     and reappear elsewhere.
   Everything moves slowly, with long soft trails.
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
  let orbShare = 0, W = -1, H = -1, dpr = Math.min(devicePixelRatio || 1, 2), parts = [], streams = [], somas = [], raf = 0, t = 0, nextMigrate = 200;
  const mouse = { x: 0, y: 0, on: false };
  const att = { x: 0, y: 0, k: 0 };   // eased 'attention' that drifts after the cursor and fades in/out
  const COHORTS = 6, ORB_SHARE = .3;
  const M = { x: -1e4, y: -1e4, R: 60, rot: -.22 };   // the marten: centre and size in canvas px, from the banner image
  const banner = host.querySelector(".banner img");
  function findMarten() {
    if (!banner) return;
    const b = banner.getBoundingClientRect(), c = cv.getBoundingClientRect(), k = b.height / 480;   // art is 480px tall
    M.x = b.left - c.left + 2790 * k; M.y = b.top - c.top + 150 * k; M.R = Math.max(40, 300 * k);
  }
  const rnd = (a, b) => a + Math.random() * (b - a);
  const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;

  function makeStreams() {
    const n = Math.max(3, Math.round(H / 380));
    streams = Array.from({ length: n }, (_, i) => ({
      i, base: (i + .5) * H / n + rnd(-50, 50), amp: Math.min(rnd(40, 100), H * .12), k: rnd(.0018, .004), ph: rnd(0, 6.28),
      slope: rnd(-.1, .05), speed: rnd(.07, .12), width: rnd(12, 26), pulses: [], nextPulse: rnd(60, 400) }));
    const ms = streams[n - 1];                    // the lowest stream runs past the marten
    ms.slope = rnd(-.03, .03); ms.base = M.y - M.R * .4 - ms.slope * M.x;
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
      a: rnd(0, 6.28), tw: rnd(.0015, .005), carry: 0, dx: 0, dy: 0, lit: 0, orb: false };
  }
  function orbit(p) {   // join the marten's cloud from wherever the mote is now
    const ex = (p.x - M.x) / 1.55, ey = (p.y - M.y) / .75;
    p.orb = true; p.th = Math.atan2(ey, ex); p.rad = Math.min(Math.hypot(ex, ey), M.R * 2.6);
    p.r0 = M.R * Math.max(.9, 1.5 + gauss() * .6);
    p.w = (Math.random() < .85 ? 1 : -1) * rnd(.0012, .0028) * Math.sqrt(M.R / p.r0);
  }
  // Knots (no drawing): points on a stream where the Dust pools and swirls for a while, then disperses.
  function newSoma(phase = 0) {
    let s, x, tries = 0;
    do { s = streams[Math.floor(Math.random() * streams.length)]; x = rnd(W * .06, W * .94); }
    while (Math.abs(x - M.x) < M.R * 3.2 && ++tries < 20);   // keep knots away from the marten
    return { s, x, y: pathY(s, x), R: rnd(60, 95), phase, life: rnd(2600, 4200), k: 0 };
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
    findMarten();
    if (!rebuild) return;
    makeStreams();
    parts = Array.from({ length: Math.min(340, Math.max(160, Math.round(W * H / 4000))) }, () => spawn(true));
    parts.forEach(p => { if (Math.random() < ORB_SHARE) { p.x = M.x + rnd(-1.5, 1.5) * M.R; p.y = M.y + rnd(-.7, .7) * M.R; orbit(p); } });
    somas = Array.from({ length: Math.max(2, Math.round(W / 520)) }, () => newSoma(Math.random()));
  }
  function migrate() {
    // one cohort, within a window of one stream, crosses to a neighbouring stream as a group
    const from = streams[Math.floor(Math.random() * streams.length)];
    const to = streams[from.i + (Math.random() < .5 ? -1 : 1)] || streams[from.i - 1] || streams[from.i + 1];
    if (!to) return;
    const c = Math.floor(Math.random() * COHORTS), x0 = rnd(W * .1, W * .7);
    for (const p of parts) if (!p.orb && p.s === from && p.c === c && Math.abs(p.x - x0) < 180) {
      const before = p.y; p.s = to; p.carry = before - (pathY(to, p.x) + p.off * to.width);
    }
  }
  function place(p) {
    if (p.orb) {
      p.th += p.w; p.rad += (p.r0 - p.rad) * .01;
      const wob = 1 + .12 * Math.sin(t * .0011 + p.a * 3);
      const ex = Math.cos(p.th) * p.rad * 1.55 * wob, ey = Math.sin(p.th) * p.rad * .75 * wob;
      const cr = Math.cos(M.rot), sr = Math.sin(M.rot);
      p.x += (M.x + ex * cr - ey * sr - p.x) * .025;                 // eased, so motes swing in rather than snap
      p.y += (M.y + ex * sr + ey * cr - p.y) * .025;
      if (Math.random() < .0006) {                                  // drift back out to rejoin the stream
        const s = streams[streams.length - 1]; p.orb = false; p.s = s; p.carry = p.y - pathY(s, p.x) - p.off * s.width;
      }
    } else if (p.s) {
      const s = p.s;
      p.x += s.speed * p.sp;
      for (const q of s.pulses) { const d = p.x - q.x; if (d > -60 && d < 40) p.lit = Math.max(p.lit, .7 * (1 - Math.abs(d + 10) / 50)); }
      p.off += gauss() * .012; p.off *= .9995;
      const breathe = 1 + .9 * Math.sin(p.x * .006 + t * .0003 + s.ph);
      p.carry *= .996;   // slow, graceful arc between streams
      p.y = pathY(s, p.x) + p.off * s.width * Math.max(.25, breathe) + p.carry;
    } else {
      p.x += .06 * p.sp; p.y += Math.sin(p.x * .01 + p.a) * .05;
    }
    if (att.k > .001) {
      const mx = att.x - (p.x + p.dx), my = att.y - (p.y + p.dy), d2 = mx * mx + my * my;
      const f = .06 * att.k * Math.exp(-d2 / 25000) / Math.sqrt(d2 + 1); p.dx += mx * f; p.dy += my * f;
    }
    if (p.s) {
      gather(p);
      const dx = p.x - M.x, dy = p.y - M.y, d = Math.hypot(dx / 1.55, dy / .75);
      if (d < M.R * 3) {                                         // near the marten: bend in, swirl, and maybe join its cloud
        const w = Math.pow(1 - d / (M.R * 3), 2);
        p.y -= (dy / (d + 1)) * 6 * w; p.x -= p.s.speed * p.sp * .5 * w;
        if (Math.random() < .03 * w * (orbShare < ORB_SHARE ? 1.5 : .3)) orbit(p);
      }
    }
    p.dx *= .99; p.dy *= .99; p.lit *= .975;
    if (p.x > W + 40 && !p.orb) Object.assign(p, spawn(false));
  }
  function draw(p, alpha) {
    ctx.fillStyle = `rgba(242, 196, 107, ${Math.min(1, alpha)})`;
    ctx.beginPath(); ctx.arc(p.x + p.dx, p.y + p.dy, p.r * (1 + p.lit * .6), 0, 6.283); ctx.fill();
  }
  function frame() {
    t += 3.5;
    for (const s of streams) {
      if (--s.nextPulse <= 0) { s.pulses.push({ x: -60, v: rnd(.35, .55) }); s.nextPulse = rnd(1400, 2600); }
      s.pulses.forEach(q => q.x += q.v); s.pulses = s.pulses.filter(q => q.x < W + 80);
    }
    if (mouse.on) { att.x += (mouse.x - att.x) * .012; att.y += (mouse.y - att.y) * .012; att.k += (1 - att.k) * .008; } else att.k *= .985;
    somas = somas.map(n => {
      n.phase += 1 / n.life; if (n.phase >= 1) return newSoma();
      n.k = Math.pow(Math.sin(Math.PI * n.phase), 2);
      n.y = pathY(n.s, n.x);                                      // fixed along the flow, rising and falling with it
      return n;
    });
    if (--nextMigrate <= 0) { migrate(); nextMigrate = rnd(240, 520); }
    findMarten(); orbShare = parts.reduce((n, p) => n + p.orb, 0) / parts.length;
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = "rgba(0,0,0,.08)"; ctx.fillRect(0, 0, W, H);   // longer, softer trails
    ctx.globalCompositeOperation = "lighter";
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
