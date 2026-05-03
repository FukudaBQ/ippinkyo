import { getCategoryById } from '@/lib/categories';
import { loadCategoryBlocks } from '@/lib/dishes';
import { MenuShell } from '@/components/MenuShell';
import { BuffetHero } from '@/components/BuffetHero';

export const metadata = {
  title: '逸品居お得コース - 逸品居高幡不動店',
};

export default function CoursePage() {
  const category = getCategoryById('course')!;
  const blocks = loadCategoryBlocks(category);

  // First block is intro text; second is the ordered course table.
  const intro = blocks.find((b) => b.kind === 'text');
  const table = blocks.find((b) => b.kind === 'table');

  const courseItems =
    table?.kind === 'table'
      ? table.rows.map((r) => ({
          n: r[0] ?? '',
          name: r[1] ?? '',
          desc: r[2] ?? '',
        }))
      : [];

  return (
    <MenuShell title={category.name} activeId={category.id}>
      <BuffetHero
        category={category}
        price={intro?.kind === 'text' ? intro.lines[0] : undefined}
        subLines={intro?.kind === 'text' ? intro.lines.slice(1) : []}
      />

      <section>
        <h3 className="text-[15px] font-bold mb-4 text-neutral-800 border-l-4 border-brand-accent pl-2.5">
          コース内容（全 {courseItems.length} 品）
        </h3>
        <ol className="space-y-3">
          {courseItems.map((item) => (
            <li
              key={item.n}
              className="flex items-start gap-4 bg-white rounded-lg p-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)]"
            >
              <span
                className="flex-shrink-0 w-9 h-9 rounded-full text-white font-bold text-[14px] flex items-center justify-center"
                style={{ background: category.color }}
              >
                {item.n}
              </span>
              <div className="flex-1">
                <div className="text-[15px] font-bold text-neutral-800">{item.name}</div>
                {item.desc && <div className="text-[12px] text-neutral-500 mt-0.5">{item.desc}</div>}
              </div>
            </li>
          ))}
        </ol>
      </section>
    </MenuShell>
  );
}
