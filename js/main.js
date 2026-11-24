// Hustle v4 — input, layout and game loop.
let st = Core.init(), last = 0, rot = 0, scale = 1;
const stage = $('stage'), frameEl = $('frame'), pad = $('pad');
const MAP = { Q: 'A', Z: 'A', W: 'S', X: 'S', E: 'D', C: 'D', R: 'F', V: 'F', T: 'F', G: 'F', B: 'F' };

/* Scale the fixed 960x600 stage to whatever width its frame has (CSS keeps the frame on screen). */
function fit() {
  scale = frameEl.clientWidth / 960;
  stage.style.transform = `scale(${scale})`;
  stage.classList.toggle('sm', scale < .6);
}
new ResizeObserver(fit).observe(frameEl);
addEventListener('orientationchange', () => setTimeout(fit, 200));
fit();

/* Touch keypad: A S D F while working, one large button on the other screens. */
function renderPad() {
  if (st.scr === 'work') {
    pad.innerHTML = 'ASDF'.split('').map(k => `<button type="button" data-k="${k}" aria-label="Key ${k}">${k}</button>`).join('');
    paintPad();
  } else {
    const label = { start: 'Clock in', break: 'Keep working  +800', end: 'Again' }[st.scr];
    pad.innerHTML = `<button type="button" class="wide" data-act="${st.scr}">${label}</button>`;
    if (st.scr === 'break') { const b = pad.firstChild; b.disabled = true; setTimeout(() => { if (b.isConnected) b.disabled = false; }, 1200); }
  }
}
function paintPad() {
  const cur = st.seq[st.idx];
  pad.querySelectorAll('button[data-k]').forEach(b => b.classList.toggle('cur', b.dataset.k === cur));
}
pad.addEventListener('pointerdown', e => {
  const b = e.target.closest('button'); if (!b || b.disabled) return;
  e.preventDefault();
  if (b.dataset.k) hit(b.dataset.k);
  else ({ start: begin, break: skipBreak, end: restart })[b.dataset.act]?.();
});
pad.addEventListener('click', e => { if (e.detail === 0) { const b = e.target.closest('button'); if (b?.dataset.act) ({ start: begin, break: skipBreak, end: restart })[b.dataset.act]?.(); } });

function bind() {
  const g = $('go'), s = $('skip'), a = $('again');
  if (g) g.onclick = begin; if (s) s.onclick = skipBreak; if (a) a.onclick = restart;
}
function render() { show(st.scr, st); bind(); renderPad(); }
function begin() { if (st.scr !== 'start') return; st.scr = 'work'; render(); }
function skipBreak() { if (st.scr !== 'break') return; Core.skip(st); render(); }
function restart() { st = Core.init(); render(); }
function hit(k) {
  if (st.scr !== 'work') return;
  const ev = Core.press(st, k); if (!ev) return;
  if (st.scr === 'end') { render(); return; }
  paintKeys(st); paintPad();
  const p = $('pts');
  if (ev.ok) {
    floatFx('+' + ev.gain); p.animate([{ transform: 'scale(1.14)' }, { transform: 'scale(1)' }], { duration: 120 });
    if (ev.task) { floatFx('TASK +' + ev.task); buildKeys(st); paintKeys(st); paintPad(); }
  } else {
    const t = stage.style.transform;
    stage.animate([{ transform: t + ' translateX(-8px)' }, { transform: t + ' translateX(8px)' }, { transform: t }], { duration: 140 });
    navigator.vibrate?.(30);
  }
}
addEventListener('keydown', e => {
  if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
  const k = e.key.toUpperCase();
  if (e.key === 'Enter') { if (st.scr === 'start') begin(); else if (st.scr === 'end') restart(); return; }
  if (e.code === 'Space' && st.scr === 'break') { e.preventDefault(); skipBreak(); return; }
  const m = MAP[k] || k; if (m.length === 1 && 'ASDF'.includes(m)) hit(m);
});
/* Tapping the stage itself also works: four invisible columns, A to F. */
stage.addEventListener('pointerdown', e => {
  if (st.scr !== 'work' || e.target.closest('button')) return;
  const r = stage.getBoundingClientRect(); hit('ASDF'[Math.min(3, Math.floor((e.clientX - r.left) / r.width * 4))]);
});
function frame(ts) {
  const dt = Math.min(.1, (ts - last) / 1000 || 0); last = ts;
  const was = st.scr;
  if (was === 'work' || was === 'break') {
    Core.step(st, dt); rot += dt * (was === 'work' ? 6 * (1 + st.combo / 6) : 2);
    $('sky').setAttribute('transform', `rotate(${rot} 480 620)`);
  }
  if (st.scr !== was) render();
  update(st, dt);
  requestAnimationFrame(frame);
}
render(); requestAnimationFrame(frame);
