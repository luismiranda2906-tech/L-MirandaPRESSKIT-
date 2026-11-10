import math
def ctrl():
    o = ['<svg viewBox="0 0 410 228" preserveAspectRatio="none" aria-hidden="true"><defs>',
     '<linearGradient id="cb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a3e48"/><stop offset=".08" stop-color="#22252c"/><stop offset="1" stop-color="#0f1013"/></linearGradient>',
     '<radialGradient id="jg" cx=".45" cy=".4"><stop offset="0" stop-color="#5a5f6b"/><stop offset=".55" stop-color="#2a2d35"/><stop offset="1" stop-color="#121317"/></radialGradient>',
     '<linearGradient id="fc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f2f3f6"/><stop offset="1" stop-color="#8d919c"/></linearGradient>',
     '<linearGradient id="gl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#20d6c8" stop-opacity=".10"/><stop offset="1" stop-color="#3a7a2a" stop-opacity=".18"/></linearGradient>',
     '</defs>',
     '<rect x="1" y="4" width="408" height="222" rx="12" fill="#07080a"/>',
     '<rect x="3" y="2" width="404" height="214" rx="11" fill="url(#cb)" stroke="#4a4f5a" stroke-width="1.5"/>',
     '<rect x="3" y="208" width="404" height="16" rx="6" fill="#0a0b0d"/>']
    for cx, cls in [(88, 'l'), (322, 'r')]:
        o.append('<rect x="%d" y="12" width="132" height="18" rx="3" fill="#06100c" stroke="#2a2d35"/>' % (cx-66))
        o.append('<path d="M%d 21 %s" stroke="#20d6c8" stroke-width="1.4" fill="none" opacity=".8"/>' % (cx-62, ' '.join('L%d %.1f' % (cx-62+i*4, 21 + 6*math.sin(i*1.3+cx)*abs(math.sin(i*.4))) for i in range(1, 32))))
        o.append('<circle cx="%d" cy="98" r="62" fill="#0b0c0f" stroke="#555a66" stroke-width="2"/>' % cx)
        o.append('<g class="jog %s"><circle cx="%d" cy="98" r="56" fill="url(#jg)"/>' % (cls, cx))
        for r in range(18, 56, 5):
            o.append('<circle cx="%d" cy="98" r="%d" fill="none" stroke="#000" stroke-opacity=".35" stroke-width=".8"/>' % (cx, r))
        o.append('<rect x="%d" y="44" width="3" height="16" rx="1" fill="#e9f7ef"/></g>' % (cx-1))
        o.append('<circle cx="%d" cy="98" r="16" fill="#0a0b0d" stroke="#20d6c8" stroke-width="2.5" opacity=".9"/><circle cx="%d" cy="98" r="5" fill="#3a3e48"/>' % (cx, cx))
        x0 = cx - 50
        for j in range(4):
            for k in range(2):
                col = ['#20d6c8', '#ff2e8a', '#f6c51e', '#20d6c8'][j]
                o.append('<rect class="pad" x="%d" y="%d" width="22" height="12" rx="2" fill="%s"/>' % (x0 + j*26, 170 + k*16, col))
        bx = cx - 62
        o.append('<circle cx="%d" cy="176" r="7" fill="#1b1d22" stroke="#f6c51e" stroke-width="1.6"/><circle cx="%d" cy="196" r="7" fill="#1b1d22" stroke="#3dff8a" stroke-width="1.6"/><path d="M%d 193l5 3-5 3z" fill="#3dff8a"/>' % (bx, bx, bx-2))
    # mezclador central
    o.append('<rect x="160" y="10" width="90" height="196" rx="4" fill="#15171c" stroke="#2f333c"/>')
    for row in range(4):
        for cx in (178, 232):
            y = 26 + row*22
            o.append('<circle cx="%d" cy="%d" r="7.5" fill="url(#fc)" stroke="#000" stroke-width=".8"/><line x1="%d" y1="%d" x2="%d" y2="%d" stroke="#111" stroke-width="1.6"/>' % (cx, y, cx, y, cx + (2 if row % 2 else -3), y-6))
    for cx in (199, 211):
        for i in range(9):
            col = '#ff3b2e' if i < 2 else ('#f6c51e' if i < 4 else '#3dff8a')
            o.append('<rect class="led" x="%d" y="%d" width="7" height="6" rx="1" fill="%s"/>' % (cx-3, 18 + i*9, col))
    for cx, fy in ((178, 132), (232, 150)):
        o.append('<rect x="%d" y="112" width="4" height="58" rx="2" fill="#000"/><rect x="%d" y="%d" width="18" height="10" rx="2" fill="url(#fc)" stroke="#000"/>' % (cx-2, cx-9, fy))
    o.append('<rect x="180" y="186" width="50" height="4" rx="2" fill="#000"/><rect x="198" y="181" width="14" height="14" rx="2" fill="url(#fc)" stroke="#000"/>')
    o.append('<text x="205" y="203" text-anchor="middle" font-family="Space Mono,monospace" font-size="6" letter-spacing="1.5" fill="#6d7280">DEPRERREO</text>')
    o.append('<rect x="3" y="2" width="404" height="222" rx="11" fill="url(#gl)" style="mix-blend-mode:screen"/>')
    o.append('<path d="M14 6h380" stroke="#ffffff" stroke-opacity=".25" stroke-width="1.5"/>')
    o.append('</svg>')
    return ''.join(o)
