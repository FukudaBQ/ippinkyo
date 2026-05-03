import Link from 'next/link';
import { COURSE_CATEGORIES, MENU_CATEGORIES } from '@/lib/categories';
import { MenuShell } from '@/components/MenuShell';
import type { Category } from '@/lib/types';

export const metadata = {
  title: 'メニュー - 逸品居高幡不動店',
};

export default function MenuIndexPage() {
  return (
    <MenuShell title="メニュー">
      <Section heading="メニュー" items={MENU_CATEGORIES} />
      <Section heading="コース・セット" items={COURSE_CATEGORIES} />
    </MenuShell>
  );
}

function Section({ heading, items }: { heading: string; items: Category[] }) {
  return (
    <section className="mb-7">
      <h3 className="text-[16px] font-bold mb-3 text-neutral-800 border-l-4 border-brand-accent pl-2.5">{heading}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-2 sm:gap-2.5">
        {items.map((c) => (
          <Link
            key={c.id}
            href={`/menu/${c.id}/`}
            className="flex items-center gap-2.5 bg-white rounded-lg p-3 sm:p-3.5 text-neutral-800 shadow-[0_1px_4px_rgba(0,0,0,0.06)] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.10)]"
          >
            <span className="text-[20px] sm:text-[24px]">{c.icon}</span>
            <span className="text-[12px] sm:text-[13px] font-bold">{c.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
