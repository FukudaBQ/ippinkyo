#!/usr/bin/env python3
"""
一品居 高幡不動店 - 食べ放題・コース・セット生成スクリプト
document/buffet_and_set/ のデータから buffet/ ページを生成する
"""

import re
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

BASE = Path('/Users/bowei.qu/Desktop/projects/personal/ippinkyo')
DOC = BASE / 'document' / 'buffet_and_set'
BUFFET_DIR = BASE / 'buffet'
IMAGES_DIR = BASE / 'images' / 'buffet'

PAGES = [
    {'id': 'all-you-can-eat', 'name': '食べ放題・飲み放題', 'file': '食べ放題・飲み放題', 'color': '#B71C1C', 'icon': '🍽️'},
    {'id': 'course', 'name': '逸品居お得コース', 'file': '逸品居お得コース', 'color': '#880E4F', 'icon': '🥘'},
    {'id': 'drink-set', 'name': 'お得な飲みセット', 'file': 'お得な飲みセット', 'color': '#E65100', 'icon': '🍻'},
    {'id': 'set-meal', 'name': '定食メニュー', 'file': '定食メニュー', 'color': '#00695C', 'icon': '🍱'},
    {'id': 'small-plate', 'name': '小皿料理', 'file': '小皿料理', 'color': '#4527A0', 'icon': '🥢'},
]

PAGE_NAV = list(PAGES)

try:
    FONT_TITLE = ImageFont.truetype('/System/Library/Fonts/ヒラギノ角ゴシック W6.ttc', 26)
    FONT_BODY = ImageFont.truetype('/System/Library/Fonts/ヒラギノ角ゴシック W4.ttc', 18)
    FONT_SMALL = ImageFont.truetype('/System/Library/Fonts/ヒラギノ角ゴシック W3.ttc', 14)
except Exception:
    FONT_TITLE = FONT_BODY = FONT_SMALL = ImageFont.load_default()


def parse_dish_name(raw):
    jp = raw.strip()
    cn = ''
    m = re.search(r'[（(](.+?)[）)]', jp)
    if m:
        cn = m.group(1)
        jp = jp[:m.start()].strip()
    return jp, cn


def parse_all_you_can_eat():
    filepath = DOC / '食べ放題・飲み放題'
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    header_lines = []
    dishes = []
    in_table = False

    for line in lines:
        line = line.rstrip('\n')
        if not line.strip() or '---' in line:
            continue
        if line.startswith('|'):
            in_table = True
            cells = [c.strip() for c in line.split('|')[1:-1]]
            if not cells or cells[0] in ('菜品名', '菜品', '序号'):
                continue
            name = cells[0].strip()
            if not name or '不明' in name:
                continue
            jp, cn = parse_dish_name(name)
            if cn and cells[1]:
                cn = cells[1].strip()
            dishes.append({
                'id': f'all-you-can-eat-{len(dishes)}',
                'name_jp': jp,
                'name_cn': cn,
                'price': '',
                'qty': '',
            })
        else:
            if not in_table:
                header_lines.append(line.strip())

    return {
        'title': '食べ放題・飲み放題',
        'subtitle': 'ALL YOU CAN EAT & DRINK',
        'price_info': header_lines[0] if header_lines else '',
        'notes': header_lines[1:] if len(header_lines) > 1 else [],
        'dishes': dishes,
    }


