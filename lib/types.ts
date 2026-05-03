export type CategoryGroup = 'menu' | 'course';

export interface Category {
  /** URL slug, e.g. "specialty" */
  id: string;
  /** Japanese display name */
  name: string;
  /** Theme color (hex) used for accents/placeholder backgrounds */
  color: string;
  /** Emoji icon */
  icon: string;
  group: CategoryGroup;
  /**
   * Filename inside `document/menu/` or `document/buffet_and_set/`.
   * Note: a few have a leading space (e.g. ' 麺類'), so we keep this explicit.
   */
  fileName: string;
}

export interface Dish {
  nameJa: string;
  nameCn?: string;
  description?: string;
  quantity?: string;
  price: string;
  /** 0-based index within the category, used to derive image filename */
  index: number;
}

export interface CategoryPageData {
  category: Category;
  notes: string[];
  dishes: Dish[];
}
