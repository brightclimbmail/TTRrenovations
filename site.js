/* TTR Renovations — site interactions (no dependencies) */
(() => {
  const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const track = (name, params = {}) => { if (typeof window.gtag === 'function') window.gtag('event', name, params); };

  // Photo fallback: show a labeled placeholder instead of a broken image
  const miss = img => img.closest('.media')?.classList.add('is-missing');
  $$('.media img').forEach(img => { if (img.complete && !img.naturalWidth) miss(img); img.addEventListener('error', () => miss(img)); });

  // Header: solid on scroll
  const header = $('[data-header]');
  const onScroll = () => header.classList.toggle('is-solid', scrollY > 40);
  onScroll(); addEventListener('scroll', onScroll, { passive: true });

  // Mobile menu
  const toggle = $('.nav-toggle'), nav = $('#main-nav');
  const setNav = open => { toggle.setAttribute('aria-expanded', open); toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu'); nav.classList.toggle('open', open); document.body.classList.toggle('nav-open', open); };
  toggle.addEventListener('click', () => setNav(toggle.getAttribute('aria-expanded') !== 'true'));
  $$('a', nav).forEach(a => a.addEventListener('click', () => setNav(false)));

  // Mega menus: click/tap/keyboard (never hover-only)
  const btns = $$('.mega-btn');
  const close = except => btns.forEach(b => { if (b !== except) { b.setAttribute('aria-expanded', 'false'); $('#' + b.getAttribute('aria-controls')).classList.remove('open'); } });
  btns.forEach(b => b.addEventListener('click', e => {
    e.stopPropagation(); const open = b.getAttribute('aria-expanded') !== 'true';
    close(b); b.setAttribute('aria-expanded', open); $('#' + b.getAttribute('aria-controls')).classList.toggle('open', open);
  }));
  document.addEventListener('click', e => { if (!e.target.closest('.has-mega')) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { const o = btns.find(b => b.getAttribute('aria-expanded') === 'true'); close(); o?.focus(); if (nav.classList.contains('open')) { setNav(false); toggle.focus(); } } });

  // Scroll reveal
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
    $$('.reveal').forEach(el => io.observe(el));
  } else $$('.reveal').forEach(el => el.classList.add('in'));

  // Before/after slider
  $$('[data-ba]').forEach(ba => { const r = $('.ba-range', ba); const set = () => ba.style.setProperty('--pos', r.value + '%'); r.addEventListener('input', set); set(); });

  // Click tracking
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-track]'); if (!a) return;
    const t = a.dataset.track;
    track(t === 'phone' ? 'phone_click' : t === 'email' ? 'email_click' : 'cta_click', { location: t });
  });

  // Estimate form (multi-step, real submission only)
  const form = $('#estimate-form');
  if (!form) return;
  const steps = $$('.fstep', form), bar = $$('.progress span', form);
  const prev = $('[data-prev]', form), next = $('[data-next]', form), submit = $('[data-submit]', form), status = $('.form-status', form);
  let cur = 0, started = false;

  const show = i => {
    cur = i; steps.forEach((s, n) => s.classList.toggle('is-active', n === i)); bar.forEach((b, n) => b.classList.toggle('on', n <= i));
    prev.hidden = i === 0; next.hidden = i === steps.length - 1; submit.hidden = i !== steps.length - 1;
  };
  const msg = { valueMissing: 'This field is required.', typeMismatch: 'Please enter a valid email address.' };
  const validate = step => {
    let ok = true, first;
    $$('[required]', step).forEach(f => {
      const group = f.type === 'radio' ? $$(`[name="${f.name}"]`, form) : [f];
      const valid = f.type === 'radio' ? group.some(x => x.checked) : f.checkValidity() && (f.type !== 'tel' || f.value.replace(/\D/g, '').length >= 10);
      const err = $(`[data-err="${f.name}"]`, form);
      group.forEach(x => x.setAttribute('aria-invalid', !valid));
      if (err) err.textContent = valid ? '' : f.type === 'radio' ? 'Please choose a project type.' : f.type === 'tel' ? 'Please enter a 10-digit phone number.' : (msg[Object.keys(msg).find(k => f.validity[k])] || 'Please check this field.');
      if (err && !valid) f.setAttribute('aria-describedby', err.id || (err.id = 'err-' + f.name));
      if (!valid) { ok = false; first ||= f; }
    });
    first?.focus(); return ok;
  };
  form.addEventListener('input', () => { if (!started) { started = true; track('form_start'); } });
  form.addEventListener('change', e => { if (e.target.name === 'project_type' && cur === 0) setTimeout(() => { validate(steps[0]) && show(1); $('#f-town')?.focus(); }, 180); });
  next.addEventListener('click', () => validate(steps[cur]) && show(cur + 1));
  prev.addEventListener('click', () => show(cur - 1));
  show(0);

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (form.getAttribute('aria-busy') === 'true') return;
    for (let i = 0; i < steps.length; i++) if (!validate(steps[i])) return show(i), validate(steps[i]);
    const endpoint = (window.TTR && TTR.endpoint) || form.action;
    status.className = 'form-status';
    if (!/^https:\/\/formspree\.io\//.test(endpoint)) { status.classList.add('error'); status.textContent = `Our online form isn't connected yet. Please call ${$('.header-phone')?.textContent.trim() || 'us'} and we'll get you on the schedule.`; return; }
    form.setAttribute('aria-busy', 'true'); submit.textContent = 'Sending…'; status.textContent = 'Sending your request…';
    try {
      const res = await fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error(res.status);
      track('generate_lead', { project_type: form.project_type.value });
      location.href = TTR.thanks;
    } catch {
      status.classList.add('error'); status.textContent = 'Something went wrong sending your request. Please try again, or call us directly.';
      form.removeAttribute('aria-busy'); submit.textContent = 'Send My Request';
    }
  });

  // Hero quick-start → prefill the estimate form
  $('[data-quickstart]')?.addEventListener('submit', e => {
    e.preventDefault();
    const t = e.target.type.value, town = e.target.town.value;
    const radio = $$('[name="project_type"]', form).find(r => r.value === t);
    if (radio) radio.checked = true;
    if (town) $('#f-town').value = town;
    show(radio ? 1 : 0);
    $('#estimate').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    setTimeout(() => (radio ? $(town ? '#f-desc' : '#f-town') : $('[name="project_type"]', form)).focus({ preventScroll: true }), 600);
    track('cta_click', { location: 'quickstart' });
  });
})();