def parse_course():
    filepath = DOC / '逸品居お得コース'
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    header_lines = []
    dishes = []

    for line in lines:
        line = line.rstrip('\n')
        if not line.strip() or '---' in line:
            continue
        if line.startswith('|'):
            cells = [c.strip() for c in line.split('|')[1:-1]]
            if not cells or cells[0] in ('菜品', '序号'):
                continue
            name = cells[0].strip()
            if not name or '不明' in name:
                continue
            jp, cn = parse_dish_name(name)
            desc = cells[1].strip() if len(cells) >= 2 else ''
            if desc and not cn:
                cn = desc
            dishes.append({
                'id': f'course-{len(dishes)}',
                'name_jp': jp,
                'name_cn': cn or desc,
                'price': '',
                'qty': '',
            })
        else:
            header_lines.append(line.strip())

    return {
        'title': '逸品居お得コース',
        'subtitle': 'IPPINKYO VALUE COURSE',
        'price_info': header_lines[0] if header_lines else '',
        'notes': header_lines[1:] if len(header_lines) > 1 else [],
        'dishes': dishes,
    }


def parse_drink_set():
    filepath = DOC / 'お得な飲みセット'
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    sections = {
        'header': [],
        'drinks': [],
        'appetizers': [],
        'main_dishes': [],
        'dimsum': [],
    }
    current_section = 'header'

    for line in lines:
        line = line.rstrip('\n')
        if not line.strip() or '---' in line:
            continue

        if '3点セット' in line or '4点セット' in line:
            sections['header'].append(line.strip())
            continue

        if '饮品' in line or 'ドリンク' in line.lower():
            current_section = 'drinks'
            sections['header'].append(line.strip())
            continue
        if '小菜' in line or 'おつまみ' in line:
            current_section = 'appetizers'
            continue
        if '料理' in line and '選択' in line or '料理选择' in line:
            current_section = 'main_dishes'
            continue
        if '点心' in line:
            current_section = 'dimsum'
            continue

        if line.startswith('|'):
            cells = [c.strip() for c in line.split('|')[1:-1]]
            if not cells:
                continue
            first = cells[0].strip()
            if first in ('菜品', '序号', '菜品 ', ''):
                continue

            if len(cells) >= 3:
                name = cells[1].strip() if cells[1].strip() else first
                cn = cells[2].strip() if len(cells) >= 3 and cells[2].strip() not in ('价格（单点）',) else ''
            elif len(cells) >= 2:
                name = cells[1].strip() if not cells[1].strip().replace(',', '').replace('円', '').isdigit() else first
                cn = cells[1].strip() if cells[1].strip() and name != cells[1].strip() else ''
            else:
                name = first
                cn = ''

            if '不明' in name:
                continue

            jp, cn2 = parse_dish_name(name)
            if cn2:
                cn = cn2

            sections[current_section].append({
                'id': f'drink-set-{current_section}-{len(sections[current_section])}',
                'name_jp': jp,
                'name_cn': cn,
                'price': '',
                'qty': '',
            })

    dimsum_list = []
    for line in lines:
        line = line.strip()
        if not line or '---' in line or line.startswith('|') or '点心' in line or '選択' in line or '选择' in line:
            continue
        if line and not line.startswith('|') and current_section == 'dimsum':
            pass

    return sections


def parse_set_meal():
    filepath = DOC / '定食メニュー'
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    header_lines = []
    dishes = []

    for line in lines:
        line = line.rstrip('\n')
        if not line.strip() or '---' in line:
            continue
        if line.startswith('|'):
            cells = [c.strip() for c in line.split('|')[1:-1]]
            if not cells or cells[0] in ('菜品', ''):
                continue
            name = cells[0].strip()
            price = cells[1].strip() if len(cells) >= 2 else ''
            if '不明' in name:
                continue
            jp, cn = parse_dish_name(name)
            dishes.append({
                'id': f'set-meal-{len(dishes)}',
                'name_jp': jp,
                'name_cn': cn,
                'price': price,
                'qty': '',
            })
        else:
            header_lines.append(line.strip())

    return {
        'title': '定食メニュー',
        'subtitle': 'SET MEAL',
        'price_info': header_lines[0] if header_lines else '',
        'notes': header_lines[1:] if len(header_lines) > 1 else [],
        'dishes': dishes,
    }


