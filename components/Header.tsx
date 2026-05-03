'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { StatusBadge } from './StatusBadge';
import { useLocale } from '@/lib/i18n/LocaleProvider';
import { SITE } from '@/lib/site';

interface HeaderProps {
  /**
   * Some pages (notably the home hero) cover the header with a dark background;
   * use the "transparent" variant on those for a glassy look.
   */
  transparent?: boolean;
}

export function Header({ transparent = false }: HeaderProps) {
  const { t } = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Once the user scrolls past the hero, even a transparent header should
  // turn opaque to remain readable on light content below.
  const opaque = !transparent || scrolled;

  const wrapperClass = opaque
    ? 'bg-white/95 shadow-[0_1px_6px_rgba(0,0,0,0.08)] backdrop-blur'
    : 'bg-transparent';
  const linkClass = opaque ? 'text-neutral-700 hover:text-brand' : 'text-white/95 hover:text-white';
  const brandClass = opaque ? 'text-brand' : 'text-white';
  const subClass = opaque ? 'text-neutral-500' : 'text-white/80';

  return (
    <header className={`fixed top-0 left-0 z-50 w-full transition-colors duration-200 ${wrapperClass}`}>
      <div className="mx-auto flex max-w-page items-center justify-between gap-3 px-4 py-3 sm:px-5">
        <Link href="/" className="flex flex-col leading-tight">
          <span className={`font-serif text-[20px] font-bold tracking-wide2 sm:text-[22px] ${brandClass}`}>
            {SITE.shortName}
          </span>
          <span className={`text-[10px] tracking-wide3 sm:text-[11px] ${subClass}`}>
            中華料理 · 高幡不動店
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-5">
          <NavLink href="/menu/" label={t.nav.menu} className={linkClass} />
          <NavLink href="/news/" label={t.nav.news} className={linkClass} />
          <NavLink href="/access/" label={t.nav.access} className={linkClass} />
          <NavLink href="/coupon/" label={t.nav.coupon} className={linkClass} />
          <StatusBadge />
          <LanguageSwitcher variant={opaque ? 'dark' : 'light'} />
          <a
            href={SITE.tel.href}
            className="rounded-md bg-brand px-3 py-1.5 text-[12px] font-bold text-white hover:bg-brand-light transition-colors"
          >
            ☎ {SITE.tel.display}
          </a>
        </nav>

        {/* Mobile toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher variant={opaque ? 'dark' : 'light'} />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'メニューを閉じる' : 'メニューを開く'}
            aria-expanded={open}
            className={`flex h-9 w-9 flex-col items-center justify-center gap-[5px] rounded-md transition ${opaque ? 'hover:bg-neutral-100' : 'hover:bg-white/10'}`}
          >
            <span className={`block h-[2px] w-5 rounded transition ${opaque ? 'bg-neutral-700' : 'bg-white'}`} />
            <span className={`block h-[2px] w-5 rounded transition ${opaque ? 'bg-neutral-700' : 'bg-white'}`} />
            <span className={`block h-[2px] w-5 rounded transition ${opaque ? 'bg-neutral-700' : 'bg-white'}`} />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-t border-neutral-200 bg-white px-4 py-4 shadow-md">
          <div className="mb-3 flex items-center justify-between">
            <StatusBadge />
          </div>
          <ul className="flex flex-col divide-y divide-neutral-100">
            <MobileLink href="/menu/" label={t.nav.menu} onClick={() => setOpen(false)} />
            <MobileLink href="/news/" label={t.nav.news} onClick={() => setOpen(false)} />
            <MobileLink href="/access/" label={t.nav.access} onClick={() => setOpen(false)} />
            <MobileLink href="/coupon/" label={t.nav.coupon} onClick={() => setOpen(false)} />
          </ul>
          <a
            href={SITE.tel.href}
            className="mt-4 flex items-center justify-center gap-2 rounded-md bg-brand px-4 py-3 text-[14px] font-bold text-white hover:bg-brand-light transition-colors"
          >
            ☎ {SITE.tel.display}
          </a>
        </div>
      )}
    </header>
  );
}

function NavLink({ href, label, className }: { href: string; label: string; className: string }) {
  return (
    <Link
      href={href}
      className={`text-[13px] tracking-[0.05em] transition-colors ${className}`}
    >
      {label}
    </Link>
  );
}

function MobileLink({ href, label, onClick }: { href: string; label: string; onClick: () => void }) {
  return (
    <li>
      <Link
        href={href}
        onClick={onClick}
        className="flex items-center justify-between py-3 text-[14px] text-neutral-800 hover:text-brand"
      >
        <span>{label}</span>
        <span aria-hidden className="text-neutral-300">›</span>
      </Link>
    </li>
  );
}
