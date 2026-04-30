#!/usr/bin/env python3
"""
一品居 高幡不動店 - メニュー生成スクリプト
document/menu/ のデータから menu/ ページを生成する
"""

import os
import re
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

BASE = Path('/Users/bowei.qu/Desktop/projects/personal/ippinkyo')
DOC_MENU = BASE / 'document' / 'menu'
MENU_DIR = BASE / 'menu'
IMAGES_DIR = BASE / 'images'
DISHES_DIR = IMAGES_DIR / 'dishes'
MENU_IMG_DIR = IMAGES_DIR / 'menu'

CATEGORIES = [
    {'id': 'otsumami', 'name': 'おつまみ', 'file': 'おつまみ', 'color': '#6D4C41', 'icon': '🍻'},
    {'id': 'seafood', 'name': '一品料理 海鮮', 'file': '一品料理 海鮮', 'color': '#0277BD', 'icon': '🦐'},
    {'id': 'meat', 'name': '一品料理 肉類', 'file': '一品料理 肉類', 'color': '#C62828', 'icon': '🥩'},
    {'id': 'vegetable', 'name': '一品料理 野菜', 'file': '一品料理 野菜', 'color': '#2E7D32', 'icon': '🥬'},
    {'id': 'rice', 'name': 'ご飯類', 'file': 'ご飯類', 'color': '#E65100', 'icon': '🍚'},
    {'id': 'noodle', 'name': '麺類', 'file': ' 麺類', 'color': '#F9A825', 'icon': '🍜'},
    {'id': 'authentic-chinese', 'name': '本格中華料理', 'file': '本格中華料理', 'color': '#AD1457', 'icon': '🇨🇳'},
    {'id': 'authentic-sichuan', 'name': '本格四川料理', 'file': '本格四川料理', 'color': '#B71C1C', 'icon': '🌶️'},
    {'id': 'claypot', 'name': '土鍋料理', 'file': '土鍋料理', 'color': '#4E342E', 'icon': '🍲'},
    {'id': 'drypot-teppan', 'name': '干鍋・鉄板料理', 'file': '干鍋・鉄板料理', 'color': '#BF360C', 'icon': '🍳'},
    {'id': 'dimsum-dessert', 'name': '点心・デザート', 'file': '点心・デザート', 'color': '#FF6F00', 'icon': '🥟'},
    {'id': 'specialty', 'name': '特色料理', 'file': '特色料理', 'color': '#880E4F', 'icon': '⭐'},
    {'id': 'noodle-rice-set', 'name': '麺飯セット', 'file': '麺飯セット', 'color': '#00695C', 'icon': '🍱'},
    {'id': 'friedrice-set', 'name': '炒飯・焼きそば定食', 'file': '炒飯・焼きそば定食', 'color': '#795548', 'icon': '🍛'},
]


def parse_dish_name(raw):
    jp = raw.strip()
    cn = ''
    m = re.search(r'[（(](.+?)[）)]', jp)
    if m:
        cn = m.group(1)
        jp = jp[:m.start()].strip()
    return jp, cn


def parse_menu_file(filepath, cat_id):
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    dishes = []
    header_lines = []

    for line in lines:
        line = line.rstrip('\n')
        if not line.strip():
            continue
        if '---' in line:
            continue
        if not line.startswith('|'):
            header_lines.append(line.strip())
            continue

        cells = [c.strip() for c in line.split('|')[1:-1]]
        if not cells:
            continue

        first = cells[0]
        if first in ('菜品', '菜品 ', '') and len(cells) >= 2:
            continue
        if '划掉' in line:
            continue

        jp_name, cn_name = parse_dish_name(first)
        if not jp_name or '不明' in jp_name:
            continue

        price = ''
        qty = ''
        for cell in cells[1:]:
            cell = cell.strip()
            if '円' in cell:
                price = cell
                break
            elif '不明' in cell:
                break

        if len(cells) >= 3:
            for cell in cells[1:-1]:
                cell = cell.strip()
                if cell and '円' not in cell and '划掉' not in cell and '不明' not in cell:
                    qty = cell
                    break

        dish_id = cat_id + '-' + str(len(dishes))
        dishes.append({
            'id': dish_id,
            'name_jp': jp_name,
            'name_cn': cn_name,
            'price': price,
            'qty': qty,
        })

    return dishes, header_lines


