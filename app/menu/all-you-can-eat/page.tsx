import { getCategoryById } from '@/lib/categories';
import { loadCategoryData } from '@/lib/dishes';
import { MenuShell } from '@/components/MenuShell';
import { BuffetHero } from '@/components/BuffetHero';

export const metadata = {
  title: '食べ放題・飲み放題 - 逸品居高幡不動店',
};

export default function AllYouCanEatPage() {
  const category = getCategoryById('all-you-can-eat')!;
  const { notes, dishes } = loadCategoryData(category);

  // First note is the price tier line; the rest are details.
  const [price, ...rest] = notes;

  return (
    <MenuShell title={category.name} activeId={category.id}>
      <BuffetHero category={category} price={price} subLines={rest} />

      <section>
        <h3 className="text-[15px] font-bold mb-3 text-neutral-800 border-l-4 border-brand-accent pl-2.5">
          選べる料理（全 {dishes.length} 品）
        </h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 bg-white rounded-lg p-4 sm:p-5 shadow-sm">
          {dishes.map((d) => (
            <li key={d.index} className="flex items-baseline gap-2 py-1 border-b border-neutral-100 last:border-b-0 sm:[&:nth-last-child(2)]:border-b-0">
              <span className="text-[13px] font-bold text-neutral-800">{d.nameJa}</span>
              {d.description && (
                <span className="text-[11px] text-neutral-400 ml-auto pl-2">{d.description}</span>
              )}
            </li>
          ))}
        </ul>
      </section>
    </MenuShell>
  );
}
