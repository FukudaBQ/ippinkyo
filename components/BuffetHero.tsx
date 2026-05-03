import { existsSync } from 'node:fs';
import path from 'node:path';
import { asset } from '@/lib/paths';
import type { Category } from '@/lib/types';

interface BuffetHeroProps {
  category: Category;
  /** Big headline price line (first / most prominent). */
  price?: string;
  /** Optional sub-lines (party size, time limit, etc). */
  subLines?: string[];
}

/**
 * Banner used at the top of every /menu/<course-id>/ page.
 * Tries to use /images/buffet/<id>-hero.jpg as a darkened background;
 * if that image is missing, falls back to a solid color from the category.
 */
export function BuffetHero({ category, price, subLines = [] }: BuffetHeroProps) {
  const heroRel = `/images/buffet/${category.id}-hero.jpg`;
  const heroExists = existsSync(path.join(process.cwd(), 'public', heroRel));

  return (
    <header className="relative rounded-xl overflow-hidden mb-6 text-white">
      {heroExists && (
        <div
          className="absolute inset-0 opacity-30 bg-cover bg-center"
          style={{ backgroundImage: `url(${asset(heroRel)})` }}
          aria-hidden
        />
      )}
      <div
        className="relative px-6 py-7"
        style={{
          background: heroExists
            ? `linear-gradient(135deg, ${category.color}cc, ${category.color}99)`
            : `linear-gradient(135deg, ${category.color}, ${category.color}dd)`,
        }}
      >
        <div className="text-[28px] mb-2">{category.icon}</div>
        <h2 className="font-serif text-[22px] sm:text-[24px] font-bold mb-1.5">{category.name}</h2>
        {price && <p className="text-[18px] sm:text-[20px] font-bold text-yellow-300">{price}</p>}
        {subLines.map((line, i) => (
          <p key={i} className="text-[12px] sm:text-[13px] opacity-90 mt-1.5 leading-[1.7]">
            {line}
          </p>
        ))}
      </div>
    </header>
  );
}