def parse_noodle_rice_set(filepath, cat_id):
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    header_lines = []
    dishes = []

    for line in lines:
        line = line.strip()
        if not line or '---' in line or line.startswith('|'):
            continue
        if '価格' in line or '价格' in line or '税込' in line or '含渍物' in line:
            header_lines.append(line)
            continue
        if line.endswith('：') or line.endswith(':'):
            header_lines.append(line)
            continue

        jp_name, cn_name = parse_dish_name(line)
        if not jp_name:
            continue

        dish_id = cat_id + '-' + str(len(dishes))
        dishes.append({
            'id': dish_id,
            'name_jp': jp_name,
            'name_cn': cn_name,
            'price': '',
            'qty': '',
        })

    return dishes, header_lines


def generate_css():
    css = """@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&family=Noto+Serif+JP:wght@400;700&display=swap');

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
    font-family: 'Noto Sans JP', sans-serif;
    background: #F5F5F0;
    color: #333;
    min-height: 100vh;
}

.menu-header {
    position: sticky; top: 0; z-index: 100;
    background: rgba(255,255,255,0.97);
    backdrop-filter: blur(8px);
    border-bottom: 1px solid #e8e8e8;
    padding: 14px 20px;
    display: flex; align-items: center; gap: 16px;
}

.menu-header .back-link {
    color: #666; text-decoration: none; font-size: 13px; white-space: nowrap;
}
.menu-header .back-link:hover { color: #C62828; }

.menu-header h1 {
    font-family: 'Noto Serif JP', serif;
    font-size: 20px; font-weight: 700; color: #333; letter-spacing: 0.05em;
}

.menu-layout {
    display: flex; min-height: calc(100vh - 56px);
}

.category-nav {
    width: 200px; flex-shrink: 0; background: #fff;
    border-right: 1px solid #eee; padding: 16px 0;
    position: sticky; top: 56px; height: calc(100vh - 56px); overflow-y: auto;
}

.category-link {
    display: flex; align-items: center; gap: 8px;
    padding: 12px 20px; text-decoration: none; color: #555;
    font-size: 13px; border-left: 3px solid transparent; transition: all 0.15s;
}
.category-link:hover { background: #FFF8F0; color: #C62828; }
.category-link.active { background: #FFF3E0; color: #C62828; border-left-color: #C62828; font-weight: 700; }

.category-icon { font-size: 16px; }

.dish-area { flex: 1; padding: 24px; }

.category-header { margin-bottom: 24px; }
.category-header h2 {
    font-family: 'Noto Serif JP', serif;
    font-size: 24px; font-weight: 700; margin-bottom: 6px;
}
.category-header .cat-note { font-size: 13px; color: #888; line-height: 1.6; }

.dish-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 18px;
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
.dish-placeholder .dish-ph-icon { font-size: 32px; margin-bottom: 6px; opacity: 0.6; }

.dish-info { padding: 12px; }
.dish-name { font-size: 13px; font-weight: 700; color: #333; line-height: 1.4; margin-bottom: 4px; }
.dish-name-cn { display: block; font-size: 11px; font-weight: 400; color: #999; margin-top: 2px; }
.dish-price { font-size: 16px; font-weight: 700; color: #C62828; }
.dish-qty { font-size: 11px; color: #999; margin-left: 4px; font-weight: 400; }

@media (max-width: 768px) {
    .menu-layout { flex-direction: column; }
    .category-nav {
        width: 100%; height: auto; position: static;
        display: flex; overflow-x: auto; padding: 8px 12px; gap: 4px;
        border-right: none; border-bottom: 1px solid #eee;
        -webkit-overflow-scrolling: touch;
    }
    .category-link {
        padding: 8px 14px; border-left: none; border-bottom: 2px solid transparent;
        white-space: nowrap; font-size: 12px;
    }
    .category-link.active { border-left: none; border-bottom-color: #C62828; }
    .dish-area { padding: 16px; }
    .dish-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
    .category-header h2 { font-size: 20px; }
}

@media (max-width: 480px) {
    .dish-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
    .dish-name { font-size: 12px; }
    .dish-price { font-size: 14px; }
    .dish-info { padding: 10px; }
}
"""
    (MENU_DIR / 'common.css').write_text(css, encoding='utf-8')
    print('Generated common.css')


