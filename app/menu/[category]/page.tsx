import { notFound } from 'next/navigation';
import { MENU_CATEGORIES, getCategoryById } from '@/lib/categories';
import { dishImagePath, loadCategoryData } from '@/lib/dishes';
import { MenuShell } from '@/components/MenuShell';
import { DishCard } from '@/components/DishCard';

interface PageProps {
  params: Promise<{ category: string }>;
}

/**
 * Tells Next.js which [category] paths to pre-render at build time.
 * For now we only emit the 14 menu categories; the 5 course pages
 * (all-you-can-eat, course, drink-set, set-meal, small-plate) have unique
 * layouts and live at hand-crafted routes (or will, once migrated).
 */
export function generateStaticParams() {
  return MENU_CATEGORIES.map((c) => ({ category: c.id }));
}

export async function generateMetadata({ params }: PageProps) {
  const { category: id } = await params;
  const cat = getCategoryById(id);
  return {
    title: cat ? `${cat.name} - 逸品居高幡不動店` : 'メニュー',
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category: id } = await params;
  const category = getCategoryById(id);
  if (!category || category.group !== 'menu') notFound();

  const { notes, dishes } = loadCategoryData(category);

  return (
    <MenuShell title={category.name} activeId={category.id}>
      <header className="mb-5">
        <h2 className="font-serif text-[22px] font-bold mb-1.5">{category.name}</h2>
        {notes.length > 0 && (
          <div className="text-[13px] text-neutral-500 leading-[1.6]">
            {notes.map((n, i) => (
              <p key={i}>{n}</p>
            ))}
          </div>
        )}
      </header>

      {dishes.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-2.5 sm:gap-3.5">
          {dishes.map((d) => (
            <DishCard
              key={`${category.id}-${d.index}`}
              category={category}
              dish={d}
              imagePath={dishImagePath(category, d)}
            />
          ))}
        </div>
      ) : (
        <p className="text-neutral-500 text-sm">準備中です。</p>
      )}
    </MenuShell>
  );
}

// Make sure unknown categories 404 instead of being attempted at runtime.
export const dynamicParams = false;
