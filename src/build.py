import re, base64, json
from ctrl import ctrl
BEER = '''<svg class="beer" viewBox="0 0 1600 1195" aria-hidden="true">
      <defs>
        <clipPath id="occ"><rect x="560" y="982" width="600" height="213"/></clipPath>
        <linearGradient id="amb" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3a1a04"/><stop offset=".35" stop-color="#8a4a10"/><stop offset=".55" stop-color="#c47a26"/><stop offset="1" stop-color="#2a1203"/></linearGradient>
        <linearGradient id="skn" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d9c493"/><stop offset="1" stop-color="#97804f"/></linearGradient>
      </defs>
      <image class="hd" href="__HEAD__" x="680" y="360" width="240" height="200"/>
      <g class="arm">
        <path d="M-21 26 Q8 18 37 42 L-135 690 L-207 668 Z" fill="#0c0d0e"/>
        <path d="M2 90 L-120 600 M18 70 L-90 520" stroke="#1d1f22" stroke-width="3" fill="none"/>
        <path d="M-17 -38 Q-17 -50 -7 -58 L-6 -104 L6 -104 L7 -58 Q17 -50 17 -38 L17 52 Q17 58 10 58 L-10 58 Q-17 58 -17 52 Z" fill="url(#amb)" stroke="#1a0a02" stroke-width="1.5"/>
        <rect x="-7.5" y="-114" width="15" height="11" rx="2" fill="#d8b23a" stroke="#5a4510"/>
        <rect x="-17" y="-22" width="34" height="34" fill="#e8d36a"/>
        <rect x="-17" y="-22" width="34" height="6" fill="#b3261a"/>
        <text x="0" y="4" text-anchor="middle" font-family="Space Mono,monospace" font-weight="700" font-size="9" fill="#1d1f26">L'M</text>
        <path d="M-9 -30 L-9 40" stroke="#fff" stroke-opacity=".35" stroke-width="3"/>
        <path d="M-22 6 Q-24 -6 -14 -8 L20 -6 Q26 -4 24 4 Z" fill="url(#skn)"/>
        <rect x="-21" y="2" width="44" height="10" rx="5" fill="url(#skn)" stroke="#6e5a35" stroke-width=".8"/>
        <rect x="-21" y="12" width="45" height="10" rx="5" fill="url(#skn)" stroke="#6e5a35" stroke-width=".8"/>
        <rect x="-20" y="22" width="43" height="10" rx="5" fill="url(#skn)" stroke="#6e5a35" stroke-width=".8"/>
        <rect x="-18" y="32" width="38" height="9" rx="4.5" fill="url(#skn)" stroke="#6e5a35" stroke-width=".8"/>
        <path d="M-6 30 Q12 46 32 30 L30 26" fill="url(#skn)"/>
      </g>
      <image href="__SHOP__" x="0" y="0" width="1600" height="1195" clip-path="url(#occ)"/>
      <image href="__DOGFULL__" x="785" y="810" width="160" height="195"/>
    </svg>'''
s = open('template_o.html', encoding='utf-8').read()
o, p = open('stars.txt').read().split('\n')[:2]
STAR1 = ('<svg viewBox="0 0 206 166"><defs><linearGradient id="so" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff9a2a"/><stop offset="1" stop-color="#ff6510"/></linearGradient></defs>'
         '<polygon points="%s" fill="url(#so)"/><g transform="rotate(-14 103 83)" fill="#2a1640" text-anchor="middle"><text x="103" y="78" font-size="25">SPECIAL</text><text x="106" y="108" font-size="25">TRACKS</text></g></svg>') % o
STAR2 = ('<svg viewBox="0 0 204 182"><defs><linearGradient id="sp" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff4fa8"/><stop offset="1" stop-color="#ff2a80"/></linearGradient></defs>'
         '<polygon points="%s" fill="url(#sp)"/><g transform="rotate(14 102 91)" fill="#2a1640" text-anchor="middle"><text x="102" y="66" font-size="22">LAST</text><text x="102" y="102" font-size="36">5</text><text x="102" y="130" font-size="22">MIXES</text></g></svg>') % p
s = s.replace('__BEER__', BEER).replace('__CTRL__', ctrl()).replace('__STAR1__', STAR1).replace('__STAR2__', STAR2)
def pc(x0, y0, x1, y1): return '--x:%.2f%%;--y:%.2f%%;--w:%.2f%%;--h:%.2f%%' % (x0/16, y0/11.95, (x1-x0)/16, (y1-y0)/11.95)
import math
def card(box, deg, grow=1.05):
    x0,y0,x1,y1=box; bw,bh=x1-x0,y1-y0; t=math.radians(abs(deg)); c,sn=math.cos(t),math.sin(t); d=c*c-sn*sn
    W=(bw*c-bh*sn)/d*grow; H=(bh*c-bw*sn)/d*grow; cx,cy=(x0+x1)/2,(y0+y1)/2
    return '--x:%.2f%%;--y:%.2f%%;--w:%.2f%%;--h:%.2f%%;--r:%sdeg' % ((cx-W/2)/16,(cy-H/2)/11.95,W/16,H/11.95,deg)
