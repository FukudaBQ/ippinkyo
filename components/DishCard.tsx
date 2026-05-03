import { dishImagePath } from '@/lib/dishes';
import { asset } from '@/lib/paths';
import type { Category, Dish } from '@/lib/types';

interface DishCardProps {
  category: Category;
  dish: Dish;
}

export function DishCard({ category, dish }: DishCardProps) {
  const imgPath = dishImagePath(category, dish);

  return (
    <article className="bg-white rounded-[10px] overflow-hidden shadow-[0_1px_6px_rgba(0,0,0,0.06)] transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(0,0,0,0.10)]">
      <div className="aspect-square w-full relative overflow-hidden bg-neutral-200">
        {imgPath ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={asset(imgPath)}
            alt={dish.nameJa}
            loading="lazy"
            className="w-full h-full object-cover block"
          />
        ) : (
          <div
            className="w-full h-full flex flex-col items-center justify-center text-white text-[12px] text-center px-2.5 leading-tight break-all"
            style={{ background: category.color }}
          >
            <div className="text-[28px] mb-1 opacity-60">{category.icon}</div>
            {dish.nameJa}
          </div>
        )}
      </div>
      <div className="p-2.5">
        <div className="text-[12px] font-bold text-neutral-800 leading-tight mb-0.5">
          {dish.nameJa}
          {dish.nameCn && (
            <span className="block text-[10px] font-normal text-neutral-400 mt-0.5">{dish.nameCn}</span>
          )}
        </div>
        <div className="text-[15px] font-bold text-brand-accent">
          {dish.price}
          {dish.quantity && <span className="ml-1 text-[10px] text-neutral-400 font-normal">{dish.quantity}</span>}
          {dish.description && (
            <span className="ml-1 text-[10px] text-neutral-400 font-normal">{dish.description}</span>
          )}
        </div>
      </div>
    </article>
  );
}
