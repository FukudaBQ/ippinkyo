import { getCategoryById } from '@/lib/categories';
import { loadCategoryBlocks, type Block } from '@/lib/dishes';
import { MenuShell } from '@/components/MenuShell';
import { BuffetHero } from '@/components/BuffetHero';

export const metadata = {
  title: 'お得な飲みセット - 逸品居高幡不動店',
};

export default function DrinkSetPage() {
  const category = getCategoryById('drink-set')!;
  const blocks = loadCategoryBlocks(category);

  // Markdown layout (after parsing):
  //   text: [3点セット...] [4点セット...] [饮品选择: ...] [小菜（おつまみ）选择:]
  //   table: 小菜 (序号 | 菜品 | 价格)
  //   text: [料理选择:]
  //   table: 料理 (序号 | 菜品)
  //   text: [点心选择:] [焼き餃子...] [小籠包...] [野菜春巻...]
  //
  // We split it into named sections by walking blocks and using each "X选择"
  // line as a heading anchor.

  const sections = parseSections(blocks);

  return (
    <MenuShell title={category.name} activeId={category.id}>
      <BuffetHero
        category={category}
        price={sections.priceLines[0]}
        subLines={sections.priceLines.slice(1)}
      />

      {sections.named.map((s, i) => (
        <NamedSection key={i} heading={s.heading} body={s.body} accent={category.color} />
      ))}
    </MenuShell>
  );
}

interface NamedSectionData {
  heading: string;
  body: { kind: 'list'; items: string[] } | { kind: 'table'; rows: string[][]; header: string[] };
}

function parseSections(blocks: Block[]): { priceLines: string[]; named: NamedSectionData[] } {
  const priceLines: string[] = [];
  const named: NamedSectionData[] = [];
  let pending: { heading: string; freeText: string[] } | null = null;

  const flushPending = () => {
    if (pending) {
      named.push({ heading: pending.heading, body: { kind: 'list', items: pending.freeText } });
      pending = null;
    }
  };

  for (const block of blocks) {
    if (block.kind === 'text') {
      for (const line of block.lines) {
        const m = line.match(/^(.+?)选择[:：]\s*(.*)$/);
        if (m) {
          flushPending();
          pending = { heading: m[1].trim(), freeText: [] };
          if (m[2]) pending.freeText.push(m[2].trim());
        } else if (pending) {
          pending.freeText.push(line);
        } else {
          priceLines.push(line);
        }
      }
    } else {
      // Table — attach to current pending heading, or anonymous.
      const heading = pending?.heading ?? '選べる一品';
      flushPending();
      named.push({
        heading,
        body: { kind: 'table', header: block.header, rows: block.rows },
      });
    }
  }
  flushPending();
  return { priceLines, named };
}

function NamedSection({
  heading,
  body,
  accent,
}: {
  heading: string;
  body: NamedSectionData['body'];
  accent: string;
}) {
  return (
    <section className="mb-6">
      <h3 className="text-[15px] font-bold mb-3 text-neutral-800 border-l-4 border-brand-accent pl-2.5">
        {heading}
      </h3>
      {body.kind === 'list' ? (
        <ul className="bg-white rounded-lg p-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
          {body.items.map((item, i) => (
            <li key={i} className="text-[13px] text-neutral-700 leading-[1.9]">
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {body.rows.map((r, i) => (
            <div
              key={i}
              className="bg-white rounded-lg p-3 shadow-[0_1px_4px_rgba(0,0,0,0.06)] flex items-center gap-2"
            >
              <span
                className="flex-shrink-0 w-6 h-6 rounded-full text-white text-[11px] font-bold flex items-center justify-center"
                style={{ background: accent }}
              >
                {r[0]}
              </span>
              <span className="text-[13px] font-bold text-neutral-800 leading-tight">{r[1]}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