def parse_small_plate():
    filepath = DOC / '小皿料理'
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    header_lines = []
    dishes = []

    for line in lines:
        line = line.rstrip('\n')
        if not line.strip() or '---' in line:
            continue
        if line.startswith('|'):
            cells = [c.strip() for c in line.split('|')[1:-1]]
            if not cells or cells[0] in ('菜品', ''):
                continue
            name = cells[0].strip()
            desc = cells[1].strip() if len(cells) >= 2 else ''
            if '不明' in name:
                continue
            jp, cn = parse_dish_name(name)
            if not cn and desc and desc not in ('说明',):
                cn = desc
            dishes.append({
                'id': f'small-plate-{len(dishes)}',
                'name_jp': jp,
                'name_cn': cn,
                'price': '',
                'qty': '',
            })
        else:
            header_lines.append(line.strip())

    return {
        'title': '小皿料理',
        'subtitle': 'SMALL PLATE',
        'price_info': header_lines[0] if header_lines else '',
        'notes': header_lines[1:] if len(header_lines) > 1 else [],
        'dishes': dishes,
    }


def generate_css():
    css = """@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&family=Noto+Serif+JP:wght@400;700&display=swap');

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
    font-family: 'Noto Sans JP', sans-serif;
    background: #F5F5F0;
    color: #333;
    min-height: 100vh;
}

.page-header {
    position: sticky; top: 0; z-index: 100;
    background: rgba(255,255,255,0.97);
    backdrop-filter: blur(8px);
    border-bottom: 1px solid #e8e8e8;
    padding: 14px 20px;
    display: flex; align-items: center; gap: 16px;
}

.page-header .back-link {
    color: #666; text-decoration: none; font-size: 13px; white-space: nowrap;
}
.page-header .back-link:hover { color: #C62828; }

.page-header h1 {
    font-family: 'Noto Serif JP', serif;
    font-size: 20px; font-weight: 700; color: #333; letter-spacing: 0.05em;
}

.page-layout {
    display: flex; min-height: calc(100vh - 56px);
}

.side-nav {
    width: 200px; flex-shrink: 0; background: #fff;
    border-right: 1px solid #eee; padding: 16px 0;
    position: sticky; top: 56px; height: calc(100vh - 56px); overflow-y: auto;
}

.nav-link {
    display: flex; align-items: center; gap: 8px;
    padding: 12px 20px; text-decoration: none; color: #555;
    font-size: 13px; border-left: 3px solid transparent; transition: all 0.15s;
}
.nav-link:hover { background: #FFF8F0; color: #C62828; }
.nav-link.active { background: #FFF3E0; color: #C62828; border-left-color: #C62828; font-weight: 700; }

.nav-icon { font-size: 16px; }

.content-area { flex: 1; padding: 24px; }

.hero-banner {
    border-radius: 10px; padding: 32px; margin-bottom: 24px; color: #fff;
    position: relative; overflow: hidden;
}
.hero-banner-bg {
    position: absolute; inset: 0; background-size: cover; background-position: center;
    opacity: 0.3;
}
.hero-banner-content { position: relative; }
.hero-banner h2 {
    font-family: 'Noto Serif JP', serif;
    font-size: 28px; font-weight: 700; margin-bottom: 8px; letter-spacing: 0.08em;
}
.hero-banner .subtitle {
    font-size: 12px; letter-spacing: 0.2em; opacity: 0.8; margin-bottom: 12px;
}
.hero-banner .price-tag {
    font-size: 24px; font-weight: 700; color: #FFD700;
}
.hero-banner .note {
    font-size: 13px; margin-top: 8px; opacity: 0.85; line-height: 1.7;
}

.section-block { margin-bottom: 32px; }
.section-block h3 {
    font-size: 18px; font-weight: 700; margin-bottom: 6px; color: #333;
    border-left: 4px solid #C62828; padding-left: 12px;
}
.section-block .section-note {
    font-size: 13px; color: #888; margin-bottom: 16px; line-height: 1.6;
}

.dish-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
    gap: 16px;
}

.dish-card {
    background: #fff; border-radius: 10px; overflow: hidden;
    box-shadow: 0 1px 6px rgba(0,0,0,0.06);
    transition: transform 0.15s, box-shadow 0.15s; cursor: default;
}
.dish-card:hover { transform: translateY(-3px); box-shadow: 0 4px 16px rgba(0,0,0,0.10); }

.dish-img-wrap {
    width: 100%; aspect-ratio: 1/1; position: relative; overflow: hidden; background: #e0e0e0;
}
.dish-img-wrap img { width: 100%; height: 100%; object-fit: cover; display: block; }

.dish-placeholder {
    width: 100%; height: 100%;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    color: #fff; font-size: 13px; text-align: center; padding: 12px;
    line-height: 1.5; word-break: break-all;
}
.dish-placeholder .ph-icon { font-size: 32px; margin-bottom: 6px; opacity: 0.6; }

.dish-info { padding: 10px; }
.dish-name { font-size: 13px; font-weight: 700; color: #333; line-height: 1.4; margin-bottom: 3px; }
.dish-name-cn { display: block; font-size: 11px; font-weight: 400; color: #999; margin-top: 2px; }
.dish-price { font-size: 15px; font-weight: 700; color: #C62828; }
.dish-qty { font-size: 11px; color: #999; margin-left: 4px; font-weight: 400; }

.list-section { margin-bottom: 24px; }
.list-section h3 {
    font-size: 16px; font-weight: 700; margin-bottom: 12px; color: #333;
    border-left: 4px solid #C62828; padding-left: 12px;
}
.item-list {
    display: flex; flex-wrap: wrap; gap: 8px;
}
.item-chip {
    background: #fff; border: 1px solid #e0e0e0; border-radius: 20px;
    padding: 6px 16px; font-size: 13px; color: #555;
}

@media (max-width: 768px) {
    .page-layout { flex-direction: column; }
    .side-nav {
        width: 100%; height: auto; position: static;
        display: flex; overflow-x: auto; padding: 8px 12px; gap: 4px;
        border-right: none; border-bottom: 1px solid #eee;
    }
    .nav-link {
        padding: 8px 14px; border-left: none; border-bottom: 2px solid transparent;
        white-space: nowrap; font-size: 12px;
    }
    .nav-link.active { border-left: none; border-bottom-color: #C62828; }
    .content-area { padding: 16px; }
    .dish-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
    .hero-banner { padding: 24px; }
    .hero-banner h2 { font-size: 22px; }
}
"""
    (BUFFET_DIR / 'common.css').write_text(css, encoding='utf-8')
    print('Generated common.css')


