#!/usr/bin/env python3
"""
逸品居 高幡不動店 - メニュー画像ダウンロードスクリプト
Bing Image Searchから菜品画像を取得する
"""

import os
import re
import sys
import time
import json
import urllib.parse
import urllib.request
import ssl
from pathlib import Path

BASE = Path('/Users/bowei.qu/Desktop/projects/personal/ippinkyo')
DISHES_DIR = BASE / 'images' / 'dishes'
MENU_DIR = BASE / 'images' / 'menu'

DISH_MAP = {
    'otsumami-0': 'ポテトフライ 料理',
    'otsumami-1': '川エビの揚げ 料理',
    'otsumami-2': '中華ソーセージ 料理',
    'otsumami-3': 'エビフライ 料理',
    'otsumami-5': 'キュウリクラゲ和え物 中華',
    'otsumami-6': '豆腐サラダ 中華',
    'otsumami-7': 'ジャコ大根サラダ',
    'otsumami-8': 'キクラゲ特製ソース 和え物',
    'otsumami-9': '豆苗和え物',
    'otsumami-10': '鶏軟骨唐揚げ',
    'otsumami-11': '手羽先揚げ',
    'otsumami-12': 'イカゲソ唐揚げ',
    'seafood-0': 'エビチリ 中華料理',
    'seafood-1': 'エビマヨネーズ 中華',
    'seafood-2': 'アサリ辛味炒め',
    'seafood-3': 'カキ黒胡椒炒め',
    'seafood-4': 'エビ玉子チリソース',
    'seafood-5': '海鮮煮込み 中華',
    'seafood-6': '海鮮おこげ',
    'seafood-7': '五目おこげ',
    'seafood-9': 'エビ青梗菜炒め',
    'meat-0': '麻婆豆腐 石鍋',
    'meat-1': '揚げナス山椒炒め',
    'meat-2': '鶏肉カシューナッツ炒め',
    'meat-3': 'ニラレバ 中華',
    'meat-4': '回鍋肉',
    'meat-5': '八宝菜',
    'meat-6': '麻婆茄子',
    'meat-7': '豚ホルモン炒め 中華',
    'meat-8': '青椒肉絲',
    'meat-9': '鶏肉味噌炒め 中華',
    'meat-10': '若鶏唐揚げ',
    'meat-11': '酢豚 中華',
    'meat-12': '豚トロ黒胡椒炒め',
    'meat-13': '油淋鶏',
    'meat-14': '中華焼肉特製ソース',
    'meat-15': '牛肉ニンニクの芽炒め',
    'meat-16': '豚肉ニンニクの芽炒め',
    'meat-17': '豚生姜焼き 中華',
    'vegetable-0': '五目野菜炒め 中華',
    'vegetable-1': '青梗菜ニンニク炒め',
    'vegetable-2': '酸辣土豆絲',
    'vegetable-3': '豆苗炒め',
    'vegetable-4': 'トマト玉子炒め 中華',
    'vegetable-5': 'ほうれん草ニンニク炒め',
    'vegetable-7': '木須肉',
    'vegetable-8': 'ニラ玉子炒め',
    'vegetable-9': 'エビ玉子キクラゲ炒め',
    'rice-0': '牛肉黒胡椒炒飯',
    'rice-1': '玉子叉焼飯',
    'rice-2': 'エビ炒飯',
    'rice-3': 'カニあんかけ炒飯',
    'rice-4': 'エビチリあんかけ炒飯',
    'rice-5': 'チャーシューレタスチャーハン',
    'rice-6': '海鮮レタスチャーハン',
    'rice-7': '豚バラ青菜炒飯',
    'rice-8': '五目チャーハン',
    'rice-9': '半チャーハン',
    'rice-12': '高菜チャーハン',
    'rice-13': 'キムチチャーハン',
    'noodle-0': '広東麺',
    'noodle-1': '四川担担麺',
    'noodle-2': '海鮮タンメン',
    'noodle-3': '野菜タンメン',
    'noodle-4': '台湾ラーメン',
    'noodle-5': '麻辣牛肉麺',
    'noodle-6': '酸辣湯麺',
    'noodle-7': '麻婆麺',
    'noodle-8': '五目あんかけ焼きそば',
    'noodle-9': '海鮮あんかけ焼きそば',
    'noodle-10': 'ソース焼きそば 上海',
    'noodle-11': '海鮮焼きそば',
    'noodle-12': '焼きうどん 中華',
    'authentic-chinese-0': '红油牛肚',
    'authentic-chinese-1': '特色干豆腐和え物',
    'authentic-chinese-2': '醤牛肉',
    'authentic-chinese-3': '砂肝ラー油和え',
    'authentic-chinese-4': '地三鲜',
    'authentic-chinese-5': '尖椒干豆腐',
    'authentic-chinese-6': '麻辣牛腩',
    'authentic-sichuan-0': '口水鸡 よだれ鶏',
    'authentic-sichuan-1': '夫妻肺片',
    'authentic-sichuan-2': '麻辣肉片',
    'authentic-sichuan-3': '鶏軟骨香辣炒め',
    'authentic-sichuan-4': '辣子鸡',
    'authentic-sichuan-5': '水煮牛肉',
    'authentic-sichuan-6': '水煮肉片',
    'authentic-sichuan-7': '魚香肉絲',
    'authentic-sichuan-8': '辣炒牛肚',
    'authentic-sichuan-9': '水煮魚',
    'authentic-sichuan-10': '酸菜魚',
    'claypot-0': '紅焼肉土鍋',
    'claypot-1': '酸菜五花肉土鍋',
    'claypot-2': '牛腩西紅柿土鍋',
    'claypot-4': '小鶏炖粉条土鍋',
    'drypot-teppan-0': '干鍋肥腸',
    'drypot-teppan-1': '干鍋麻辣蝦',
    'drypot-teppan-3': '干鍋土豆片',
    'drypot-teppan-4': '麻辣香鍋',
    'drypot-teppan-5': '牛肉鉄板焼き 黒胡椒',
    'drypot-teppan-6': 'ラム肉鉄板焼き',
    'drypot-teppan-8': 'イカゲソ鉄板焼き',
    'dimsum-dessert-0': '焼き餃子',
    'dimsum-dessert-2': '桃まんじゅう',
    'dimsum-dessert-3': '小籠包',
    'dimsum-dessert-4': 'エビ餃子',
    'dimsum-dessert-5': 'シューマイ',
    'dimsum-dessert-6': '点心盛り合わせ',
    'dimsum-dessert-7': '葱油餅',
    'dimsum-dessert-8': 'ゴマ団子',
    'dimsum-dessert-9': '野菜春巻き',
    'dimsum-dessert-10': 'ワンタン',
    'dimsum-dessert-11': '杏仁豆腐',
    'dimsum-dessert-12': 'バニラアイス',
    'specialty-0': '肥腸鶏',
    'noodle-rice-set-0': '醤油ラーメン',
    'noodle-rice-set-1': '四川担担麺',
    'noodle-rice-set-2': '野菜タンメン',
    'noodle-rice-set-3': '台湾ラーメン',
    'noodle-rice-set-4': '高菜炒飯',
    'noodle-rice-set-5': '五目炒飯',
    'noodle-rice-set-6': '青椒肉絲丼',
    'noodle-rice-set-7': '中華丼',
    'noodle-rice-set-8': '中華焼肉丼',
    'noodle-rice-set-9': '麻婆丼',
    'friedrice-set-0': '豚バラ青菜炒飯定食',
    'friedrice-set-1': '五目あんかけ焼きそば定食',
    'friedrice-set-2': '高菜炒飯定食',
    'friedrice-set-3': '上海焼きそば定食',
}

