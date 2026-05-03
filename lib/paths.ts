/**
 * Prepend the configured basePath to a `/`-rooted asset path.
 *
 * Use this for raw <img src> / background-image URLs that don't go through
 * Next.js's <Image> or <Link> components, which already handle basePath.
 */
export function asset(p: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  if (!p.startsWith('/')) return p;
  return `${base}${p}`;
}
