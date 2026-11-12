/* ---------- reproductor SoundCloud ---------- */
(function(){
  const PRODUCED = 'https://soundcloud.com/l-miranda999/sets/produced-by-lmiranda';
  const MIXES = [
    {title:'LA CREOLE invite L\'Miranda', info:'Rinse France · 07.04.2024', url:'https://soundcloud.com/rinse_france/la-creole-invite-lmiranda-07-avril-2024'},
    {title:'Deprerreo: L\'Miranda b2b Candadismo', info:'Vanta Radio · 2025', url:'https://soundcloud.com/vanta-black-986864415/deprerreo-lmiranda-b2b-candadismo-vanta-radio'},
    {title:'116 · L\'Miranda (Joe Dembow)', info:'Plasma Radio · 2024', url:'https://soundcloud.com/itsplasmaradio/116-lmiranda-joe-dembow'},
    {title:'LBMX 055 · L\'Miranda', info:'La Bonne Musique · 2023', url:'https://soundcloud.com/lbmldn/lbmx-055-lmiranda'},
    {title:'Guest Mix · Turbo Radio Show #87', info:'Turbo · 2021', url:'https://soundcloud.com/turbo_sessions/lmiranda-guest-mix-turbo-radio-show-87'},
    {title:'092 · L\'Miranda x Malasuerteradio', info:'Malasuerteradio · 2021', url:'https://soundcloud.com/malasuerteradio/092-lmiranda-x-malasuerteradio'},
    {title:'Música Para Perrear Triste', info:'Mix de L\'Miranda para Deprerreo · 2020', url:'https://soundcloud.com/deprerreo/musica-para-perrear-triste'},
    {title:'SONGS OF FREEDOM', info:'Mix de L\'Miranda · 2019', url:'https://soundcloud.com/l-miranda999/lmiranda'},
    {title:'Keep Hush Live x Fuego: Deprerreo Takeover', info:'La Infinita, Barcelona · semana de Sónar 2023 · vídeo en YouTube', yt:'https://www.youtube.com/watch?v=HhBG2P5w648'}
  ];
  /* temas que no están en la playlist de SoundCloud (se muestran primero, los más nuevos arriba) */
  const SC_ = 'https://soundcloud.com/', SP_ = 'https://open.spotify.com/track/';
  const EXTRA = [
    {title:'Kruela x L\'Miranda x Unlimitedwifi - BANDiDOS', year:2026, url:SC_+'deprerreo/bandidos-kruela-x-lmiranda'},
    {title:'Ibn Itaka, David de Che, L\'Miranda - ABRETE CORAZÓN', year:2026, sp:SP_+'3HQXYUzZThxWus2rITpSFh'},
    {title:'L\'Miranda - Every Day Patches The Night Up', year:2026, url:SC_+'l-miranda999/every-day-patches-the-night-up'},
    {title:'CRRDR x L\'Miranda - TE GUSTA MI BACHATA', year:2025, sp:SP_+'0j4wwBV7QmvyIF6L5mDYkk'},
    {title:'CRRDR x L\'Miranda - TE GUSTA MI BACHATA (CRRDR Flip)', year:2025, url:SC_+'traaampaaa/premiere-crrdr-x-lmiranda-te-gusta-mi-bachata-crrdr-flip'},
    {title:'L\'Miranda x Kruela x Malandra x Candadismo - MARCHA MARCHA', year:2025, url:SC_+'globalc0re/lmiranda-x-candadismo-x-kruela-x-malandra-marcha-marcha-16'},
    {title:'L\'Miranda - LA MMWBDA', year:2024, url:SC_+'deprerreo/lmiranda-la-mmwbd-master-2'},
    {title:'CRRDR x L\'Miranda - Vaya Loki! (Malandrógino Mix)', year:2023, url:SC_+'lafrancesssap/8-vaya-loki-crrdr-x-lmiranda'},
    {title:'L\'Miranda x Feid - T Kiero Ver (Intro de Camionetica)', year:2021, url:SC_+'deprerreo/intro-lmiranda-x-feid-t-kiero'},
    {title:'L\'Miranda - La Canción Remix', year:2020, url:SC_+'deprerreo/lmiranda-la-cancion-remix'},
    {title:'YUNGLiAN x L\'Miranda - DEPRERREO (ACETO Remix)', year:2020, url:SC_+'deprerreo/2-deprerreo-aceto-remix'},
    {title:'YUNGLiAN x L\'Miranda - DEPRERREO (Kid Cala Remix)', year:2020, url:SC_+'deprerreo/1-deprerreo-kid-cala-remix'},
    {title:'L\'Miranda - Feel It Remix', year:2019, url:SC_+'clubdelritmo/lmiranda-feel-it-remix'}
  ];
  const E = EXTRA.length;
  let ext = -1, setSounds = [];
  const embed = (url, auto) => 'https://w.soundcloud.com/player/?url=' + encodeURIComponent(url) + '&color=%23ff3399&auto_play=' + (auto ? 'true' : 'false') + '&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=false';
  const OPTS = {auto_play:false, hide_related:true, show_comments:false, show_user:true, show_reposts:false, show_teaser:false, visual:false, color:'#ff3399'};
  const iframe = $('#sc'), viz = $('#viz'), seek = $('#seek');
  const fmt = (ms) => { const s = Math.floor((ms||0)/1000), h = Math.floor(s/3600), m = Math.floor(s/60)%60; return (h ? h+':'+String(m).padStart(2,'0') : String(m).padStart(2,'0')) + ':' + String(s%60).padStart(2,'0'); };
  let mode = 'prod', sounds = [], idx = 0, mixIdx = 0, dur = 0, playing = false, seeking = false, ready = false, w = null;
  const setTxt = (sel, t) => { const el = $(sel); if (el) el.textContent = t; };

  /* aviso solo para ti si abres el archivo desde tu ordenador */
  if (location.protocol === 'file:' && $('#localTip')) $('#localTip').hidden = false;

  const renderList = () => {
    const L = $('#plist'); if (!L) return;
    if (mode === 'mix') {
      setTxt('#nTracks', 'Mixes: ' + MIXES.length);
      L.innerHTML = MIXES.map((m,i) => m.yt
        ? '<li><div class="tt"><a href="'+esc(m.yt)+'" target="_blank" rel="noopener">'+esc(m.title)+'</a></div><div class="info">'+esc(m.info)+'</div><div class="ac"><a href="'+esc(m.yt)+'" target="_blank" rel="noopener">Ver en YouTube ↗</a></div></li>'
        : '<li class="'+(i===mixIdx?'active':'')+'"><div class="tt"><button type="button" data-i="'+i+'">'+esc(m.title)+'</button></div><div class="info">'+esc(m.info)+'</div><div class="ac"><button type="button" data-i="'+i+'">Escuchar</button> | <a href="'+esc(m.url)+'" target="_blank" rel="noopener">Comentar</a> | <a href="'+esc(m.url)+'" target="_blank" rel="noopener">Compartir</a></div></li>').join('');
      return;
    }
    setTxt('#nTracks', 'Temas: ' + (E + (setSounds.length || 0)));
    const ex = EXTRA.map((x,j) => {
      const link = x.url || x.sp, act = (ext === j) ? 'active' : '';
      const play = x.url ? '<button type="button" data-x="'+j+'">Escuchar</button>' : '<a href="'+esc(x.sp)+'" target="_blank" rel="noopener">Escuchar en Spotify ↗</a>';
      const tt = x.url ? '<button type="button" data-x="'+j+'">'+esc(x.title)+'</button>' : '<a href="'+esc(x.sp)+'" target="_blank" rel="noopener">'+esc(x.title)+'</a>';
      return '<li class="'+act+'"><div class="tt">'+tt+'<span class="pl">'+x.year+(x.sp ? ' · Spotify' : '')+'</span></div><div class="ac">'+play+' | <a href="'+esc(link)+'" target="_blank" rel="noopener">Compartir</a></div></li>';
    }).join('');
    if (!setSounds.length) { L.innerHTML = ex + '<li>Más temas en el reproductor de SoundCloud de abajo ↓ · <a href="'+PRODUCED+'" target="_blank" rel="noopener">abrir en SoundCloud</a></li>'; return; }
    L.innerHTML = ex + setSounds.map((s,i) => {
      const t = (s && s.title) || ('Tema ' + (i+1)), url = (s && s.permalink_url) || PRODUCED;
      const plays = s && s.playback_count ? 'Plays: ' + s.playback_count.toLocaleString('es-ES') : '';
      return '<li class="'+(ext<0 && i===idx?'active':'')+'"><div class="tt"><button type="button" data-i="'+i+'">'+esc(t)+'</button><span class="pl">'+plays+'</span></div><div class="ac"><button type="button" data-i="'+i+'">Escuchar</button> | <a href="'+esc(url)+'" target="_blank" rel="noopener">Comentar</a> | <a href="'+esc(url)+'" target="_blank" rel="noopener">Compartir</a></div></li>';
    }).join('');
  };
  const paintTabs = () => {
    $('#tabProd')?.setAttribute('aria-selected', mode === 'prod'); $('#tabMix')?.setAttribute('aria-selected', mode === 'mix');
    setTxt('#plName', mode === 'mix' ? 'Mixes de L\'Miranda' : 'Playlist: Produced by L\'Miranda');
    setTxt('#artName', mode === 'mix' ? 'Mixes de L\'Miranda' : 'Produced by L\'Miranda');
    setTxt('#artSub', mode === 'mix' ? 'Rinse France · Vanta Radio · Plasma' : 'Deprerreo · 2026');
  };
  const ico = () => {
    const i = $('#icoPlay'); if (i) i.innerHTML = playing ? '<rect x="2" y="0" width="3.5" height="14"/><rect x="8.5" y="0" width="3.5" height="14"/>' : '<path d="M2 0l12 7-12 7z"/>';
    $('#bPlay')?.setAttribute('aria-label', playing ? 'Pausa' : 'Reproducir'); viz?.classList.toggle('on', playing); setTxt('#pState', playing ? 'reproduciendo' : 'en pausa');
  };

  /* modo sin API: el iframe de SoundCloud funciona solo, cambiamos su dirección */
  const noApi = () => {
    w = null; $('#offline') && ($('#offline').style.display = 'block');
    setTxt('#pTitle', mode === 'mix' ? MIXES[mixIdx].title : 'Produced by L\'Miranda'); setTxt('#pState', 'dale al play en el reproductor de abajo ↓');
    renderList();
  };
  const srcFor = (play) => mode === 'mix' ? embed(MIXES[mixIdx].url, play) : embed(PRODUCED, play);

  const cur = () => {
    if (!w) return;
    w.getCurrentSound((s) => { if (!s) return; setTxt('#pTitle', s.title || '—'); setTxt('#pArtist', (s.user && s.user.username) || 'L\'Miranda'); dur = s.duration || 0; });
    if (mode === 'prod') { if (ext >= 0) { setTxt('#pTrackNo', (ext+1) + '/' + (E + setSounds.length)); renderList(); } else w.getCurrentSoundIndex((i) => { idx = i; setTxt('#pTrackNo', (E+i+1) + '/' + (E + setSounds.length)); renderList(); }); }
    else { setTxt('#pTrackNo', 'mix ' + (mixIdx+1) + '/' + NM); renderList(); }
  };
  const loadUrl = (url, play, after) => {
    playing = false; ico(); if (seek) seek.value = 0; setTxt('#pTime', '00:00'); setTxt('#pTitle', 'Cargando…');
    if (!w) { iframe.src = embed(url, play); setTxt('#pTitle', mode === 'mix' ? MIXES[mixIdx].title : 'Produced by L\'Miranda'); return; }
    w.load(url, Object.assign({}, OPTS, {auto_play: !!play, callback: () => { w.setVolume(+($('#vol')?.value || 80)); if (after) after(); cur(); }}));
  };
  const NM = MIXES.filter(m => m.url).length; /* los de YouTube van al final y no suenan aquí */
  const loadMix = (i, play) => { mixIdx = (i + NM) % NM; loadUrl(MIXES[mixIdx].url, play); renderList(); };
  const nextSc = (j, d) => { for (let k = 0; k < E; k++) { j += d; if (j < 0 || j >= E) return -1; if (EXTRA[j].url) return j; } return -1; };
  const loadExtra = (j, play) => { ext = j; loadUrl(EXTRA[j].url, play); renderList(); };
  const loadSet = (i, play) => { ext = -1; loadUrl(PRODUCED, play, () => { w.getSounds((l) => { if (l && l.length) setSounds = l; renderList(); }); if (i > 0) w.skip(i); }); };
  const goNext = () => { if (ext >= 0) { const j = nextSc(ext, 1); j >= 0 ? loadExtra(j, true) : loadSet(0, true); } else if (idx >= setSounds.length - 1 && setSounds.length) { loadExtra(nextSc(-1, 1), true); } else w.next(); };
  const goPrev = () => { if (ext >= 0) { const j = nextSc(ext, -1); j >= 0 ? loadExtra(j, true) : loadSet(Math.max(setSounds.length - 1, 0), true); } else if (idx <= 0) { const j = nextSc(E, -1); if (j >= 0) loadExtra(j, true); } else w.prev(); };
  const setMode = (m, play) => {
    if (m === mode) return; mode = m; paintTabs();
    if (m === 'mix') loadMix(0, play);
    else { ext = -1; renderList(); loadUrl(PRODUCED, play, () => w.getSounds((l) => { if (l && l.length) setSounds = l; renderList(); })); }
  };

  /* botones (funcionan con o sin API) */
  $('#tabProd')?.addEventListener('click', () => setMode('prod', false));
  $('#tabMix')?.addEventListener('click', () => setMode('mix', false));
  $('#bPlay')?.addEventListener('click', () => { if (w) w.toggle(); else { iframe.src = srcFor(true); if (window.showMusic) window.showMusic(); else iframe.scrollIntoView({block:'nearest', behavior:'smooth'}); } });
  $('#bStop')?.addEventListener('click', () => { if (w) { w.pause(); w.seekTo(0); } else iframe.src = srcFor(false); if (seek) seek.value = 0; setTxt('#pTime', '00:00'); });
  $('#bNext')?.addEventListener('click', () => mode === 'mix' ? loadMix(mixIdx + 1, true) : (w ? goNext() : null));
  $('#bPrev')?.addEventListener('click', () => mode === 'mix' ? loadMix(mixIdx - 1, true) : (w ? goPrev() : null));
  $('#quickPlay')?.addEventListener('click', () => { location.hash = '#musica'; if (w) w.play(); else iframe.src = srcFor(true); });
  $('#plist')?.addEventListener('click', (e) => {
    const x = e.target.closest('button[data-x]');
    if (x) { const j = +x.dataset.x; if (w) loadExtra(j, true); else { ext = j; iframe.src = embed(EXTRA[j].url, true); renderList(); } return; }
    const b = e.target.closest('button[data-i]'); if (!b) return; const i = +b.dataset.i;
    if (mode === 'mix') loadMix(i, true); else if (w) { if (ext >= 0) loadSet(i, true); else w.skip(i); }
  });
  $('#vol')?.addEventListener('input', (e) => w && w.setVolume(+e.target.value));
  seek?.addEventListener('input', () => { seeking = true; });
  seek?.addEventListener('change', () => { if (w && dur) w.seekTo(seek.value/1000*dur); seeking = false; });

  renderList(); paintTabs();
  window.lmPlay = () => { if (w) { if (!playing) w.play(); } else iframe.src = srcFor(true); };
  window.lmIsPlaying = () => playing;
  window.lmMode = (m) => setMode(m, true);
  if (location.hash === '#mixes') { mode = 'mix'; paintTabs(); iframe.src = embed(MIXES[0].url, false); renderList(); }
  if (!window.SC || !SC.Widget) { noApi(); return; }
  w = SC.Widget(iframe);
  const ft = setTimeout(() => { if (!ready) noApi(); }, 9000);
  w.bind(SC.Widget.Events.READY, () => { if (ready) return; ready = true; clearTimeout(ft); if (window.AUTO_PLAY) w.play(); w.setVolume(+($('#vol')?.value || 80)); setTxt('#pState', 'listo'); if (mode === 'prod') w.getSounds((l) => { setSounds = l || []; renderList(); cur(); }); else cur(); });
  w.bind(SC.Widget.Events.PLAY, () => { playing = true; ico(); cur(); });
  w.bind(SC.Widget.Events.PAUSE, () => { playing = false; ico(); });
  w.bind(SC.Widget.Events.FINISH, () => { playing = false; ico(); if (mode === 'mix') loadMix(mixIdx + 1, true); else if (ext >= 0 || (setSounds.length && idx >= setSounds.length - 1)) goNext(); });
  w.bind(SC.Widget.Events.PLAY_PROGRESS, (e) => { setTxt('#pTime', fmt(e.currentPosition)); if (!seeking && dur && seek) seek.value = Math.round(e.currentPosition/dur*1000); });
})();