CATEGORY_SEARCH = {
    'otsumami': '中華おつまみ 料理',
    'seafood': '中華海鮮料理',
    'meat': '中華肉料理',
    'vegetable': '中華野菜料理',
    'rice': '中華炒飯',
    'noodle': '中華麺類',
    'authentic-chinese': '本格中華料理',
    'authentic-sichuan': '四川料理',
    'claypot': '土鍋料理 中華',
    'drypot-teppan': '干鍋 鉄板料理 中華',
    'dimsum-dessert': '中華点心 デザート',
    'specialty': '中華特色料理',
    'noodle-rice-set': '中華麺飯セット',
    'friedrice-set': '炒飯定食 中華',
}

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE


def search_bing_images(query, count=5):
    url = f'https://www.bing.com/images/search?q={urllib.parse.quote(query)}&first=1&count={count}'
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    }
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=10, context=ctx) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
    except Exception as e:
        print(f'  Search error: {e}')
        return []

    murls = re.findall(r'murl&quot;:&quot;(https?://[^&]+)', html)
    return murls[:count]


def download_image(url, save_path, timeout=15):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    }
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=timeout, context=ctx) as resp:
            data = resp.read()
        if len(data) < 2000:
            return False
        content_type = resp.headers.get('Content-Type', '')
        if 'image' not in content_type and not url.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
            return False
        with open(save_path, 'wb') as f:
            f.write(data)
        return True
    except Exception as e:
        print(f'  Download error: {e}')
        return False


def main():
    DISHES_DIR.mkdir(parents=True, exist_ok=True)
    MENU_DIR.mkdir(parents=True, exist_ok=True)

    total = len(DISH_MAP)
    success = 0
    failed = []

    for i, (dish_id, query) in enumerate(DISH_MAP.items()):
        save_path = DISHES_DIR / f'{dish_id}.jpg'
        if save_path.exists():
            existing_size = save_path.stat().st_size
            if existing_size > 5000:
                print(f'  [{i+1}/{total}] SKIP (exists): {dish_id}')
                success += 1
                continue

        print(f'[{i+1}/{total}] {dish_id}: {query}')
        urls = search_bing_images(query, count=5)

        downloaded = False
        for j, img_url in enumerate(urls):
            img_url = img_url.replace('&amp;', '&')
            print(f'  Try {j+1}: {img_url[:80]}...')
            if download_image(img_url, str(save_path)):
                size = save_path.stat().st_size
                if size > 3000:
                    print(f'  OK ({size} bytes)')
                    downloaded = True
                    success += 1
                    break
                else:
                    save_path.unlink(missing_ok=True)

        if not downloaded:
            print(f'  FAILED')
            failed.append(dish_id)

        time.sleep(0.5)

    # Category images
    print(f'\n--- Category images ---')
    for cat_id, query in CATEGORY_SEARCH.items():
        save_path = MENU_DIR / f'{cat_id}.jpg'
        if save_path.exists() and save_path.stat().st_size > 5000:
            print(f'  SKIP: {cat_id}')
            continue
        print(f'{cat_id}: {query}')
        urls = search_bing_images(query, count=5)
        for j, img_url in enumerate(urls):
            img_url = img_url.replace('&amp;', '&')
            if download_image(img_url, str(save_path)):
                if save_path.stat().st_size > 3000:
                    print(f'  OK')
                    break
                save_path.unlink(missing_ok=True)
        time.sleep(0.5)

    print(f'\nDone! Success: {success}/{total}, Failed: {len(failed)}')
    if failed:
        print(f'Failed IDs: {failed}')


if __name__ == '__main__':
    main()
