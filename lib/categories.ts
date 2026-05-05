import type { Category } from './types';

export const CATEGORIES: Category[] = [
  { id: 'otsumami',          name: 'おつまみ',           color: '#6D4C41', icon: '🍻', group: 'menu',   fileName: 'おつまみ' },
  { id: 'seafood',           name: '一品料理 海鮮',      color: '#0277BD', icon: '🦐', group: 'menu',   fileName: '一品料理 海鮮' },
  { id: 'meat',              name: '一品料理 肉類',      color: '#C62828', icon: '🥩', group: 'menu',   fileName: '一品料理 肉類' },
  { id: 'vegetable',         name: '一品料理 野菜',      color: '#2E7D32', icon: '🥬', group: 'menu',   fileName: '一品料理 野菜' },
  { id: 'rice',              name: 'ご飯類',             color: '#E65100', icon: '🍚', group: 'menu',   fileName: 'ご飯類' },
  { id: 'noodle',            name: '麺類',               color: '#F9A825', icon: '🍜', group: 'menu',   fileName: ' 麺類' },
  { id: 'soup-porridge',     name: 'スープ・お粥',         color: '#5D4037', icon: '🥣', group: 'menu',   fileName: 'スープ・お粥' },
  { id: 'authentic-chinese', name: '本格中華料理',       color: '#AD1457', icon: '🇨🇳', group: 'menu',   fileName: '本格中華料理' },
  { id: 'authentic-sichuan', name: '本格四川料理',       color: '#B71C1C', icon: '🌶️', group: 'menu',   fileName: '本格四川料理' },
  { id: 'claypot',           name: '土鍋料理',           color: '#4E342E', icon: '🍲', group: 'menu',   fileName: '土鍋料理' },
  { id: 'drypot-teppan',     name: '干鍋・鉄板料理',     color: '#BF360C', icon: '🍳', group: 'menu',   fileName: '干鍋・鉄板料理' },
  { id: 'dimsum-dessert',    name: '点心・デザート',     color: '#FF6F00', icon: '🥟', group: 'menu',   fileName: '点心・デザート' },
  { id: 'specialty',         name: '特色料理',           color: '#880E4F', icon: '⭐', group: 'menu',   fileName: '特色料理' },
  { id: 'noodle-rice-set',   name: '麺飯セット',         color: '#00695C', icon: '🍱', group: 'menu',   fileName: '麺飯セット' },
  { id: 'friedrice-set',     name: '炒飯・焼きそば定食', color: '#795548', icon: '🍛', group: 'menu',   fileName: '炒飯・焼きそば定食' },

  { id: 'all-you-can-eat',   name: '食べ放題・飲み放題', color: '#B71C1C', icon: '🍽️', group: 'course', fileName: '食べ放題・飲み放題' },
  { id: 'course',            name: '逸品居お得コース',   color: '#880E4F', icon: '🥘', group: 'course', fileName: '逸品居お得コース' },
  { id: 'drink-set',         name: 'お得な飲みセット',   color: '#E65100', icon: '🍻', group: 'course', fileName: 'お得な飲みセット' },
  { id: 'set-meal',          name: '定食メニュー',       color: '#00695C', icon: '🍱', group: 'course', fileName: '定食メニュー' },
  { id: 'small-plate',       name: '小皿料理',           color: '#4527A0', icon: '🥢', group: 'course', fileName: '小皿料理' },
];

export const MENU_CATEGORIES = CATEGORIES.filter((c) => c.group === 'menu');
export const COURSE_CATEGORIES = CATEGORIES.filter((c) => c.group === 'course');

export function getCategoryById(id: string): Category | undefined {
  return CATEGORIES.find((c) => c.id === id);
}