def build_nav_html(active_id):
    links = []
    for p in PAGE_NAV:
        active = ' active' if p['id'] == active_id else ''
        links.append(
            f'            <a href="{p["id"]}.html" class="nav-link{active}">'
            f'<span class="nav-icon">{p["icon"]}</span>{p["name"]}</a>'
        )
    return '\n'.join(links)


def dish_card_html(dish, color, icon):
    img_path = f'../images/buffet/{dish["id"]}.jpg'
    cn = f'<span class="dish-name-cn">{dish["name_cn"]}</span>' if dish.get('name_cn') else ''
    qty = f'<span class="dish-qty">{dish["qty"]}</span>' if dish.get('qty') else ''
    price = f'<div class="dish-price">{dish["price"]}{qty}</div>' if dish.get('price') else ''
    return f"""        <div class="dish-card">
            <div class="dish-img-wrap">
                <img src="{img_path}" alt="{dish['name_jp']}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
                <div class="dish-placeholder" style="background:{color};display:none;">
                    <div class="ph-icon">{icon}</div>
                    {dish['name_jp']}
                </div>
            </div>
            <div class="dish-info">
                <div class="dish-name">{dish['name_jp']}{cn}</div>
                {price}
            </div>
        </div>"""


def build_all_you_can_eat_page(data):
    nav = build_nav_html('all-you-can-eat')
    notes_html = '<br>'.join(data['notes']) if data['notes'] else ''

    cards = '\n'.join(
        dish_card_html(d, '#B71C1C', '🍽️') for d in data['dishes']
    )

    html = f"""<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>食べ放題・飲み放題 - 一品居高幡不動店</title>
    <link rel="stylesheet" href="common.css">
</head>
<body>
    <div class="page-header">
        <a href="index.html" class="back-link">← セット・コース</a>
        <h1>食べ放題・飲み放題</h1>
    </div>
    <div class="page-layout">
        <nav class="side-nav">
{nav}
        </nav>
        <div class="content-area">
            <div class="hero-banner" style="background:#B71C1C;">
                <div class="hero-banner-bg" style="background-image:url('../images/buffet/all-you-can-eat-hero.jpg');"></div>
                <div class="hero-banner-content">
                    <h2>食べ放題・飲み放題</h2>
                    <div class="subtitle">ALL YOU CAN EAT & DRINK</div>
                    <div class="price-tag">{data['price_info']}</div>
                    <div class="note">{notes_html}</div>
                </div>
            </div>
            <div class="section-block">
                <h3>食べ放題メニュー（90品以上）</h3>
                <div class="dish-grid">
{cards}
                </div>
            </div>
        </div>
    </div>
</body>
</html>"""

    (BUFFET_DIR / 'all-you-can-eat.html').write_text(html, encoding='utf-8')
    print('Generated all-you-can-eat.html')