CARDS = [
 ('data-p="p-press"', 'Prensa', (135, 216, 282, 334), -10, '__PFP__', '50% 40%'),
 ('data-p="p-shows"', 'Shows', (306, 288, 407, 434), 7, '__RAZZ__', '40% 30%'),
 ('href="https://open.spotify.com/artist/2v8V8xnimi2FUOxXWINNUr" target="_blank" rel="noopener"', 'Spotify', (470, 205, 607, 319), 3, '__COVER__', '62% 28%'),
 ('data-p="p-rider"', 'Rider', (160, 523, 298, 620), -1.5, '__PHOTO__', '45% 45%'),
 ('data-p="p-fotos"', 'Fotos', (830, 243, 972, 354), -3.5, '__FURRY__', '50% 30%'),
 ('data-p="p-vid"', 'Vídeos', (1046, 223, 1140, 364), 2, '__WOLVES__', '50% 30%'),
 ('href="https://soundcloud.com/l-miranda999" target="_blank" rel="noopener"', 'SoundCloud', (1190, 294, 1330, 402), 1, '__HOW__', '50% 35%'),
 ('href="__IG_URL__" target="_blank" rel="noopener"', 'Instagram', (1055, 404, 1205, 525), 7, '__SERV__', '50% 30%'),
 ('href="__DRIVE_FOTOS__" target="_blank" rel="noopener"', 'Descargas', (1226, 521, 1352, 685), -10, '__YIN__', '50% 40%'),
]
out = []
for i,(at, lab, box, deg, img, op) in enumerate(CARDS):
    tag = 'a' if at.startswith('href') else 'button'
    typ = '' if tag == 'a' else ' type="button"'
    out.append('<%s class="at hs card"%s %s style="%s;--pd:%ss" aria-label="%s"><img src="%s" alt="" style="object-position:%s"><i class="pin a"></i><i class="pin b"></i><span class="glw">%s</span></%s>' % (tag, typ, at, card(box, deg), -i*1.5, lab, img, op, lab + (' ↗' if tag == 'a' else ''), tag))
def pc(x0, y0, x1, y1): return '--x:%.2f%%;--y:%.2f%%;--w:%.2f%%;--h:%.2f%%' % (x0/16, y0/11.95, (x1-x0)/16, (y1-y0)/11.95)
HS = [
 ('href="https://open.spotify.com/artist/2v8V8xnimi2FUOxXWINNUr" target="_blank" rel="noopener"', 'spotify ↗', (1425, 340, 1595, 790), '', -11),
 ('data-music="prod"', 'música', (150, 780, 560, 1008), 'up', -13.5),
 ('data-music="mix"', 'mixes', (1018, 790, 1142, 988), 'up', -2.5),
 ('data-p="p-book"', 'booking', (583, 880, 702, 985), 'up', -5.5),
 ('data-toggle="1"', '▶ play', (700, 812, 942, 1005), '', -8.5),
]
for at, lab, box, up, pd in HS:
    if at.startswith('href'):
        out.append('<a class="at hs" %s style="%s;--pd:%ss" aria-label="Spotify"><span class="glw t" aria-hidden="true" style="bottom:auto;top:46%%">%s</span></a>' % (at, pc(*box), pd, lab)); continue
    g = '' if at.startswith('data-toggle') else '<span class="glw t%s" aria-hidden="true">%s</span>' % (' up' if up else '', lab)
    out.append('<button class="at hs" type="button" %s style="%s;--pd:%ss" aria-label="%s">%s</button>' % (at, pc(*box), pd, 'Reproducir o pausar' if at.startswith('data-toggle') else lab, g))
s = s.replace('__HOTSPOTS__', '\n    '.join(out))
P = open('panels_k.html').read()
P = re.sub(r'<div class="row3">.*?</div>', '''<div class="row3">
          <img src="__SERV__" alt="L'Miranda pinchando con camiseta azul">
          <img src="__RAZZ__" alt="L'Miranda pinchando en Razzmatazz">
          <img src="__PHOTO__" alt="L'Miranda con sudadera morada" style="object-position:62% 30%">
          <img src="__COVER__" alt="L'Miranda pinchando bajo luz roja" style="object-position:60% 25%">
          <img src="__FURRY__" alt="L'Miranda con amigos en fursuit">
          <img src="__SHOPCROP__" alt="L'Miranda detrás del mostrador">
        </div>''', P, count=1, flags=re.S)
