import { getCategoryById } from '@/lib/categories';
import { loadCategoryData } from '@/lib/dishes';
import { MenuShell } from '@/components/MenuShell';
import { BuffetHero } from '@/components/BuffetHero';
import { DishCard } from '@/components/DishCard';

export const metadata = {
  title: '定食メニュー - 逸品居高幡不動店',
};

export default function SetMealPage() {
  const category = getCategoryById('set-meal')!;
  const { notes, dishes } = loadCategoryData(category);

  const [headline, ...rest] = notes;

  return (
    <MenuShell title={category.name} activeId={category.id}>
      <BuffetHero category={category} price={headline} subLines={rest} />

      <section>
        <h3 className="text-[15px] font-bold mb-3 text-neutral-800 border-l-4 border-brand-accent pl-2.5">
          ラインナップ（全 {dishes.length} 品）
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-2.5 sm:gap-3.5">
          {dishes.map((d) => (
            <DishCard key={d.index} category={category} dish={d} />
          ))}
        </div>
      </section>
    </MenuShell>
  );
}