def build_course_page(data):
    nav = build_nav_html('course')
    notes_html = '<br>'.join(data['notes']) if data['notes'] else ''

    cards = '\n'.join(
        dish_card_html(d, '#880E4F', '🥘') for d in data['dishes']
    )

    html = f"""<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>逸品居お得コース - 一品居高幡不動店</title>
    <link rel="stylesheet" href="common.css">
</head>
<body>
    <div class="page-header">
        <a href="index.html" class="back-link">← セット・コース</a>
        <h1>逸品居お得コース</h1>
    </div>
    <div class="page-layout">
        <nav class="side-nav">
{nav}
        </nav>
        <div class="content-area">
            <div class="hero-banner" style="background:#880E4F;">
                <div class="hero-banner-bg" style="background-image:url('../images/buffet/course-hero.jpg');"></div>
                <div class="hero-banner-content">
                    <h2>逸品居お得コース</h2>
                    <div class="subtitle">IPPINKYO VALUE COURSE</div>
                    <div class="price-tag">{data['price_info']}</div>
                    <div class="note">{notes_html}</div>
                </div>
            </div>
            <div class="section-block">
                <h3>コース内容（8品）</h3>
                <div class="dish-grid">
{cards}
                </div>
            </div>
        </div>
    </div>
</body>
</html>"""

    (BUFFET_DIR / 'course.html').write_text(html, encoding='utf-8')
    print('Generated course.html')


