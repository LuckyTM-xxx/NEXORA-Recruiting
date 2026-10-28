(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ease = t => 1 - Math.pow(1 - t, 3);
  const inView = (el, cb, threshold = .25) => {
    const io = new IntersectionObserver(([e]) => cb(e.isIntersecting), { threshold });
    io.observe(el); return io;
  };

  /* Kopfzeile, Menü, mobile Leiste */
  const hdr = $('.hdr'), mbar = $('.mbar'), hero = $('.hero');
  const onScroll = () => {
    hdr.classList.toggle('solid', scrollY > 20);
    const chk = $('#stellen-check'), r = chk && chk.getBoundingClientRect();
    if (mbar) mbar.classList.toggle('show', scrollY > hero.offsetHeight * .6 && !(r && r.top < innerHeight && r.bottom > 0));
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  const burger = $('.burger');
  const setNav = open => { document.body.classList.toggle('nav-open', open); burger.setAttribute('aria-expanded', open); burger.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen'); };
  burger.addEventListener('click', () => setNav(!document.body.classList.contains('nav-open')));
  $$('.nav a').forEach(a => a.addEventListener('click', () => setNav(false)));
  $$('.sub-toggle').forEach(b => b.addEventListener('click', () => { const li = b.parentElement, o = !li.classList.contains('open'); li.classList.toggle('open', o); b.setAttribute('aria-expanded', o); }));
  addEventListener('click', e => { if (!e.target.closest('.has-sub') && matchMedia('(min-width: 1021px)').matches) $$('.has-sub.open').forEach(li => li.classList.remove('open')); });
  addEventListener('keydown', e => { if (e.key === 'Escape') { setNav(false); $$('.has-sub.open').forEach(li => li.classList.remove('open')); } });

  const links = $$('.menu > li > a[href^="#"]');
  if (links.length) {
    const sio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) links.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id)); }), { rootMargin: '-45% 0px -50% 0px' });
    links.forEach(a => { const s = $(a.getAttribute('href')); if (s) sio.observe(s); });
  }

  /* Einblenden + Zähler */
  $$('.rv').forEach((el, i) => { el.style.transitionDelay = (i % 3) * 80 + 'ms'; });
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    io.unobserve(e.target); e.target.classList.add('in');
    setTimeout(() => { e.target.style.transitionDelay = ''; }, 1200);
    $$('[data-count]', e.target).forEach(n => {
      const to = +n.dataset.count; if (reduce) return;
      const t0 = performance.now();
      const step = now => { const t = Math.min(1, (now - t0) / 1300); n.textContent = Math.round(to * ease(t)); if (t < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    });
  }), { threshold: .12 });
  $$('.rv').forEach(el => io.observe(el));

  /* ---------- Recruiting-Engine im Hero ---------- */
  const eng = $('.engine [data-chans]') && $('.engine');
  if (eng) {
    const CAMPS = [
      { job: 'Servicetechniker (m/w/d)', msg: 'Feste Touren, planbare Freizeit', kanal: 'Social Media · regional', apps: [['M. K.', 'Servicetechniker', 'Phase 3'], ['S. B.', 'Mechatroniker', 'Phase 2'], ['T. W.', 'Servicetechniker', 'Phase 4']] },
      { job: 'Zerspanungsmechaniker (m/w/d)', msg: 'Moderne 5-Achs-Maschinen', kanal: 'Social Media · Video', apps: [['A. R.', 'CNC-Fräser', 'Phase 2'], ['L. H.', 'Zerspanungsmech.', 'Phase 3'], ['D. S.', 'CNC-Dreher', 'Phase 3']] },
      { job: 'App-Entwickler (m/w/d)', msg: 'Tech-Stack & Produktverantwortung', kanal: 'Fachportale · Netzwerke', apps: [['J. P.', 'iOS-Entwickler', 'Phase 2'], ['N. F.', 'Flutter-Entwickler', 'Phase 3'], ['C. M.', 'Android-Entwickler', 'Phase 2']] },
      { job: 'IT-Administrator (m/w/d)', msg: 'Hybrid-Modell & Sicherheit', kanal: 'Jobportale · Social Media', apps: [['K. L.', 'Systemadministrator', 'Phase 3'], ['E. Z.', 'Netzwerkadmin', 'Phase 4'], ['R. G.', 'IT-Administrator', 'Phase 2']] }
    ];
    const chans = $('[data-chans]', eng), apps = $('[data-apps]', eng), job = $('[data-job]', eng);
    const chCount = $('[data-chan-count]', eng), apCount = $('[data-app-count]', eng);
    for (let i = 0; i < 30; i++) chans.appendChild(document.createElement('i'));
    const cells = $$('i', chans);
    let k = 0, total = 0, running = false;
    const swap = (el, txt) => { el.classList.add('swap'); setTimeout(() => { el.textContent = txt; el.classList.remove('swap'); }, 350); };
    const app = ([av, role, ph]) => {
      const d = document.createElement('div'); d.className = 'app';
      d.innerHTML = `<span class="av">${av.replace(/[ .]/g, '')}</span><span><b>${role}</b><small>${ph} · neu</small></span><span class="cv">LEBENSLAUF ✓</span>`;
      apps.prepend(d); while (apps.children.length > 4) apps.lastChild.remove();
      apCount.textContent = ++total;
    };
    const run = async () => {
      if (running) return; running = true;
      while (running) {
        const c = CAMPS[k++ % CAMPS.length];
        job.style.opacity = 0; setTimeout(() => { job.textContent = c.job; job.style.opacity = 1; }, 300);
        swap($('[data-r="msg"]', eng), c.msg); swap($('[data-r="kanal"]', eng), c.kanal);
        cells.forEach(x => x.className = '');
        const order = cells.map((_, i) => i).sort(() => Math.random() - .5);
        for (let i = 0; i < 30 && running; i++) { cells[order[i]].className = 'on'; chCount.textContent = `${i + 1}/30`; await new Promise(r => setTimeout(r, reduce ? 0 : 45)); }
        order.slice(0, 4).forEach(i => cells[i].className = 'hot');
        for (const a of c.apps) { if (!running) break; await new Promise(r => setTimeout(r, reduce ? 0 : 900)); app(a); }
        await new Promise(r => setTimeout(r, reduce ? 4000 : 2200));
      }
    };
    inView(eng, v => { if (v) run(); else running = false; }, .2);
  }

  /* ---------- Kreislauf: Kampagnen speisen die Datenbasis ---------- */
  const loop = $('.loop svg');
  if (loop && !reduce) {
    const nodes = $$('.cnode', loop), g = $('.pulses', loop), NS = 'http://www.w3.org/2000/svg';
    let on = false;
    inView(loop, v => { on = v; }, .2);
    const fire = () => {
      if (on && !document.hidden) {
        const n = nodes[Math.floor(Math.random() * nodes.length)], x = +n.dataset.x, y = +n.dataset.y;
        const inward = Math.random() > .4;
        const c = document.createElementNS(NS, 'circle'); c.setAttribute('r', 3.2); c.setAttribute('class', 'pulse'); g.appendChild(c);
        n.classList.add('lit'); setTimeout(() => n.classList.remove('lit'), 900);
        const t0 = performance.now(), dur = 1100;
        const step = now => {
          const t = Math.min(1, (now - t0) / dur), p = inward ? t : 1 - t;
          c.setAttribute('cx', x + (260 - x) * p); c.setAttribute('cy', y + (260 - y) * p); c.setAttribute('opacity', Math.sin(t * Math.PI));
          t < 1 ? requestAnimationFrame(step) : c.remove();
        };
        requestAnimationFrame(step);
      }
      setTimeout(fire, 260);
    };
    fire();
  }

  /* ---------- Blick in die Datenbasis ---------- */
  const con = $('[data-console]');
  if (con) {
    const DATA = [
      { f: [['Feste Touren & planbare Freizeit', 92], ['Firmenwagen auch privat', 78], ['Transparentes Gehalt', 71], ['Moderne Anlagen & Technik', 58], ['Weiterbildung', 44]], phase: 'Phase 3 · unzufrieden', kanal: 'Social Media, regional', format: 'Kurzvideo aus dem Außendienst' },
      { f: [['Moderne Maschinen (5-Achs)', 90], ['Nähe zum Wohnort', 81], ['Schichtmodell', 69], ['Faire Bezahlung', 64], ['Team & Betriebsklima', 47]], phase: 'Phase 2 · zufrieden', kanal: 'Social Media, Video', format: 'Maschine in Aktion' },
      { f: [['Tech-Stack & Projekte', 94], ['Remote / Hybrid', 83], ['Produktverantwortung', 70], ['Gehalt', 62], ['Weiterbildungsbudget', 49]], phase: 'Phase 2 · zufrieden', kanal: 'Fachportale & Netzwerke', format: 'Einblick ins Entwicklerteam' },
      { f: [['Sicherer Arbeitsplatz', 88], ['Hybrides Arbeiten', 80], ['Moderne Infrastruktur', 66], ['Gehalt', 60], ['Work-Life-Balance', 55]], phase: 'Phase 3 · unzufrieden', kanal: 'Jobportale & Social Media', format: 'Mitarbeiterstimme' }
    ];
    const bars = $('[data-bars]', con), tabs = $$('[data-k]', con);
    bars.innerHTML = DATA[0].f.map(() => '<div class="bar"><span></span><span class="tr"><i></i></span></div>').join('');
    const show = k => {
      const d = DATA[k];
      tabs.forEach(t => t.setAttribute('aria-selected', +t.dataset.k === k));
      $$('.bar', bars).forEach((b, i) => { b.firstChild.textContent = d.f[i][0]; $('i', b).style.setProperty('--w', '0%'); setTimeout(() => $('i', b).style.setProperty('--w', d.f[i][1] + '%'), 60 + i * 70); });
      $('[data-c="phase"]', con).textContent = d.phase; $('[data-c="kanal"]', con).textContent = d.kanal; $('[data-c="format"]', con).textContent = d.format;
    };
    tabs.forEach(t => t.addEventListener('click', () => { auto = false; show(+t.dataset.k); }));
    let auto = true, cur = 0, started = false;
    inView(con, v => {
      if (v && !started) { started = true; show(0); if (!reduce) setInterval(() => { if (auto && !document.hidden) show(cur = (cur + 1) % DATA.length); }, 4200); }
    }, .3);
  }

  /* ---------- Phasenmodell: Reichweite Stellenanzeige vs. Kampagne ---------- */
  const pool = $('[data-pool]');
  if (pool) {
    const dotsEl = $('[data-dots]', pool), N = 160;
    /* schematische Verteilung: wenige aktiv Suchende, mehr Unzufriedene, die meisten zufrieden */
    const ph = Array.from({ length: N }, (_, i) => i < 22 ? 'p4' : i < 74 ? 'p3' : 'p2').sort(() => Math.random() - .5);
    dotsEl.innerHTML = ph.map(p => `<i class="${p}"></i>`).join('');
    const dots = $$('i', dotsEl), reach = $('[data-reach]', pool), btns = $$('[data-mode]', pool);
    const set = mode => {
      btns.forEach(b => b.setAttribute('aria-pressed', b.dataset.mode === mode));
      reach.innerHTML = mode === 'ad' ? 'Erreicht: <b>nur Phase 4</b>' : 'Erreicht: <b>Phase 2, 3 und 4</b>';
      dots.forEach((d, i) => { const lit = mode === 'nx' || d.classList.contains('p4'); setTimeout(() => d.classList.toggle('lit', lit), reduce ? 0 : (i % 40) * 12); });
    };
    btns.forEach(b => b.addEventListener('click', () => { demo = false; set(b.dataset.mode); }));
    let demo = true, done = false;
    inView(pool, v => {
      if (!v || done) return; done = true;
      set('ad');
      if (!reduce) setTimeout(() => demo && set('nx'), 1800);
    }, .4);
  }

  /* ---------- Ablauf: Linie füllt sich beim Scrollen ---------- */
  const flow = $('[data-flow]');
  if (flow) {
    const items = $$('li', flow);
    const upd = () => {
      const r = flow.getBoundingClientRect(), p = Math.max(0, Math.min(1, (innerHeight * .75 - r.top) / (innerHeight * .5)));
      flow.style.setProperty('--p', p.toFixed(3));
      items.forEach((li, i) => li.classList.toggle('on', p >= i / (items.length - 1) - .02));
    };
    addEventListener('scroll', upd, { passive: true }); upd();
  }

  /* ---------- Handy-Mockup: Auswahl springt durch ---------- */
  $$('[data-devices]').forEach(dv => {
    const opts = $$('.phone .opt', dv), prog = $('.phone .prog i', dv);
    if (reduce || !opts.length) return;
    let i = 1, on = false;
    inView(dv, v => { on = v; });
    setInterval(() => { if (!on) return; i = (i + 1) % opts.length; opts.forEach((o, k) => o.classList.toggle('sel', k === i)); prog.style.width = [33, 66, 100][i] + '%'; }, 1600);
  });

  /* ---------- Stellen-Check ---------- */
  const f = $('#sc');
  if (f) {
    const ROLES = {
      Industrie: ['Servicetechniker', 'Zerspanungsmechaniker', 'CNC-Fräser', 'CNC-Dreher', 'Elektroniker', 'Mechatroniker', 'Instandhalter', 'Konstrukteur', 'Techniker', 'Monteur', 'Schweißer'],
      IT: ['App-Entwickler', 'Softwareentwickler', 'Full-Stack-Entwickler', 'IT-Administrator', 'Systemadministrator', 'IT-Security-Spezialist', 'DevOps-Engineer', 'Cloud-Engineer', 'Data Engineer', 'SAP-Berater']
    };
    const pages = $$('.sc-page', f), steps = $$('.sc-steps li', f), lbl = $('[data-count-label]', f);
    const next = $('[data-next]', f), prev = $('[data-prev]', f), list = $('#sc-list', f);
    let cur = 0;
    const fill = () => { const b = $('input[name="bereich"]:checked', f); list.innerHTML = b ? ROLES[b.value].map(r => `<option value="${r}">`).join('') : ''; };
    const show = i => {
      cur = i;
      pages.forEach((p, k) => p.classList.toggle('on', k === i));
      steps.forEach((s, k) => { s.classList.toggle('on', k === i); s.classList.toggle('done', k < i); });
      lbl.textContent = `Schritt ${i + 1} / 3`; prev.hidden = i === 0;
    };
    const need = { 1: '#sc-stelle', 2: '#sc-region' };
    const valid = i => {
      let ok = i === 0 ? !!$('input[name="bereich"]:checked', f) : $(need[i], f).value.trim() !== '';
      if (i > 0) $(need[i], f).closest('.fld').classList.toggle('bad', !ok);
      $(`[data-err="${i}"]`, f).classList.toggle('show', !ok);
      return ok;
    };
    const finish = () => {
      const fd = new FormData(f), v = k => (fd.get(k) || '–');
      const rows = [['Bereich', v('bereich')], ['Position', v('stelle')], ['Anzahl', v('anzahl')], ['Region', v('region')], ['Besetzung', v('start')]];
      $('[data-sum]', f).innerHTML = rows.map(([a, b]) => `<div><small>${a}</small><b>${String(b).replace(/</g, '&lt;')}</b></div>`).join('');
      /* Stellenangaben wandern per URL ins Kontaktformular und werden dort vorausgefüllt */
      const note = rows.map(([a, b]) => `${a}: ${b}`).join(' | ');
      $('[data-contact-link]', f).href = `${f.dataset.contact}?stellencheck=${encodeURIComponent(note)}`;
      pages.forEach(p => p.classList.remove('on')); steps.forEach(s => { s.classList.remove('on'); s.classList.add('done'); });
      $('.sc-bar', f).hidden = true; $('.sc-res', f).hidden = false; lbl.textContent = 'Fertig';
    };
    next.addEventListener('click', () => { if (!valid(cur)) return; cur === 2 ? finish() : show(cur + 1); });
    prev.addEventListener('click', () => show(cur - 1));
    $$('input[name="bereich"]', f).forEach(r => r.addEventListener('change', () => { fill(); $('[data-err="0"]', f).classList.remove('show'); setTimeout(() => cur === 0 && show(1), 280); }));
    $$('#sc-stelle, #sc-region', f).forEach(inp => inp.addEventListener('input', () => { if (inp.value.trim()) inp.closest('.fld').classList.remove('bad'); }));
    f.addEventListener('submit', e => { e.preventDefault(); next.click(); });
    fill();
    if ($('input[name="bereich"]:checked', f)) show(1);
  }

  /* ---------- Kontaktformular (Formspree) ---------- */
  const cf = $('#kf');
  if (cf) {
    const check = new URLSearchParams(location.search).get('stellencheck');
    if (check) {
      $('[name="stellencheck"]', cf).value = check;
      const box = $('[data-check]', cf);
      box.innerHTML = '<small>Ihre Angaben aus dem Stellen-Check</small>' + check.split(' | ').map(r => `<span>${r.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</span>`).join('');
      box.hidden = false;
    }
    const status = $('[data-status]', cf), send = $('button[type="submit"]', cf);
    const req = $$('[required]', cf);
    const ok = el => { const v = el.type === 'checkbox' ? el.checked : el.checkValidity() && el.value.trim() !== ''; el.closest('.fld').classList.toggle('bad', !v); return v; };
    req.forEach(el => el.addEventListener(el.type === 'checkbox' ? 'change' : 'input', () => el.closest('.fld').classList.contains('bad') && ok(el)));
    cf.addEventListener('submit', async e => {
      e.preventDefault();
      const bad = req.filter(el => !ok(el));
      status.className = 'kf-status';
      if (bad.length) { status.textContent = 'Bitte füllen Sie die markierten Felder aus.'; status.classList.add('err'); bad[0].focus(); return; }
      send.disabled = true; status.textContent = 'Wird gesendet …';
      try {
        const res = await fetch(cf.action, { method: 'POST', body: new FormData(cf), headers: { Accept: 'application/json' } });
        if (!res.ok) throw new Error((await res.json().catch(() => ({}))).errors?.map(x => x.message).join(', ') || res.status);
        cf.hidden = true; $('[data-sent]').hidden = false; $('[data-sent]').focus();
      } catch (err) {
        /* Hintergrund-Versand abgelehnt (z. B. reCAPTCHA aktiv) oder blockiert:
           Formular klassisch an Formspree schicken – dort ggf. Captcha, dann Bestätigung */
        console.warn('Formspree (AJAX):', err.message);
        status.textContent = 'Einen Moment – Sie werden zur Bestätigung weitergeleitet …';
        HTMLFormElement.prototype.submit.call(cf);
      }
    });
  }
})();
