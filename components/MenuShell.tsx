'use client';

import Link from 'next/link';
import { useMemo, useState, type ReactNode } from 'react';
import { COURSE_CATEGORIES, MENU_CATEGORIES } from '@/lib/categories';
import type { Category } from '@/lib/types';
import { useLocale } from '@/lib/i18n/LocaleProvider';
import { LanguageSwitcher } from './LanguageSwitcher';

interface MenuShellProps {
  /** Title shown in the top bar (usually current category name, or 'メニュー'). */
  title: string;
  /** ID of the active category, used to highlight the sidebar link. */
  activeId?: string;
  children: ReactNode;
}

/**
 * Layout wrapper for all /menu/* pages.
 *
 * UX:
 * - Top bar (sticky) with hamburger on mobile and language switcher.
 * - Off-canvas sidebar on mobile, sticky sidebar on desktop (lg+).
 * - Sidebar has a category search box and collapsible groups.
 */
export function MenuShell({ title, activeId, children }: MenuShellProps) {
  const { t } = useLocale();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const filteredMenu = useMemo(() => filterCategories(MENU_CATEGORIES, query), [query]);
  const filteredCourse = useMemo(() => filterCategories(COURSE_CATEGORIES, query), [query]);

  return (
    <div className="bg-paper min-h-screen">
      {/* Top bar */}
      <div className="sticky top-0 z-40 flex h-[52px] items-center gap-3 border-b border-neutral-200 bg-white px-4">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={t.menu.swipeHint}
          className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-md transition hover:bg-neutral-100 lg:hidden"
        >
          <span className="block h-[2px] w-5 rounded bg-neutral-700" />
          <span className="block h-[2px] w-5 rounded bg-neutral-700" />
          <span className="block h-[2px] w-5 rounded bg-neutral-700" />
        </button>
        <div className="truncate font-serif text-[17px] font-bold text-neutral-800">{title}</div>
        <div className="ml-auto flex items-center gap-2">
          <LanguageSwitcher />
          <Link
            href="/"
            className="rounded-md px-2 py-1 text-[12px] text-neutral-500 transition-colors hover:text-brand-accent"
          >
            {t.menu.home}
          </Link>
        </div>
      </div>

      <div className="flex min-h-[calc(100vh-52px)]">
        {/* Overlay (mobile only) */}
        {open && (
          <button
            type="button"
            aria-label="close sidebar"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          />
        )}

        {/* Sidebar */}
        <nav
          aria-label={t.menu.categories}
          className={[
            'fixed bottom-0 left-0 top-0 z-50 w-[280px] overflow-y-auto bg-white shadow-[4px_0_20px_rgba(0,0,0,0.1)] transition-transform duration-300',
            open ? 'translate-x-0' : '-translate-x-full',
            'lg:sticky lg:top-[52px] lg:z-10 lg:h-[calc(100vh-52px)] lg:translate-x-0 lg:border-r lg:border-neutral-200 lg:shadow-none',
          ].join(' ')}
        >
          <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4 text-[15px] font-bold text-neutral-800">
            <span>{t.menu.categories}</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="close"
              className="h-8 w-8 rounded text-[18px] text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700 lg:hidden"
            >
              ✕
            </button>
          </div>

          <div className="px-3 pt-3">
            <label className="relative block">
              <span className="sr-only">{t.menu.searchPlaceholder}</span>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.menu.searchPlaceholder}
                className="w-full rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 pr-8 text-[13px] text-neutral-700 placeholder:text-neutral-400 focus:border-brand focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="clear"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[12px] text-neutral-400 hover:text-neutral-700"
                >
                  ✕
                </button>
              )}
            </label>
          </div>

          {filteredMenu.length === 0 && filteredCourse.length === 0 ? (
            <p className="px-5 py-6 text-[12px] text-neutral-400">{t.menu.searchEmpty}</p>
          ) : (
            <>
              <SidebarSection
                label={t.menu.sectionMenu}
                items={filteredMenu}
                activeId={activeId}
                onClick={() => setOpen(false)}
              />
              <SidebarSection
                label={t.menu.sectionCourse}
                items={filteredCourse}
                activeId={activeId}
                onClick={() => setOpen(false)}
              />
            </>
          )}
        </nav>

        {/* Main content */}
        <div className="flex-1 lg:max-w-[900px]">
          <div className="p-4 md:p-5">{children}</div>
        </div>
      </div>
    </div>
  );
}

function filterCategories(items: Category[], query: string): Category[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  return items.filter((c) => c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q));
}

function SidebarSection({
  label,
  items,
  activeId,
  onClick,
}: {
  label: string;
  items: Category[];
  activeId?: string;
  onClick: () => void;
}) {
  if (items.length === 0) return null;
  return (
    <div className="border-t border-neutral-100 py-2 first:border-t-0">
      <div className="px-5 pb-1 pt-3 text-[10px] font-bold uppercase tracking-wide3 text-neutral-400">
        {label}
      </div>
      {items.map((c) => {
        const isActive = c.id === activeId;
        return (
          <Link
            key={c.id}
            href={`/menu/${c.id}/`}
            onClick={onClick}
            aria-current={isActive ? 'page' : undefined}
            className={[
              'flex items-center gap-2.5 px-5 py-2.5 text-[14px] transition-colors',
              isActive
                ? 'bg-[#FFEBEE] font-bold text-brand-accent'
                : 'text-neutral-700 hover:bg-[#FFF3E0] hover:text-brand-accent',
            ].join(' ')}
          >
            <span aria-hidden className="w-6 text-center text-[18px]">{c.icon}</span>
            {c.name}
          </Link>
        );
      })}
    </div>
  );
}