def build_drink_set_page(sections):
    nav = build_nav_html('drink-set')
    header_info = '<br>'.join(sections['header']) if sections['header'] else ''

    drink_chips = ''
    if sections['drinks']:
        items = '　/　'.join(
            d['name_jp'] for d in sections['drinks']
        )
        drink_chips = f"""<div class="list-section">
                <h3>ドリンク選択</h3>
                <div class="item-list">
                    <span class="item-chip">生ビール(中)</span>
                    <span class="item-chip">各種サワー</span>
                    <span class="item-chip">各種酎ハイ</span>
                    <span class="item-chip">ハイボール</span>
                </div>
            </div>"""

    appetizer_cards = '\n'.join(
        dish_card_html(d, '#E65100', '🍻') for d in sections['appetizers']
    )

    main_cards = '\n'.join(
        dish_card_html(d, '#E65100', '🍻') for d in sections['main_dishes']
    )

    dimsum_chips = ''
    if sections['dimsum']:
        chips = '\n'.join(
            f'<span class="item-chip">{d["name_jp"]}</span>' for d in sections['dimsum']
        )
        dimsum_chips = f"""<div class="list-section">
                <h3>点心選択</h3>
                <div class="item-list">
                    {chips}
                </div>
            </div>"""
    else:
        dimsum_chips = """<div class="list-section">
                <h3>点心選択</h3>
                <div class="item-list">
                    <span class="item-chip">焼き餃子（5個）</span>
                    <span class="item-chip">小籠包（4個）</span>
                    <span class="item-chip">野菜春巻（2本）</span>
                </div>
            </div>"""

    html = f"""<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>お得な飲みセット - 一品居高幡不動店</title>
    <link rel="stylesheet" href="common.css">
</head>
<body>
    <div class="page-header">
        <a href="index.html" class="back-link">← セット・コース</a>
        <h1>お得な飲みセット</h1>
    </div>
    <div class="page-layout">
        <nav class="side-nav">
{nav}
        </nav>
        <div class="content-area">
            <div class="hero-banner" style="background:#E65100;">
                <div class="hero-banner-bg" style="background-image:url('../images/buffet/drink-set-hero.jpg');"></div>
                <div class="hero-banner-content">
                    <h2>お得な飲みセット</h2>
                    <div class="subtitle">VALUE DRINK SET</div>
                    <div class="note">{header_info}</div>
                </div>
            </div>

            {drink_chips}

            <div class="section-block">
                <h3>小菜（おつまみ）選択</h3>
                <div class="dish-grid">
{appetizer_cards}
                </div>
            </div>

            <div class="section-block">
                <h3>料理選択</h3>
                <div class="dish-grid">
{main_cards}
                </div>
            </div>

            {dimsum_chips}
        </div>
    </div>
</body>
</html>"""

    (BUFFET_DIR / 'drink-set.html').write_text(html, encoding='utf-8')
    print('Generated drink-set.html')


def build_set_meal_page(data):
    nav = build_nav_html('set-meal')
    notes_html = '<br>'.join(data['notes']) if data['notes'] else ''

    cards = '\n'.join(
        dish_card_html(d, '#00695C', '🍱') for d in data['dishes']
    )

    html = f"""<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>定食メニュー - 一品居高幡不動店</title>
    <link rel="stylesheet" href="common.css">
</head>
<body>
    <div class="page-header">
        <a href="index.html" class="back-link">← セット・コース</a>
        <h1>定食メニュー</h1>
    </div>
    <div class="page-layout">
        <nav class="side-nav">
{nav}
        </nav>
        <div class="content-area">
            <div class="hero-banner" style="background:#00695C;">
                <div class="hero-banner-bg" style="background-image:url('../images/buffet/set-meal-hero.jpg');"></div>
                <div class="hero-banner-content">
                    <h2>定食メニュー</h2>
                    <div class="subtitle">SET MEAL</div>
                    <div class="note">{data['price_info']}<br>{notes_html}</div>
                </div>
            </div>
            <div class="section-block">
                <h3>定食一覧</h3>
                <div class="dish-grid">
{cards}
                </div>
            </div>
        </div>
    </div>
</body>
</html>"""

    (BUFFET_DIR / 'set-meal.html').write_text(html, encoding='utf-8')
    print('Generated set-meal.html')


