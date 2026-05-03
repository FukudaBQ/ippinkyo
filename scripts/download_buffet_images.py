#!/usr/bin/env python3
"""
逸品居 高幡不動店 - セット・コース画像ダウンロードスクリプト
"""

import re
import time
import urllib.parse
import urllib.request
import ssl
from pathlib import Path

BASE = Path('/Users/bowei.qu/Desktop/projects/personal/ippinkyo')
IMAGES_DIR = BASE / 'public' / 'images' / 'buffet'

DISH_MAP = {
    'all-you-can-eat-0': '小籠包',
    'all-you-can-eat-1': 'ゴマ団子',
    'all-you-can-eat-2': 'エビ餃子',
    'all-you-can-eat-3': '春巻き 中華',
    'all-you-can-eat-4': '水餃子',
    'all-you-can-eat-5': '焼き餃子',
    'all-you-can-eat-6': '杏仁豆腐',
    'all-you-can-eat-7': 'アイスクリーム',
    'all-you-can-eat-8': 'レタスチャーハン',
    'all-you-can-eat-9': '叉焼チャーハン',
    'all-you-can-eat-10': '豚バラチャーハン',
    'all-you-can-eat-11': '海鮮チャーハン',
    'all-you-can-eat-12': '台湾ラーメン',
    'all-you-can-eat-13': '野菜タンメン',
    'all-you-can-eat-14': '五目あんかけ焼きそば',
    'all-you-can-eat-15': '上海焼きそば',
    'all-you-can-eat-16': 'ニラレバ',
    'all-you-can-eat-17': '回鍋肉',
    'all-you-can-eat-18': '肉野菜炒め 中華',
    'all-you-can-eat-19': '麻婆豆腐',
    'all-you-can-eat-20': 'トマト玉子炒め',
    'all-you-can-eat-21': 'ニラ玉子炒め',
    'all-you-can-eat-22': '酢豚',
    'all-you-can-eat-23': '鶏肉カシューナッツ炒め',
    'all-you-can-eat-24': '鶏唐揚げ',
    'all-you-can-eat-25': '牛肉ニンニクの芽炒め',
    'all-you-can-eat-26': 'エビチリ',
    'all-you-can-eat-27': 'エビマヨネーズ',
    'all-you-can-eat-28': '八宝菜',
    'all-you-can-eat-29': '青椒肉絲',
    'all-you-can-eat-30': '中華焼肉特製ソース炒め',
    'all-you-can-eat-31': 'エビ青梗菜炒め',
    'all-you-can-eat-32': '五目野菜炒め 中華',
    'all-you-can-eat-33': '豆苗炒め',
    'all-you-can-eat-34': 'キクラゲ玉子豚肉炒め',
    'all-you-can-eat-35': '麻婆茄子',
    'all-you-can-eat-36': '豚生姜焼き',
    'all-you-can-eat-37': 'ニラレバ',
    'all-you-can-eat-38': '青梗菜ニンニク炒め',
    'all-you-can-eat-39': '鶏肉黒胡椒炒め',
    'all-you-can-eat-40': '酸辣湯麺',
    'all-you-can-eat-41': '醤油ラーメン',
    'all-you-can-eat-42': '四川担担麺',
    'all-you-can-eat-43': '麻辣牛バラ麺',
    'all-you-can-eat-44': '麻婆麺',
    'all-you-can-eat-45': 'ソース焼きそば',
    'all-you-can-eat-46': '海鮮焼きそば',
    'all-you-can-eat-47': '焼きうどん',
    'all-you-can-eat-48': '五目あんかけ焼きそば',
    'all-you-can-eat-49': '海鮮あんかけ焼きそば',
    'course-0': '前菜盛り合わせ 中華',
    'course-1': 'エビチリ',
    'course-2': 'ほうれん草炒め',
    'course-3': '麻婆豆腐',
    'course-4': '青椒肉絲',
    'course-5': '魚料理 中華',
    'course-6': '鶏唐揚げ',
    'course-7': '炒飯 中華',
    'drink-set-appetizers-0': 'よだれ鶏',
    'drink-set-appetizers-1': 'ピータン豆腐',
    'drink-set-appetizers-2': '合鴨 料理',
    'drink-set-appetizers-3': '冷トマト 料理',
    'drink-set-appetizers-4': '味付け玉子',
    'drink-set-appetizers-5': '砂肝和え物',
    'drink-set-appetizers-6': 'キムチ',
    'drink-set-appetizers-7': 'ザーサイ',
    'drink-set-appetizers-8': 'ピータン',
    'drink-set-appetizers-9': '棒棒鶏',
    'drink-set-appetizers-10': 'ネギチャーシュー',
    'drink-set-appetizers-11': 'しらすかけ豆腐',
    'drink-set-appetizers-12': '枝豆',
    'drink-set-appetizers-13': '豚バラニンニクソース',
    'drink-set-appetizers-14': 'メンマ',
    'drink-set-main_dishes-0': '青椒肉絲',
    'drink-set-main_dishes-1': 'ニラレバ',
    'drink-set-main_dishes-2': '酢豚',
    'drink-set-main_dishes-3': '鶏肉カシューナッツ炒め',
    'drink-set-main_dishes-4': '回鍋肉',
    'drink-set-main_dishes-5': '豚トロ黒胡椒炒め',
    'drink-set-main_dishes-6': 'キクラゲ豚肉玉子炒め',
    'drink-set-main_dishes-7': '麻婆豆腐',
    'drink-set-main_dishes-8': 'ニンニクの芽豚肉炒め',
    'drink-set-main_dishes-9': '野菜炒め 中華',
    'drink-set-main_dishes-10': '鶏唐揚げ',
    'drink-set-main_dishes-11': 'ニラ玉子炒め',
    'drink-set-main_dishes-12': '八宝菜',
    'drink-set-main_dishes-13': 'エビチリ',
    'drink-set-main_dishes-14': '豚生姜焼き',
    'set-meal-0': '鶏唐揚げ定食',
    'set-meal-1': '豚生姜焼き定食',
    'set-meal-2': 'エビ玉子炒め定食',
    'set-meal-3': '野菜炒め定食',
    'set-meal-4': '中華焼肉炒め定食',
    'set-meal-5': '酢豚定食',
    'set-meal-6': 'ニラレバ定食',
    'set-meal-7': '回鍋肉定食',
    'set-meal-8': '豚トロ黒胡椒炒め定食',
    'set-meal-9': '四川風レバー定食',
    'set-meal-10': '鶏肉カシューナッツ炒め定食',
    'set-meal-11': 'エビチリ定食',
    'set-meal-12': 'キクラゲ豚肉玉子炒め定食',
    'set-meal-13': '麻婆茄子定食',
    'set-meal-14': '牛肉青菜炒め定食',
    'set-meal-15': '麻婆豆腐定食',
    'set-meal-16': '青椒肉絲定食',
    'set-meal-17': '豚バラ青菜炒飯定食',
    'set-meal-18': '鶏肉黒胡椒炒め定食',
    'set-meal-19': '豚肉ニンニクの芽炒め定食',
    'set-meal-20': 'エビチリ玉子炒め定食',
    'small-plate-0': '青椒肉絲',
    'small-plate-1': '中華焼肉特製ソース炒め',
    'small-plate-2': 'エビ青梗菜炒め',
    'small-plate-3': '五目野菜炒め 中華',
    'small-plate-4': 'エビチリソース',
    'small-plate-5': 'エビマヨネーズ',
    'small-plate-6': '豆苗炒め',
    'small-plate-7': 'キクラゲ豚肉玉子炒め',
    'small-plate-8': '鶏肉カシューナッツ炒め',
    'small-plate-9': '酢豚',
    'small-plate-10': '麻婆茄子',
    'small-plate-11': '回鍋肉',
    'small-plate-12': '鶏唐揚げ',
    'small-plate-13': '豚生姜焼き',
    'small-plate-14': 'ニラ玉子炒め',
    'small-plate-15': 'エビ玉子キクラゲ炒め',
    'small-plate-16': '八宝菜',
    'small-plate-17': '豚肉ニンニクの芽炒め',
    'small-plate-18': 'ニラレバ',
    'small-plate-19': '青梗菜ニンニク炒め',
    'small-plate-20': '鶏肉黒胡椒炒め',
}

