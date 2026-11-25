import fs from 'node:fs';
const read = f => JSON.parse(fs.readFileSync(new URL(f, import.meta.url)));
export const site = read('../data/site.json');
export const services = read('../data/services.json');
export const locations = read('../data/locations.json');

export const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
// Visible draft marker for info the owner must supply. Build fails if any remain when showPlaceholders=false.
export const ph = t => `<span class="ph" title="Placeholder — replace before launch">[${esc(t)}]</span>`;

// Development photos (Unsplash license). Replace with real TTR photos; see ASSETS.md.
export function img(id, alt, { w = 1200, ratio = '4/3', eager = false, sizes = '100vw', cls = '' } = {}) {
  const src = x => id.startsWith('http') || id.startsWith('assets') ? id : `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${x}&q=70`;
  const set = [480, 800, 1200, 1800].filter(x => x <= w * 1.5).map(x => `${src(x)} ${x}w`).join(', ');
  const [rw, rh] = ratio.split('/').map(Number);
  return `<figure class="media ${cls}" style="aspect-ratio:${ratio}" data-label="${esc(alt)}"><img src="${src(w)}" srcset="${set}" sizes="${sizes}" alt="${esc(alt)}" width="${w}" height="${Math.round(w * rh / rw)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"></figure>`;
}

