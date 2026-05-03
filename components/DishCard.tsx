'use client';

import { useState } from 'react';
import { Lightbox } from './Lightbox';
import { useLocale } from '@/lib/i18n/LocaleProvider';
import { asset } from '@/lib/paths';
import type { Category, Dish } from '@/lib/types';

interface DishCardProps {
  category: Category;
  dish: Dish;
  /** Public-relative path to the dish photo, computed at build time. */
  imagePath: string | null;
}

/**
 * Card used in every menu category grid. The price gets its own line so it
 * doesn't get visually drowned out by the description; the Chinese name is
 * tagged with `lang="zh"` to help screen readers and search engines.
 */
export function DishCard({ category, dish, imagePath }: DishCardProps) {
  const { t } = useLocale();
  const [open, setOpen] = useState(false);
  const fullImg = imagePath ? asset(imagePath) : null;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[10px] bg-white shadow-[0_1px_6px_rgba(0,0,0,0.06)] transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(0,0,0,0.10)]">
      <button
        type="button"
        onClick={() => fullImg && setOpen(true)}
        disabled={!fullImg}
        className="relative aspect-square w-full overflow-hidden bg-neutral-200 disabled:cursor-default"
        aria-label={dish.nameJa}
      >
        {fullImg ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={fullImg}
            alt={dish.nameJa}
            loading="lazy"
            className="block h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <span
            className="flex h-full w-full flex-col items-center justify-center gap-1 text-[11px] text-white"
            style={{ background: category.color }}
          >
            <span aria-hidden className="text-[28px] opacity-70">{category.icon}</span>
            <span className="opacity-80">{t.menu.photoComingSoon}</span>
          </span>
        )}
      </button>
      <div className="flex flex-1 flex-col gap-1 p-2.5">
        <div className="text-[12px] font-bold leading-tight text-neutral-800">
          {dish.nameJa}
          {dish.nameCn && (
            <span lang="zh" className="mt-0.5 block text-[10px] font-normal text-neutral-400">
              {dish.nameCn}
            </span>
          )}
        </div>
        {dish.description && (
          <div className="text-[10px] leading-snug text-neutral-500">{dish.description}</div>
        )}
        <div className="mt-auto flex items-baseline justify-between pt-1">
          <span className="text-[15px] font-bold text-brand-accent">{dish.price}</span>
          {dish.quantity && (
            <span className="text-[10px] text-neutral-500">{dish.quantity}</span>
          )}
        </div>
      </div>

      {open && fullImg && (
        <Lightbox src={fullImg} alt={dish.nameJa} onClose={() => setOpen(false)} />
      )}
    </article>
  );
}