def build_small_plate_page(data):
    nav = build_nav_html('small-plate')

    cards = '\n'.join(
        dish_card_html(d, '#4527A0', '🥢') for d in data['dishes']
    )

    html = f"""<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>小皿料理 - 一品居高幡不動店</title>
    <link rel="stylesheet" href="common.css">
</head>
<body>
    <div class="page-header">
        <a href="index.html" class="back-link">← セット・コース</a>
        <h1>小皿料理</h1>
    </div>
    <div class="page-layout">
        <nav class="side-nav">
{nav}
        </nav>
        <div class="content-area">
            <div class="hero-banner" style="background:#4527A0;">
                <div class="hero-banner-bg" style="background-image:url('../images/buffet/small-plate-hero.jpg');"></div>
                <div class="hero-banner-content">
                    <h2>小皿料理</h2>
                    <div class="subtitle">SMALL PLATE</div>
                    <div class="note">{data['price_info']}</div>
                </div>
            </div>
            <div class="section-block">
                <h3>小皿料理一覧（20品）</h3>
                <div class="dish-grid">
{cards}
                </div>
            </div>
        </div>
    </div>
</body>
</html>"""

    (BUFFET_DIR / 'small-plate.html').write_text(html, encoding='utf-8')
    print('Generated small-plate.html')


def generate_buffet_index():
    cat_cards = []
    for p in PAGES:
        cat_cards.append(f"""        <a href="{p['id']}.html" class="cat-card">
            <div class="cat-card-img">
                <img src="../images/buffet/{p['id']}-hero.jpg" alt="{p['name']}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
                <div class="cat-card-ph" style="background:{p['color']};">
                    <div style="font-size:40px;margin-bottom:8px;">{p['icon']}</div>
                    <div>{p['name']}</div>
                </div>
            </div>
            <div class="cat-card-body">
                <div class="cat-card-name">{p['name']}</div>
            </div>
        </a>""")

    html = f"""<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>セット・コース - 一品居高幡不動店</title>
    <link rel="stylesheet" href="common.css">
    <style>
        .index-header {{
            text-align: center; padding: 40px 20px 30px;
            background: #fff; border-bottom: 1px solid #eee;
        }}
        .index-header h1 {{
            font-family: 'Noto Serif JP', serif;
            font-size: 28px; font-weight: 700; margin-bottom: 6px; letter-spacing: 0.08em;
        }}
        .index-header p {{ font-size: 13px; color: #999; letter-spacing: 0.15em; }}
        .cat-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
            gap: 20px; padding: 30px 24px; max-width: 900px; margin: 0 auto;
        }}
        .cat-card {{
            text-decoration: none; color: #333; background: #fff;
            border-radius: 10px; overflow: hidden;
            box-shadow: 0 1px 6px rgba(0,0,0,0.06);
            transition: transform 0.15s, box-shadow 0.15s;
        }}
        .cat-card:hover {{ transform: translateY(-4px); box-shadow: 0 6px 20px rgba(0,0,0,0.10); }}
        .cat-card-img {{ width: 100%; aspect-ratio: 4/3; position: relative; overflow: hidden; }}
        .cat-card-img img {{ width: 100%; height: 100%; object-fit: cover; }}
        .cat-card-ph {{
            width: 100%; height: 100%; display: flex; flex-direction: column;
            align-items: center; justify-content: center; color: #fff; font-size: 14px;
        }}
        .cat-card-body {{ padding: 14px; }}
        .cat-card-name {{ font-size: 15px; font-weight: 700; }}
        @media (max-width: 768px) {{
            .cat-grid {{ grid-template-columns: repeat(2, 1fr); gap: 12px; padding: 20px 16px; }}
            .index-header h1 {{ font-size: 22px; }}
        }}
    </style>
</head>
<body>
    <div class="page-header">
        <a href="../index.html" class="back-link">← トップ</a>
        <h1>セット・コース</h1>
    </div>
    <div class="index-header">
        <h1>セット・コース</h1>
        <p>SET & COURSE</p>
    </div>
    <div class="cat-grid">
{chr(10).join(cat_cards)}
    </div>
</body>
</html>"""

    (BUFFET_DIR / 'index.html').write_text(html, encoding='utf-8')
    print('Generated buffet/index.html')


