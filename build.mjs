// TTR Renovations — zero-dependency static site generator (Bright Climb framework)
// Usage: node build.mjs   → writes the deployable site to /docs (GitHub Pages: main branch, /docs folder)
import fs from 'node:fs';
import path from 'node:path';
import home from './src/pages/home.mjs';

import { site, services, locations, esc, ph } from './src/lib.mjs';
const OUT = 'docs';
const VERSION = Date.now().toString(36);

const tel = `tel:${site.phoneHref}`;
const groups = [...new Set(services.map(s => s.group))];
const clusters = [...new Set(locations.filter(l => l.tier === 1).map(l => l.cluster))];

function header(r, est) {
  const svcCols = groups.map(g => `<div class="mega-col"><p class="mega-h">${g}</p><ul>${services.filter(s => s.group === g).map(s => `<li><a href="${r}services/${s.slug}/">${s.name}</a></li>`).join('')}</ul></div>`).join('');
  const areaCols = clusters.map(c => `<div class="mega-col"><p class="mega-h">${c}</p><ul>${locations.filter(l => l.cluster === c).map(l => `<li><a href="${r}service-areas/${l.slug}/">${l.name}, CT</a>${(l.hoods || []).map(h => `<a class="hood" href="${r}service-areas/${l.slug}/#${h.toLowerCase().replace(/\s+/g, '-')}">${h}</a>`).join('')}</li>`).join('')}</ul></div>`).join('');
  const mega = (id, label, cols, all, allHref) => `<li class="has-mega"><button class="nav-link mega-btn" aria-expanded="false" aria-controls="${id}">${label}<svg aria-hidden="true" width="10" height="6" viewBox="0 0 10 6"><path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.5"/></svg></button><div class="mega" id="${id}"><div class="mega-inner">${cols}</div><a class="mega-all" href="${allHref}">${all} →</a></div></li>`;
  return `<a class="skip" href="#main">Skip to content</a>
<header class="site-header" data-header>
  <div class="wrap header-inner">
    <a class="brand" href="${r || './'}" aria-label="TTR Renovations — home"><img src="${r}assets/img/ttr-logo.webp" alt="TTR Renovations" width="360" height="190"></a>
    <nav class="main-nav" id="main-nav" aria-label="Main">
      <ul class="nav-list">
        <li><a class="nav-link" href="${r || './'}">Home</a></li>
        <li><a class="nav-link" href="${r}about/">About</a></li>
        ${mega('mega-services', 'Services', svcCols, 'All services', `${r}services/`)}
        ${mega('mega-areas', 'Service Areas', areaCols, 'All service areas', `${r}service-areas/`)}
        <li><a class="nav-link" href="${r}projects/">Our Work</a></li>
        <li><a class="nav-link" href="${r}contact/">Contact</a></li>
      </ul>
      <div class="nav-mobile-cta"><a class="btn btn-gold" href="${est}" data-track="cta_nav">Request an Estimate</a><a class="btn btn-ghost-light" href="${tel}" data-track="phone">Call ${site.phone}</a></div>
    </nav>
    <a class="header-phone" href="${tel}" data-track="phone"><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M6.6 10.8a15 15 0 006.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 013 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1z"/></svg>${site.phone}</a>
    <a class="btn btn-gold header-cta" href="${est}" data-track="cta_header">Request an Estimate</a>
    <button class="nav-toggle" aria-expanded="false" aria-controls="main-nav" aria-label="Open menu"><span></span><span></span><span></span></button>
  </div>
</header>`;
}

function footer(r, est) {
  const y = new Date().getFullYear();
  return `<footer class="site-footer">
  <div class="wrap footer-grid">
    <div class="footer-brand">
      <img src="${r}assets/img/ttr-logo.webp" alt="TTR Renovations" width="180" height="95" loading="lazy">
      <p>Residential remodeling and renovation based in ${site.city}, Connecticut, serving homeowners throughout ${site.region}.</p>
      <p class="footer-contact"><a href="${tel}" data-track="phone">${site.phone}</a><br><a href="mailto:${site.email}" data-track="email">${site.email}</a><br>${site.city}, ${site.state}</p>
      <p class="footer-reg">CT Home Improvement Contractor Reg. #${site.hic ? esc(site.hic) : ph('HIC number required')}</p>
    </div>
    <div><p class="footer-h">Services</p><ul>${services.map(s => `<li><a href="${r}services/${s.slug}/">${s.name}</a></li>`).join('')}</ul></div>
    <div><p class="footer-h">Service Areas</p><ul>${locations.filter(l => l.tier === 1).map(l => `<li><a href="${r}service-areas/${l.slug}/">${l.name}, CT</a></li>`).join('')}<li><a href="${r}service-areas/">All service areas</a></li></ul></div>
    <div><p class="footer-h">Company</p><ul><li><a href="${r}about/">About TTR</a></li><li><a href="${r}projects/">Our Work</a></li><li><a href="${est}">Request an Estimate</a></li><li><a href="${r}contact/">Contact</a></li><li><a href="${r}privacy/">Privacy Policy</a></li></ul></div>
  </div>
  <div class="wrap footer-base"><p>© ${y} ${site.name}. All rights reserved.</p><p>Website by Bright Climb</p></div>
</footer>
<div class="mobile-bar"><a href="${tel}" data-track="phone">Call Now</a><a href="${est}" data-track="cta_mobilebar">Request Estimate</a></div>`;
}

