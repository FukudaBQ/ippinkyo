import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import type { Category, CategoryPageData, Dish } from './types';

const DOC_ROOT = path.join(process.cwd(), 'document');
const PUBLIC_ROOT = path.join(process.cwd(), 'public');

/**
 * Split a row like "| a | b | c |" into ["a", "b", "c"].
 */
function splitRow(line: string): string[] {
  return line
    .split('|')
    .slice(1, -1)
    .map((c) => c.trim());
}

const SEPARATOR_RE = /^\s*\|?\s*[:\-]+/;

/**
 * Pulls the (Japanese, Chinese) parts out of "日本語名（中文名）".
 */
function splitName(raw: string): { nameJa: string; nameCn?: string } {
  const m = raw.match(/^(.*?)[（(](.+?)[)）]\s*$/);
  if (m && m[1] !== undefined && m[2] !== undefined) {
    return { nameJa: m[1].trim(), nameCn: m[2].trim() };
  }
  return { nameJa: raw.trim() };
}

/**
 * Reads a single category's markdown file and parses it into structured dishes.
 *
 * Supported column layouts (header row determines which is which):
 *   - 菜品 | 价格
 *   - 菜品 | 说明 | 价格
 *   - 菜品 | 数量 | 价格
 *
 * Any non-table lines that appear *before* the table become `notes`.
 */
export function loadCategoryData(category: Category): CategoryPageData {
  const subdir = category.group === 'menu' ? 'menu' : 'buffet_and_set';
  const filePath = path.join(DOC_ROOT, subdir, category.fileName);

  if (!existsSync(filePath)) {
    return { category, notes: [], dishes: [] };
  }

  const lines = readFileSync(filePath, 'utf-8').split('\n');

  const notes: string[] = [];
  const dishes: Dish[] = [];
  let header: string[] | null = null;

  for (const rawLine of lines) {
    const line = rawLine.replace(/\r$/, '');
    if (!line.trim()) continue;

    if (line.trim().startsWith('|')) {
      // Table row.
      if (SEPARATOR_RE.test(line) && line.includes('-')) continue;

      const cells = splitRow(line);
      if (!cells.length) continue;

      if (!header) {
        // First table row is the header.
        header = cells;
        continue;
      }

      // Skip stray header repeats.
      if (cells[0] === '菜品') continue;

      const dish = mapCellsToDish(header, cells, dishes.length);
      if (dish) dishes.push(dish);
    } else if (!header) {
      notes.push(line.trim());
    }
  }

  return { category, notes, dishes };
}

function mapCellsToDish(header: string[], cells: string[], index: number): Dish | null {
  // Accept both '菜品' and '菜品名' header labels.
  const nameIdx = header.findIndex((h) => h === '菜品' || h === '菜品名');
  if (nameIdx < 0 || !cells[nameIdx]) return null;

  const priceIdx = header.findIndex((h) => h === '价格' || h.startsWith('价格'));
  const descIdx = header.findIndex((h) => h === '说明');
  const qtyIdx = header.findIndex((h) => h === '数量');

  const { nameJa, nameCn } = splitName(cells[nameIdx]);

  return {
    nameJa,
    nameCn,
    description: descIdx >= 0 ? cells[descIdx] || undefined : undefined,
    quantity: qtyIdx >= 0 ? cells[qtyIdx] || undefined : undefined,
    price: priceIdx >= 0 ? cells[priceIdx] || '' : '',
    index,
  };
}

// ---------------------------------------------------------------------------
// Block-level reader for buffet/course pages whose markdown files mix prose
// and multiple tables.
// ---------------------------------------------------------------------------

export type Block =
  | { kind: 'text'; lines: string[] }
  | { kind: 'table'; header: string[]; rows: string[][] };

/**
 * Reads a category's markdown file and returns it as a sequence of text/table
 * blocks. Blank lines separate blocks. Free-text lines that aren't part of a
 * table become text blocks; consecutive table rows become a single table block.
 */
export function loadCategoryBlocks(category: Category): Block[] {
  const subdir = category.group === 'menu' ? 'menu' : 'buffet_and_set';
  const filePath = path.join(DOC_ROOT, subdir, category.fileName);
  if (!existsSync(filePath)) return [];

  const lines = readFileSync(filePath, 'utf-8').split('\n').map((l) => l.replace(/\r$/, ''));

  const blocks: Block[] = [];
  let textBuffer: string[] = [];
  let tableHeader: string[] | null = null;
  let tableRows: string[][] = [];

  const flushText = () => {
    if (textBuffer.length) {
      blocks.push({ kind: 'text', lines: textBuffer });
      textBuffer = [];
    }
  };
  const flushTable = () => {
    if (tableHeader) {
      blocks.push({ kind: 'table', header: tableHeader, rows: tableRows });
      tableHeader = null;
      tableRows = [];
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      flushText();
      flushTable();
      continue;
    }

    if (trimmed.startsWith('|')) {
      flushText();
      if (SEPARATOR_RE.test(line) && line.includes('-')) continue;
      const cells = splitRow(line);
      if (!tableHeader) tableHeader = cells;
      else tableRows.push(cells);
    } else {
      flushTable();
      textBuffer.push(trimmed);
    }
  }
  flushText();
  flushTable();
  return blocks;
}

/**
 * Returns the public-relative path to the dish image if it exists, else null.
 */
export function dishImagePath(category: Category, dish: Dish): string | null {
  const dir = category.group === 'menu' ? 'dishes' : 'buffet';
  const rel = `/images/${dir}/${category.id}-${dish.index}.jpg`;
  const abs = path.join(PUBLIC_ROOT, rel);
  return existsSync(abs) ? rel : null;
}

/**
 * Returns the category card image path (e.g. /images/menu/specialty.jpg) if present.
 */
export function categoryImagePath(category: Category): string | null {
  const dir = category.group === 'menu' ? 'menu' : 'buffet';
  const rel = `/images/${dir}/${category.id}.jpg`;
  const abs = path.join(PUBLIC_ROOT, rel);
  return existsSync(abs) ? rel : null;
}
