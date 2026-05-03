import Link from 'next/link';
import { COURSE_CATEGORIES, MENU_CATEGORIES } from '@/lib/categories';
import { MenuShell } from '@/components/MenuShell';
import { MenuIndexHeading } from '@/components/menu/MenuClient';
import type { Category } from '@/lib/types';

export const metadata = {
  title: 'メニュー',
};

export default function MenuIndexPage() {
  return (
    <MenuShell title="メニュー">
      <MenuIndexHeading />
      <Section heading="menu" items={MENU_CATEGORIES} />
      <Section heading="course" items={COURSE_CATEGORIES} />
    </MenuShell>
  );
}

function Section({ heading, items }: { heading: 'menu' | 'course'; items: Category[] }) {
  return (
    <section className="mb-7">
      <SectionHeading heading={heading} />
      <div className="grid grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-2 sm:gap-2.5">
        {items.map((c) => (
          <Link
            key={c.id}
            href={`/menu/${c.id}/`}
            className="flex items-center gap-2.5 rounded-lg bg-white p-3 text-neutral-800 shadow-[0_1px_4px_rgba(0,0,0,0.06)] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.10)] sm:p-3.5"
          >
            <span aria-hidden className="text-[20px] sm:text-[24px]">{c.icon}</span>
            <span className="text-[12px] font-bold sm:text-[13px]">{c.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function SectionHeading({ heading }: { heading: 'menu' | 'course' }) {
  // Server-rendered fallback heading; the client subcomponent inside
  // MenuIndexHeading handles language switching for the page-level h1.
  // For these subsections the static Japanese label is fine.
  const label = heading === 'menu' ? 'メニュー' : 'コース・セット';
  return (
    <h3 className="mb-3 border-l-4 border-brand-accent pl-2.5 text-[16px] font-bold text-neutral-800">
      {label}
    </h3>
  );
}
