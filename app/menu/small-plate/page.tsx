import { getCategoryById } from '@/lib/categories';
import { loadCategoryData } from '@/lib/dishes';
import { MenuShell } from '@/components/MenuShell';

export const metadata = {
  title: '小皿料理 - 逸品居高幡不動店',
};

export default function SmallPlatePage() {
  const category = getCategoryById('small-plate')!;
  const { notes, dishes } = loadCategoryData(category);

  // First note line is the headline price/banner.
  const [headline, ...rest] = notes;

  return (
    <MenuShell title={category.name} activeId={category.id}>
      <header className="mb-6">
        <div
          className="rounded-xl px-6 py-7 text-white shadow-md"
          style={{ background: `linear-gradient(135deg, ${category.color}, ${category.color}dd)` }}
        >
          <div className="text-[28px] mb-2">{category.icon}</div>
          <h2 className="font-serif text-[22px] font-bold mb-1">{category.name}</h2>
          {headline && <p className="text-[15px] opacity-95">{headline}</p>}
          {rest.map((line, i) => (
            <p key={i} className="text-[12px] opacity-80 mt-1">
              {line}
            </p>
          ))}
        </div>
      </header>

      <section>
        <h3 className="text-[15px] font-bold mb-3 text-neutral-800 border-l-4 border-brand-accent pl-2.5">
          選べる一品（全 {dishes.length} 品）
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {dishes.map((d) => (
            <span
              key={d.index}
              className="bg-white border border-neutral-200 rounded-full px-3.5 py-[5px] text-[12px] text-neutral-600"
              title={d.description}
            >
              {d.nameJa}
            </span>
          ))}
        </div>
      </section>
    </MenuShell>
  );
}