P = re.sub(r'<section class="panel" id="p-fotos".*?</section>', """<section class="panel" id="p-fotos" data-t="fotos">
        <p class="hint2">Pulsa una foto para abrirla en alta y descargarla.</p>
        __GAL_FOTOS__
        <div class="chips"><a class="chip" href="__DRIVE_FOTOS__" target="_blank" rel="noopener">⬇ descargar todas</a><a class="chip" href="__IG_URL__" target="_blank" rel="noopener">instagram</a></div>
      </section>""", P, count=1, flags=re.S)
P = re.sub(r'<section class="panel" id="p-vid".*?</section>', """<section class="panel" id="p-vid" data-t="vídeos">
        <iframe class="yt" id="ytf" data-src="https://www.youtube.com/embed/j2IHmWWnTM8?rel=0" title="LA CREOLE invite L'Miranda · Rinse France" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        <p class="hint2" style="margin-top:16px">Todos los vídeos · pulsa uno para verlo y descargarlo.</p>
        __GAL_VIDEOS__
        <div class="chips"><a class="chip" href="__DRIVE_VIDEOS__" target="_blank" rel="noopener">⬇ descargar todos</a><a class="chip" href="__IG_URL__reels/" target="_blank" rel="noopener">reels</a><a class="chip" href="https://www.youtube.com/watch?v=j2IHmWWnTM8" target="_blank" rel="noopener">youtube</a></div>
      </section>""", P, count=1, flags=re.S)
G = json.load(open('gallery.json'))
def gal(ids, kind):
    return '<div class="gal">' + ''.join('<button type="button" class="gi%s" data-g="%s" data-i="%d" data-id="%s" aria-label="%s %d"><img loading="lazy" src="https://drive.google.com/thumbnail?id=%s&amp;sz=w400" alt=""></button>' % (' v" data-v="1' if kind == 'videos' else '', kind, i, fid, 'Vídeo' if kind == 'videos' else 'Foto', i + 1, fid) for i, fid in enumerate(ids)) + '</div>'
P = P.replace('__GAL_FOTOS__', gal(G['fotos'], 'fotos')).replace('__GAL_VIDEOS__', gal(G['videos'], 'videos'))
s = s.replace('__PANELS__', P)
import os
KEYF = 'drive_key.txt'
s = s.replace('__DRIVE_KEY__', open(KEYF).read().strip() if os.path.exists(KEYF) else '')
s = s.replace('/*PLAYER*/', open('player.js', encoding='utf-8').read())
s = s.replace("color=%23ff3399", "color=%23f6c51e").replace("color:'#ff3399'", "color:'#f6c51e'")
from PIL import Image
im = Image.open('img/shop_src.png').convert('RGB').crop((600, 360, 1030, 790)); im.save('img/shopcrop.jpg', quality=82)
b = lambda p: 'data:image/jpeg;base64,' + base64.b64encode(open(p, 'rb').read()).decode()
pn = lambda p: 'data:image/png;base64,' + base64.b64encode(open(p, 'rb').read()).decode()
for k, v in {'__SHOP__': b('img/shop.jpg'), '__FASCIA__': b('img/fascia_tile.jpg'), '__BRICK__': open('brick_uri.txt').read(), '__LOGO__': pn('img/logo_dep.png'), '__SHOPCROP__': b('img/shopcrop.jpg'), '__DOG__': pn('img/dog_head.png'), '__HEAD__': pn('img/head_sprite.png'), '__DOGFULL__': pn('img/dog_cut.png'), '__PUP__': pn('img/pup_head.png'),
             '__RAZZ__': b('img/p_razz.jpg'), '__PFP__': b('img/pfp.jpg'), '__WOLVES__': b('img/p_wolves.jpg'), '__HOW__': b('img/g_how.jpg'), '__YIN__': b('img/g_yin.jpg'), '__FURRY__': b('img/p_furry.jpg'), '__SERV__': b('img/p_serv.jpg'), '__COVER__': b('img/cover.jpg'), '__PHOTO__': b('img/photo.jpg'),
             '__DRIVE_FOTOS__': 'https://drive.google.com/drive/folders/1-zXdux3NVXg0APTMoxG6T4v7MVquMrON?usp=sharing', '__DRIVE_VIDEOS__': 'https://drive.google.com/drive/folders/1HcD8o-i_sStxpM09HUEj9DMKFLajxro5?usp=sharing',
             '__IG_URL__': 'https://www.instagram.com/lilfemiranda/', '__BOOKING_EMAIL__': 'deprerreoforever@gmail.com'}.items():
    s = s.replace(k, v)
assert not re.findall(r'__[A-Z0-9_]+__', s), re.findall(r'__[A-Z0-9_]+__', s)
open('../index.html', 'w', encoding='utf-8').write(s)
print('ok', len(s))
