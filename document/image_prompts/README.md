# 逸品居 — AI Image Generation Prompts

This folder contains English prompts for generating dish photos for the website using AI image generation models (DALL·E 3, Midjourney, Stable Diffusion, Flux, etc.).

## How to use

1. Open the file for the category you want (e.g., `01_otsumami.md`).
2. Each entry shows:
   - **Image path**: the file the generated image should replace.
   - **Prompt**: a self-contained prompt; copy & paste into your image model.
3. Generated images should ideally be **square (1:1)** at ≥1024×1024 px, then resized to fit the project's existing aspect ratio.

## Shared style philosophy

All prompts share the following design intent so generated images feel like one consistent menu:

- **Subject**: a single dish (or one set tray when noted), centered, hero-shot. The Japanese dish name appears at the start of the prompt as a hint to the model.
- **Setting**: a warm-toned wooden plank tabletop with visible natural wood grain, clean uncluttered background, no other plates or restaurant decor in frame.
- **Camera**: 45-degree angle (or top-down for soups, rice bowls, claypots, and teishoku trays), DSLR look, shallow depth of field, clean composition.
- **Style**: photorealistic, professional food photography, appetizing, vibrant but natural colors, sharp focus on the dish, no text, no labels, no watermark, no chopsticks held by people.
- **Aspect ratio**: 1:1 square unless noted.

If your image generator supports a "negative prompt", the recommended one is:

> text, letters, characters, watermark, logo, signature, plastic-looking food, blurry food, cluttered table, low quality, oversaturated, cartoon, illustration, multiple plates of different dishes

## Files

| File | Category | # dishes |
| --- | --- | --- |
| `01_otsumami.md` | おつまみ (appetizers) | 32 |
| `02_seafood.md` | 一品料理 海鮮 | 9 |
| `03_meat.md` | 一品料理 肉類 | 18 |
| `04_vegetable.md` | 一品料理 野菜 | 10 |
| `05_rice.md` | ご飯類 | 23 |
| `06_noodle.md` | 麺類 | 13 |
| `07_soup_porridge.md` | スープ・お粥 | 7 |
| `08_authentic_chinese.md` | 本格中華料理 | 8 |
| `09_authentic_sichuan.md` | 本格四川料理 | 11 |
| `10_claypot.md` | 土鍋料理 | 4 |
| `11_drypot_teppan.md` | 干鍋・鉄板料理 | 7 |
| `12_dimsum_dessert.md` | 点心・デザート | 12 |
| `13_specialty.md` | 特色料理 | 1 |
| `14_friedrice_set.md` | 炒飯・焼きそば定食 | 4 |
| `15_noodle_rice_set.md` | 麺飯セット (combo) | 10 |
| `16_set_meal.md` | 定食メニュー (teishoku) | 21 |
| `17_small_plate.md` | 小皿料理 (small plates) | 21 |

> Reference photos are in `document/image_raw/` (paper menu scans).