function layout(p) {
  const r = '../'.repeat(p.depth || 0);
  const url = site.domain + '/' + (p.path ? p.path + '/' : '');
  const est = p.estimateHref || `${r}request-estimate/`;
  const schema = [{
    '@context': 'https://schema.org', '@type': 'GeneralContractor', '@id': site.domain + '/#business',
    name: site.name, url: site.domain + '/', telephone: site.phone, email: site.email,
    logo: site.domain + '/assets/img/ttr-logo.png', image: site.domain + '/assets/img/ttr-logo.png',
    address: { '@type': 'PostalAddress', addressLocality: site.city, addressRegion: site.state, postalCode: '06804', addressCountry: 'US' },
    geo: { '@type': 'GeoCoordinates', latitude: 41.4826, longitude: -73.4096 },
    knowsAbout: services.map(s => s.name), slogan: 'Thoughtful Renovations. Exceptional Craftsmanship.',
    makesOffer: services.map(s => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.name, url: `${site.domain}/services/${s.slug}/` } })),
    areaServed: locations.map(l => ({ '@type': 'City', name: `${l.name}, CT` })),
    founder: { '@type': 'Person', name: site.owner.name }
  }, ...(p.schema || [])];
  const ga = site.ga4Id ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${site.ga4Id}"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${site.ga4Id}');</script>` : '';
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(p.title)}</title>
<meta name="description" content="${esc(p.desc)}">
<link rel="canonical" href="${url}">
${site.gscVerification ? `<meta name="google-site-verification" content="${site.gscVerification}">` : ''}
<meta property="og:type" content="website"><meta property="og:site_name" content="${site.name}"><meta property="og:title" content="${esc(p.title)}"><meta property="og:description" content="${esc(p.desc)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${site.domain}/assets/img/ttr-logo.png">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(p.title)}"><meta name="twitter:description" content="${esc(p.desc)}">
<meta name="theme-color" content="#171717">
<link rel="icon" href="${r}assets/img/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="preconnect" href="https://images.unsplash.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Manrope:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="${r}assets/css/site.css?v=${VERSION}">
<script>document.documentElement.classList.add('js');window.TTR=${JSON.stringify({ endpoint: site.formEndpoint, thanks: `${r}thank-you/` })};</script>
<script type="application/ld+json">${JSON.stringify(schema.length === 1 ? schema[0] : { '@context': 'https://schema.org', '@graph': schema.map(({ '@context': _, ...s }) => s) })}</script>
${ga}
</head>
<body class="${p.bodyClass || ''}">
${header(r, est)}
<main id="main">
${p.body(r, est)}
</main>
${footer(r, est)}
<script src="${r}assets/js/site.js?v=${VERSION}" defer></script>
</body>
</html>`;
}

// ---- Build ----
const pages = [home];
fs.rmSync(OUT, { recursive: true, force: true });
fs.cpSync('src/assets', `${OUT}/assets`, { recursive: true });
let placeholders = 0;
for (const p of pages) {
  const html = layout(p);
  placeholders += (html.match(/class="ph"/g) || []).length;
  const file = path.join(OUT, p.path || '', 'index.html');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
}
if (site.customDomainLive) fs.writeFileSync(`${OUT}/CNAME`, new URL(site.domain).host + '\n');
fs.writeFileSync(`${OUT}/.nojekyll`, '');
if (placeholders && !site.showPlaceholders) { console.error(`✖ ${placeholders} placeholders remain. Replace them before launch.`); process.exit(1); }
console.log(`✔ Built ${pages.length} page(s) → /${OUT}  (${placeholders} placeholders flagged)`);