def generate_category_image(cat):
    w, h = 400, 300
    img = Image.new('RGB', (w, h), cat['color'])
    draw = ImageDraw.Draw(img)
    try:
        font = ImageFont.truetype('/System/Library/Fonts/ヒラギノ角ゴシック W4.ttc', 28)
        font_small = ImageFont.truetype('/System/Library/Fonts/ヒラギノ角ゴシック W3.ttc', 16)
    except Exception:
        font = ImageFont.load_default()
        font_small = font

    draw.text((w // 2, h // 2 - 30), cat['icon'], fill='#ffffff', font=font, anchor='mm')
    bbox = draw.textbbox((0, 0), cat['name'], font=font_small)
    tw = bbox[2] - bbox[0]
    draw.text(((w - tw) // 2, h // 2 + 20), cat['name'], fill='#ffffff', font=font_small)

    path = MENU_IMG_DIR / f'{cat["id"]}.jpg'
    img.save(str(path), quality=90)


def generate_dish_placeholder(dish, cat):
    w, h = 300, 300
    img = Image.new('RGB', (w, h), cat['color'])
    draw = ImageDraw.Draw(img)
    try:
        font = ImageFont.truetype('/System/Library/Fonts/ヒラギノ角ゴシック W4.ttc', 22)
        font_cn = ImageFont.truetype('/System/Library/Fonts/ヒラギノ角ゴシック W3.ttc', 16)
    except Exception:
        font = ImageFont.load_default()
        font_cn = font

    overlay = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    draw2 = ImageDraw.Draw(overlay)
    draw2.rectangle([20, 20, w - 20, h - 20], outline=(255, 255, 255, 80), width=2)
    img = Image.alpha_composite(img.convert('RGBA'), overlay).convert('RGB')
    draw = ImageDraw.Draw(img)

    name = dish['name_jp']
    if len(name) > 10:
        mid = len(name) // 2
        for i in range(mid, len(name)):
            if name[i] in ('・', 'と', 'の', '、', '・'):
                mid = i + 1
                break
        line1 = name[:mid]
        line2 = name[mid:]
        draw.text((w // 2, h // 2 - 20), line1, fill='#ffffff', font=font, anchor='mm')
        draw.text((w // 2, h // 2 + 10), line2, fill='#ffffff', font=font, anchor='mm')
    else:
        draw.text((w // 2, h // 2 - 10), name, fill='#ffffff', font=font, anchor='mm')

    if dish['name_cn']:
        cn = dish['name_cn']
        if len(cn) > 14:
            cn = cn[:14] + '…'
        draw.text((w // 2, h // 2 + 40), cn, fill='#cccccc', font=font_cn, anchor='mm')

    path = DISHES_DIR / f'{dish["id"]}.jpg'
    img.save(str(path), quality=85)


def build_category_page(cat, dishes, header_lines):
    cat_note = ''
    if header_lines:
        clean = []
        for h in header_lines:
            h = re.sub(r'[（(]划掉[）)]', '', h).strip()
            if h:
                clean.append(h)
        cat_note = '<br>'.join(clean)

    dish_cards = []
    for d in dishes:
        img_path = f'../images/dishes/{d["id"]}.jpg'
        cn_html = f'<span class="dish-name-cn">{d["name_cn"]}</span>' if d['name_cn'] else ''
        qty_html = f'<span class="dish-qty">{d["qty"]}</span>' if d.get('qty') else ''
        price_html = f'<div class="dish-price">{d["price"]}{qty_html}</div>' if d['price'] else ''

        dish_cards.append(f"""        <div class="dish-card">
            <div class="dish-img-wrap">
                <img src="{img_path}" alt="{d['name_jp']}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
                <div class="dish-placeholder" style="background:{cat['color']};display:none;">
                    <div class="dish-ph-icon">{cat['icon']}</div>
                    {d['name_jp']}
                </div>
            </div>
            <div class="dish-info">
                <div class="dish-name">{d['name_jp']}{cn_html}</div>
                {price_html}
            </div>
        </div>""")

    nav_links = []
    for c in CATEGORIES:
        active = ' active' if c['id'] == cat['id'] else ''
        nav_links.append(
            f'            <a href="{c["id"]}.html" data-id="{c["id"]}" class="category-link{active}">'
            f'<span class="category-icon">{c["icon"]}</span>{c["name"]}</a>'
        )

    note_html = f'<div class="cat-note">{cat_note}</div>' if cat_note else ''

    html = f"""<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{cat['name']} - 一品居 高幡不動店</title>
    <link rel="stylesheet" href="common.css">
</head>
<body>
    <div class="menu-header">
        <a href="index.html" class="back-link">← メニュー</a>
        <h1>{cat['name']}</h1>
    </div>
    <div class="menu-layout">
        <nav class="category-nav">
{chr(10).join(nav_links)}
        </nav>
        <div class="dish-area">
            <div class="category-header">
                <h2>{cat['name']}</h2>
                {note_html}
            </div>
            <div class="dish-grid">
{chr(10).join(dish_cards)}
            </div>
        </div>
    </div>
</body>
</html>"""

    (MENU_DIR / f'{cat["id"]}.html').write_text(html, encoding='utf-8')


def generate_menu_index():
    cat_cards = []
    for c in CATEGORIES:
        cat_cards.append(f"""        <a href="{c['id']}.html" class="cat-card">
            <div class="cat-card-img">
                <img src="../images/menu/{c['id']}.jpg" alt="{c['name']}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
                <div class="cat-card-ph" style="background:{c['color']};">
                    <div style="font-size:40px;margin-bottom:8px;">{c['icon']}</div>
                    <div>{c['name']}</div>
                </div>
            </div>
            <div class="cat-card-body">
                <div class="cat-card-name">{c['name']}</div>
            </div>
        </a>""")

    html = f"""<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>メニュー - 一品居 高幡不動店</title>
    <link rel="stylesheet" href="common.css">
    <style>
        .menu-index-header {{
            text-align: center; padding: 40px 20px 30px;
            background: #fff; border-bottom: 1px solid #eee;
        }}
        .menu-index-header h1 {{
            font-family: 'Noto Serif JP', serif;
            font-size: 28px; font-weight: 700; margin-bottom: 6px; letter-spacing: 0.08em;
        }}
        .menu-index-header p {{ font-size: 13px; color: #999; letter-spacing: 0.15em; }}
        .cat-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 20px; padding: 30px 24px; max-width: 1000px; margin: 0 auto;
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
            .menu-index-header h1 {{ font-size: 22px; }}
        }}
    </style>
</head>
<body>
    <div class="menu-header">
        <a href="../index.html" class="back-link">← トップ</a>
        <h1>メニュー</h1>
    </div>
    <div class="menu-index-header">
        <h1>一品居 メニュー</h1>
        <p>IPPNKYO MENU</p>
    </div>
    <div class="cat-grid">
{chr(10).join(cat_cards)}
    </div>
</body>
</html>"""

    (MENU_DIR / 'index.html').write_text(html, encoding='utf-8')
    print('Generated menu/index.html')


def main():
    for d in [MENU_DIR, DISHES_DIR, MENU_IMG_DIR]:
        d.mkdir(parents=True, exist_ok=True)

    generate_css()
    generate_menu_index()

    for cat in CATEGORIES:
        filepath = DOC_MENU / cat['file']
        if not filepath.exists():
            print(f'  SKIP (file not found): {cat["file"]}')
            continue

        if cat['id'] == 'noodle-rice-set':
            dishes, header_lines = parse_noodle_rice_set(filepath, cat['id'])
        else:
            dishes, header_lines = parse_menu_file(filepath, cat['id'])
        print(f'  {cat["name"]}: {len(dishes)} dishes')

        generate_category_image(cat)
        for d in dishes:
            generate_dish_placeholder(d, cat)

        build_category_page(cat, dishes, header_lines)
        print(f'  Generated {cat["id"]}.html')

    print('\nDone!')


if __name__ == '__main__':
    main()