def generate_placeholder_images(all_dishes):
    IMAGES_DIR.mkdir(parents=True, exist_ok=True)

    for dish_id, name_jp, name_cn, color, icon in all_dishes:
        w, h = 300, 300
        img = Image.new('RGB', (w, h), color)
        draw = ImageDraw.Draw(img)
        overlay = Image.new('RGBA', (w, h), (0, 0, 0, 0))
        draw2 = ImageDraw.Draw(overlay)
        draw2.rectangle([20, 20, w - 20, h - 20], outline=(255, 255, 255, 80), width=2)
        img = Image.alpha_composite(img.convert('RGBA'), overlay).convert('RGB')
        draw = ImageDraw.Draw(img)

        if len(name_jp) > 10:
            mid = len(name_jp) // 2
            for i in range(mid, len(name_jp)):
                if name_jp[i] in ('・', 'と', 'の', '、', '・'):
                    mid = i + 1
                    break
            draw.text((w // 2, h // 2 - 20), name_jp[:mid], fill='#fff', font=FONT_BODY, anchor='mm')
            draw.text((w // 2, h // 2 + 10), name_jp[mid:], fill='#fff', font=FONT_BODY, anchor='mm')
        else:
            draw.text((w // 2, h // 2 - 10), name_jp, fill='#fff', font=FONT_BODY, anchor='mm')

        if name_cn:
            cn = name_cn[:14] + '…' if len(name_cn) > 14 else name_cn
            draw.text((w // 2, h // 2 + 40), cn, fill='#ccc', font=FONT_SMALL, anchor='mm')

        path = IMAGES_DIR / f'{dish_id}.jpg'
        img.save(str(path), quality=85)


def main():
    BUFFET_DIR.mkdir(exist_ok=True)
    IMAGES_DIR.mkdir(parents=True, exist_ok=True)

    generate_css()

    all_dishes_for_img = []

    data1 = parse_all_you_can_eat()
    print(f"食べ放題・飲み放題: {len(data1['dishes'])} dishes")
    for d in data1['dishes']:
        all_dishes_for_img.append((d['id'], d['name_jp'], d.get('name_cn', ''), '#B71C1C', '🍽️'))
    build_all_you_can_eat_page(data1)

    data2 = parse_course()
    print(f"逸品居お得コース: {len(data2['dishes'])} dishes")
    for d in data2['dishes']:
        all_dishes_for_img.append((d['id'], d['name_jp'], d.get('name_cn', ''), '#880E4F', '🥘'))
    build_course_page(data2)

    data3 = parse_drink_set()
    appetizer_count = len(data3['appetizers'])
    main_count = len(data3['main_dishes'])
    print(f"お得な飲みセット: appetizers={appetizer_count}, mains={main_count}")
    for d in data3['appetizers']:
        all_dishes_for_img.append((d['id'], d['name_jp'], d.get('name_cn', ''), '#E65100', '🍻'))
    for d in data3['main_dishes']:
        all_dishes_for_img.append((d['id'], d['name_jp'], d.get('name_cn', ''), '#E65100', '🍻'))
    build_drink_set_page(data3)

    data4 = parse_set_meal()
    print(f"定食メニュー: {len(data4['dishes'])} dishes")
    for d in data4['dishes']:
        all_dishes_for_img.append((d['id'], d['name_jp'], d.get('name_cn', ''), '#00695C', '🍱'))
    build_set_meal_page(data4)

    data5 = parse_small_plate()
    print(f"小皿料理: {len(data5['dishes'])} dishes")
    for d in data5['dishes']:
        all_dishes_for_img.append((d['id'], d['name_jp'], d.get('name_cn', ''), '#4527A0', '🥢'))
    build_small_plate_page(data5)

    generate_buffet_index()

    print(f"\nGenerating {len(all_dishes_for_img)} placeholder images...")
    generate_placeholder_images(all_dishes_for_img)
    print('Done!')


if __name__ == '__main__':
    main()