HERO_MAP = {
    'all-you-can-eat-hero': '中華食べ放題バイキング',
    'course-hero': '中華コース料理',
    'drink-set-hero': '中華飲みセット ビール',
    'set-meal-hero': '中華定食',
    'small-plate-hero': '中華小皿料理',
}

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
}


def search_bing_images(query, count=5):
    url = f'https://www.bing.com/images/search?q={urllib.parse.quote(query)}&first=1&count={count}'
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=10, context=ctx) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
    except Exception as e:
        print(f'  Search error: {e}')
        return []
    murls = re.findall(r'murl&quot;:&quot;(https?://[^&]+)', html)
    return murls[:count]


def download_image(url, save_path, timeout=15):
    url = url.replace('&amp;', '&')
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=timeout, context=ctx) as resp:
            data = resp.read()
        if len(data) < 3000:
            return False
        with open(save_path, 'wb') as f:
            f.write(data)
        return True
    except Exception as e:
        print(f'  DL error: {e}')
        return False


def main():
    IMAGES_DIR.mkdir(parents=True, exist_ok=True)

    total = len(DISH_MAP)
    success = 0
    failed = []

    for i, (dish_id, query) in enumerate(DISH_MAP.items()):
        save_path = IMAGES_DIR / f'{dish_id}.jpg'
        if save_path.exists() and save_path.stat().st_size > 5000:
            success += 1
            continue

        print(f'[{i+1}/{total}] {dish_id}: {query}')
        urls = search_bing_images(query, count=5)

        downloaded = False
        for j, img_url in enumerate(urls):
            print(f'  Try {j+1}...')
            if download_image(img_url, str(save_path)):
                if save_path.stat().st_size > 3000:
                    print(f'  OK ({save_path.stat().st_size} bytes)')
                    downloaded = True
                    success += 1
                    break
                save_path.unlink(missing_ok=True)

        if not downloaded:
            print(f'  FAILED')
            failed.append(dish_id)

        time.sleep(0.4)

    # Hero images
    print(f'\n--- Hero images ---')
    for hero_id, query in HERO_MAP.items():
        save_path = IMAGES_DIR / f'{hero_id}.jpg'
        if save_path.exists() and save_path.stat().st_size > 5000:
            print(f'  SKIP: {hero_id}')
            continue
        print(f'{hero_id}: {query}')
        urls = search_bing_images(query, count=8)
        for img_url in urls:
            if download_image(img_url, str(save_path)):
                if save_path.stat().st_size > 5000:
                    print(f'  OK')
                    break
                save_path.unlink(missing_ok=True)
        time.sleep(0.4)

    print(f'\nDone! Success: {success}/{total}, Failed: {len(failed)}')
    if failed:
        print(f'Failed IDs: {failed}')


if __name__ == '__main__':
    main()
