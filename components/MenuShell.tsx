'use client';

import Link from 'next/link';
import { useState, type ReactNode } from 'react';
import { COURSE_CATEGORIES, MENU_CATEGORIES } from '@/lib/categories';
import type { Category } from '@/lib/types';

interface MenuShellProps {
  /** Title shown in the top bar (usually current category name, or 'メニュー'). */
  title: string;
  /** ID of the active category, used to highlight the sidebar link. */
  activeId?: string;
  children: ReactNode;
}

/**
 * Layout wrapper for all /menu/* pages. Provides:
 * - sticky top bar with hamburger
 * - off-canvas sidebar on mobile, sticky sidebar on desktop (lg+)
 * - swipe hint on mobile
 */
export function MenuShell({ title, activeId, children }: MenuShellProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-paper min-h-screen">
      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-white border-b border-neutral-200 h-[52px] px-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="カテゴリーを開く"
          className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-[5px] rounded-md hover:bg-neutral-100 transition"
        >
          <span className="block w-5 h-[2px] bg-neutral-700 rounded" />
          <span className="block w-5 h-[2px] bg-neutral-700 rounded" />
          <span className="block w-5 h-[2px] bg-neutral-700 rounded" />
        </button>
        <div className="font-serif text-[17px] font-bold text-neutral-800 truncate">{title}</div>
        <Link href="/" className="ml-auto text-[12px] text-neutral-500 hover:text-brand-accent transition-colors">
          トップ
        </Link>
      </div>

      <div className="flex min-h-[calc(100vh-52px)]">
        {/* Overlay (mobile only) */}
        {open && (
          <button
            type="button"
            aria-label="サイドバーを閉じる"
            onClick={() => setOpen(false)}
            className="lg:hidden fixed inset-0 z-40 bg-black/40"
          />
        )}

        {/* Sidebar */}
        <nav
          className={[
            'fixed top-0 left-0 bottom-0 z-50 w-[260px] bg-white overflow-y-auto shadow-[4px_0_20px_rgba(0,0,0,0.1)] transition-transform duration-300',
            open ? 'translate-x-0' : '-translate-x-full',
            'lg:sticky lg:top-[52px] lg:h-[calc(100vh-52px)] lg:translate-x-0 lg:shadow-none lg:border-r lg:border-neutral-200 lg:z-10',
          ].join(' ')}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200 font-bold text-[15px] text-neutral-800">
            <span>カテゴリー</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="閉じる"
              className="lg:hidden w-8 h-8 text-[18px] text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 rounded transition"
            >
              ✕
            </button>
          </div>
          <SidebarSection label="メニュー" items={MENU_CATEGORIES} activeId={activeId} onClick={() => setOpen(false)} />
          <SidebarSection label="コース・セット" items={COURSE_CATEGORIES} activeId={activeId} onClick={() => setOpen(false)} />
        </nav>

        {/* Main content */}
        <div className="flex-1 lg:max-w-[900px]">
          <div className="lg:hidden text-center py-2 text-[11px] text-neutral-400 tracking-wide2">
            ← 左スワイプでカテゴリー
          </div>
          <div className="p-4 md:p-5">{children}</div>
        </div>
      </div>
    </div>
  );
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
  return (
    <div className="py-2 border-t border-neutral-100 first:border-t-0">
      <div className="px-5 pt-2 pb-1 text-[11px] font-bold text-neutral-400 tracking-wide3 uppercase">{label}</div>
      {items.map((c) => {
        const isActive = c.id === activeId;
        return (
          <Link
            key={c.id}
            href={`/menu/${c.id}/`}
            onClick={onClick}
            className={[
              'flex items-center gap-2.5 px-5 py-2.5 text-[14px] transition-colors',
              isActive
                ? 'bg-[#FFEBEE] text-brand-accent font-bold'
                : 'text-neutral-700 hover:bg-[#FFF3E0] hover:text-brand-accent',
            ].join(' ')}
          >
            <span className="text-[18px] w-6 text-center">{c.icon}</span>
            {c.name}
          </Link>
        );
      })}
    </div>
  );
}
