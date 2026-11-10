/* ---------- reproductor SoundCloud ---------- */
(function(){
  const PRODUCED = 'https://soundcloud.com/l-miranda999/sets/produced-by-lmiranda';
  const MIXES = [
    {title:'Keep Hush Live x Fuego: Deprerreo Takeover', info:'La Infinita, Barcelona · semana de Sónar 2023', url:'https://soundcloud.com/keep-hush/lilfemiranda'},
    {title:'LA CREOLE invite L\'Miranda', info:'Rinse France · 07.04.2024', url:'https://soundcloud.com/rinse_france/la-creole-invite-lmiranda-07-avril-2024'},
    {title:'Música Para Perrear Triste', info:'Mix de L\'Miranda para Deprerreo', url:'https://soundcloud.com/deprerreo/musica-para-perrear-triste'}
  ];
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
      L.innerHTML = MIXES.map((m,i) => '<li class="'+(i===mixIdx?'active':'')+'"><div class="tt"><button type="button" data-i="'+i+'">'+esc(m.title)+'</button></div><div class="info">'+esc(m.info)+'</div><div class="ac"><button type="button" data-i="'+i+'">Escuchar</button> | <a href="'+esc(m.url)+'" target="_blank" rel="noopener">Comentar</a> | <a href="'+esc(m.url)+'" target="_blank" rel="noopener">Compartir</a></div></li>').join('');
      return;
    }
    setTxt('#nTracks', 'Temas: ' + (sounds.length || '—'));
    if (!sounds.length) { L.innerHTML = '<li>Los temas suenan en el reproductor de SoundCloud de abajo ↓ · <a href="'+PRODUCED+'" target="_blank" rel="noopener">abrir en SoundCloud</a></li>'; return; }
    L.innerHTML = sounds.map((s,i) => {
      const t = (s && s.title) || ('Tema ' + (i+1)), url = (s && s.permalink_url) || PRODUCED;
      const plays = s && s.playback_count ? 'Plays: ' + s.playback_count.toLocaleString('es-ES') : '';
      return '<li class="'+(i===idx?'active':'')+'"><div class="tt"><button type="button" data-i="'+i+'">'+esc(t)+'</button><span class="pl">'+plays+'</span></div><div class="ac"><button type="button" data-i="'+i+'">Escuchar</button> | <a href="'+esc(url)+'" target="_blank" rel="noopener">Comentar</a> | <a href="'+esc(url)+'" target="_blank" rel="noopener">Compartir</a></div></li>';
    }).join('');
  };
  const paintTabs = () => {
    $('#tabProd')?.setAttribute('aria-selected', mode === 'prod'); $('#tabMix')?.setAttribute('aria-selected', mode === 'mix');
    setTxt('#plName', mode === 'mix' ? 'Mixes de L\'Miranda' : 'Playlist: Produced by L\'Miranda');
    setTxt('#artName', mode === 'mix' ? 'Mixes de L\'Miranda' : 'Produced by L\'Miranda');
    setTxt('#artSub', mode === 'mix' ? 'Keep Hush · Rinse France · Deprerreo' : 'Deprerreo · 2026');
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
    if (mode === 'prod') w.getCurrentSoundIndex((i) => { idx = i; setTxt('#pTrackNo', (i+1) + '/' + (sounds.length || 1)); renderList(); });
    else { setTxt('#pTrackNo', 'mix ' + (mixIdx+1) + '/' + MIXES.length); renderList(); }
  };
  const loadUrl = (url, play, after) => {
    playing = false; ico(); if (seek) seek.value = 0; setTxt('#pTime', '00:00'); setTxt('#pTitle', 'Cargando…');
    if (!w) { iframe.src = embed(url, play); setTxt('#pTitle', mode === 'mix' ? MIXES[mixIdx].title : 'Produced by L\'Miranda'); return; }
    w.load(url, Object.assign({}, OPTS, {auto_play: !!play, callback: () => { w.setVolume(+($('#vol')?.value || 80)); if (after) after(); cur(); }}));
  };
  const loadMix = (i, play) => { mixIdx = (i + MIXES.length) % MIXES.length; loadUrl(MIXES[mixIdx].url, play); renderList(); };
  const setMode = (m, play) => {
    if (m === mode) return; mode = m; paintTabs();
    if (m === 'mix') loadMix(0, play);
    else { sounds = []; renderList(); loadUrl(PRODUCED, play, () => w.getSounds((l) => { sounds = l || []; renderList(); })); }
  };

  /* botones (funcionan con o sin API) */
  $('#tabProd')?.addEventListener('click', () => setMode('prod', false));
  $('#tabMix')?.addEventListener('click', () => setMode('mix', false));
  $('#bPlay')?.addEventListener('click', () => { if (w) w.toggle(); else { iframe.src = srcFor(true); if (window.showMusic) window.showMusic(); else iframe.scrollIntoView({block:'nearest', behavior:'smooth'}); } });
  $('#bStop')?.addEventListener('click', () => { if (w) { w.pause(); w.seekTo(0); } else iframe.src = srcFor(false); if (seek) seek.value = 0; setTxt('#pTime', '00:00'); });
  $('#bNext')?.addEventListener('click', () => mode === 'mix' ? loadMix(mixIdx + 1, true) : (w ? w.next() : null));
  $('#bPrev')?.addEventListener('click', () => mode === 'mix' ? loadMix(mixIdx - 1, true) : (w ? w.prev() : null));
  $('#quickPlay')?.addEventListener('click', () => { location.hash = '#musica'; if (w) w.play(); else iframe.src = srcFor(true); });
  $('#plist')?.addEventListener('click', (e) => { const b = e.target.closest('button[data-i]'); if (!b) return; const i = +b.dataset.i; if (mode === 'mix') loadMix(i, true); else if (w) w.skip(i); });
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
  w.bind(SC.Widget.Events.READY, () => { if (ready) return; ready = true; clearTimeout(ft); if (window.AUTO_PLAY) w.play(); w.setVolume(+($('#vol')?.value || 80)); setTxt('#pState', 'listo'); if (mode === 'prod') w.getSounds((l) => { sounds = l || []; renderList(); cur(); }); else cur(); });
  w.bind(SC.Widget.Events.PLAY, () => { playing = true; ico(); cur(); });
  w.bind(SC.Widget.Events.PAUSE, () => { playing = false; ico(); });
  w.bind(SC.Widget.Events.FINISH, () => { playing = false; ico(); if (mode === 'mix') loadMix(mixIdx + 1, true); });
  w.bind(SC.Widget.Events.PLAY_PROGRESS, (e) => { setTxt('#pTime', fmt(e.currentPosition)); if (!seeking && dur && seek) seek.value = Math.round(e.currentPosition/dur*1000); });
})();
