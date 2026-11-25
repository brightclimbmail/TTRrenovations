import { site, services, locations, esc, ph, img } from '../lib.mjs';

const tel = `tel:${site.phoneHref}`;
const consult = site.freeConsultation === true ? 'Request a Free Consultation' : 'Request a Consultation';
const featured = services.filter(s => s.featured);
const more = services.filter(s => !s.featured);
const tier1 = locations.filter(l => l.tier === 1);
const tier2 = locations.filter(l => l.tier === 2);
const icon = d => `<svg class="ic" aria-hidden="true" viewBox="0 0 48 48" width="48" height="48"><path d="${d}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const values = [
  ['Quality Workmanship', 'Square cuts, tight joints and the finish details you notice every day. We do it right, then we clean up.', 'M8 40V8h7v25h25v7zM15 15h4M15 21h4M15 27h4M24 27l12-12 4 4-12 12-6 2z'],
  ['Clear Communication', 'A written scope before work begins, regular updates while it happens, and straight answers when you ask.', 'M6 9h24v15H16l-6 5v-5H6zM30 16h12v15h-3v5l-6-5H20v-4M12 15h12M12 19h8'],
  ['Thoughtful Planning', 'Selections, trade schedules and the order of work mapped out up front, so the job runs smoothly.', 'M7 10h34v28H7zM7 17h34M18 17v21M24 24h11v8H24zM11 24h3M11 29h3M11 34h3'],
  ['Respect for Your Home', 'Protected floors, a tidy site and a crew that remembers your family still lives there.', 'M24 5l15 6v11c0 10-7 17-15 21-8-4-15-11-15-21V11zM16 26l8-7 8 7M18 24v9h12v-9M22 33v-5h4v5']
];
const steps = [
  ['Initial Conversation', 'Tell us about your home and what you have in mind. We\'ll talk through goals, timing and a realistic budget range.'],
  ['Walkthrough & Scope', 'We visit the house, take measurements, look at what\'s behind the walls where we can, and define the scope together.'],
  ['Detailed Proposal', 'A written proposal and contract that spells out the work, materials, schedule and payment terms. No vague line items.'],
  ['Planning & Scheduling', 'Selections are finalized, materials ordered, permits handled where required, and trades scheduled in the right order.'],
  ['Build & Stay in Touch', 'Work happens on a clear schedule, with regular updates and a protected, organized job site.'],
  ['Final Walkthrough', 'We walk the finished space with you, close out any punch-list items, and make sure you\'re genuinely happy.']
];
const faqs = [
  ['What areas do you serve?', `We're based in Brookfield and work primarily within about 30 miles: ${tier1.map(l => l.name).join(', ')} and the surrounding communities. For larger projects we also travel to towns like ${tier2.slice(3, 8).map(l => l.name).join(', ')}. If you're not sure, ask.`],
  ['Do you do electrical and plumbing work?', 'Yes, as part of your project. Electrical and plumbing work is performed by appropriately licensed trade partners, and we coordinate their schedules so you have one point of contact.'],
  ['Will you pull the permits?', 'Yes. When your project requires permits, TTR pulls them. We\'ll explain what\'s needed before any work begins.'],
  ['What happens after I request an estimate?', 'We\'ll reach out to learn more about your project and, if it\'s a good fit, schedule a time to walk through your home together.'],
  ['What does TTR Renovations do?', `TTR Renovations is a residential remodeling company based in Brookfield, Connecticut. We handle kitchen and bathroom remodels, basement finishing, whole-home renovations, carpentry, masonry and exterior work for homeowners in ${tier1.slice(0,6).map(l => l.name).join(', ')} and nearby Western Connecticut towns.`]
];

const projectTypes = [...services.map(s => s.name), 'Something else / not sure'];

export default {
  path: '',
  depth: 0,
  bodyClass: 'is-home',
  estimateHref: '#estimate',
  schema: [{ '@type': 'FAQPage', mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a.replace(/<[^>]+>/g, '') } })) }],
  title: 'TTR Renovations | Remodeling Contractor in Brookfield, CT',
  desc: 'Kitchen, bathroom, basement and whole-home remodeling in Brookfield, Danbury, Ridgefield, Newtown and Western Connecticut. Request an estimate from TTR Renovations.',
  body: (r) => `
<section class="hero">
  ${img('photo-1600607687939-ce8a6c25118c', 'Warm, renovated living space with natural wood and soft light', { w: 1800, ratio: '16/9', eager: true, cls: 'hero-bg' })}
  <div class="wrap hero-grid">
    <div class="hero-copy reveal">
      <p class="eyebrow eyebrow-light">Brookfield, Connecticut · Residential Remodeling</p>
      <h1>Thoughtful Renovations.<br><em>Exceptional Craftsmanship.</em></h1>
      <p class="lede">From kitchens and bathrooms to complete home transformations, TTR Renovations brings quality craftsmanship, careful planning and clear communication to homeowners throughout Western Connecticut.</p>
      <div class="btn-row">
        <a class="btn btn-gold btn-lg" href="#estimate" data-track="cta_hero">${consult}</a>
        <a class="btn btn-ghost-light btn-lg" href="#services">Explore Our Services</a>
      </div>
      <p class="hero-call">Prefer to talk it through? <a href="${tel}" data-track="phone">Call ${site.phone}</a></p>
    </div>
    <form class="quickstart reveal" data-quickstart aria-labelledby="qs-title">
      <p class="qs-kicker">Start here · 60 seconds</p>
      <h2 id="qs-title">What are you planning?</h2>
      <label for="qs-type">Project type</label>
      <select id="qs-type" name="type"><option value="">Choose a project…</option>${projectTypes.map(t => `<option>${esc(t)}</option>`).join('')}</select>
      <label for="qs-town">Town or ZIP</label>
      <input id="qs-town" name="town" list="town-list" placeholder="e.g. Brookfield" autocomplete="address-level2">
      <datalist id="town-list">${locations.map(l => `<option value="${l.name}">`).join('')}</datalist>
      <button class="btn btn-dark btn-block" type="submit" data-track="cta_quickstart">Continue to Estimate Request →</button>
      <p class="qs-note">No obligation. We'll never share your information.</p>
    </form>
  </div>
</section>

<section class="trustbar" aria-label="Why homeowners trust TTR">
  <ul class="wrap">
    <li><strong>Locally owned</strong><span>Based in Brookfield, CT</span></li>
    <li><strong>CT Registered</strong><span>HIC Reg. #${site.hic ? esc(site.hic) : ph('HIC #')}</span></li>
    <li><strong>${site.insured ? 'Fully insured' : ph('Insurance — confirm wording')}</strong><span>General liability coverage</span></li>
    <li><strong>Written contracts</strong><span>Clear scope on every job</span></li>
  </ul>
</section>

<section class="section values">
  <div class="wrap split">
    <div class="reveal">
      <p class="eyebrow">Our approach</p>
      <h2>Built on Craftsmanship.<br>Grounded in Trust.</h2>
      <p class="lede-dark">Hiring a contractor means letting someone into your home and trusting them with one of the biggest investments you'll make. We take both seriously. You'll know what's being built, what it costs, and what happens next.</p>
    </div>
    <ul class="value-grid">
      ${values.map(([h, p, d]) => `<li class="value reveal">${icon(d)}<h3>${h}</h3><p>${p}</p></li>`).join('')}
    </ul>
  </div>
</section>

<section class="section services" id="services">
  <div class="wrap">
    <div class="section-head reveal">
      <p class="eyebrow">What we do</p>
      <h2>Renovations for the way you live.</h2>
      <p>Four core remodeling services, backed by the trades to finish the whole job.</p>
    </div>
    <div class="feature-grid">
      ${featured.map((s, i) => `<a class="feature-card reveal" href="${r}services/${s.slug}/">
        ${img(s.img, s.alt, { w: 900, ratio: i < 2 ? '4/5' : '4/5', sizes: '(min-width: 900px) 25vw, (min-width: 600px) 50vw, 100vw' })}
        <div class="fc-body"><h3>${s.name}</h3><p>${s.short}</p><span class="more">Learn more <span aria-hidden="true">→</span></span></div>
      </a>`).join('')}
    </div>
    <h3 class="subhead reveal">More ways we can help</h3>
    <div class="svc-grid">
      ${more.map(s => `<a class="svc-card reveal" href="${r}services/${s.slug}/">
        ${img(s.img, s.alt, { w: 600, ratio: '3/2', sizes: '(min-width: 1000px) 25vw, (min-width: 600px) 50vw, 100vw' })}
        <div class="sc-body"><h4>${s.name}</h4><p>${s.short}</p><span class="more">Learn more <span aria-hidden="true">→</span></span></div>
      </a>`).join('')}
    </div>
    <p class="fine">Electrical and plumbing work is performed by appropriately licensed trade partners and coordinated by TTR as part of your project.</p>
  </div>
</section>

<section class="section project">
  <div class="wrap split split-wide">
    <div class="ba reveal" data-ba>
      <div class="ba-pane ba-after" data-label="After photo · slate walkway"><span>After</span></div>
      <div class="ba-pane ba-before" data-label="Before photo · slate walkway"><span>Before</span></div>
      <div class="ba-handle" aria-hidden="true"></div>
      <input class="ba-range" type="range" min="0" max="100" value="50" aria-label="Drag to compare before and after">
    </div>
    <div class="reveal">
      <p class="eyebrow">Recent work</p>
      <h2>Natural Slate Walkway</h2>
      <p class="lede-dark">${ph('2–3 sentences in the owner\'s words: what the homeowner wanted, what made it tricky, how it turned out')}</p>
      <dl class="specs">
        <div><dt>Location</dt><dd>${ph('Town')}, CT</dd></div>
        <div><dt>Scope</dt><dd>New natural slate walkway ${ph('confirm: base prep, edging, steps?')}</dd></div>
        <div><dt>Service</dt><dd><a href="${r}services/masonry/">Masonry</a> · <a href="${r}services/decks-exterior-improvements/">Exterior</a></dd></div>
      </dl>
      <a class="btn btn-outline" href="${r}projects/">See Our Work</a>
    </div>
  </div>
</section>

<section class="section process">
  <div class="wrap">
    <div class="section-head reveal">
      <p class="eyebrow eyebrow-light">How it works</p>
      <h2>A clear path from first call to final walkthrough.</h2>
      <p>Renovations go best when nobody's guessing. Here's what working with us looks like.</p>
    </div>
    <ol class="steps">
      ${steps.map(([h, p], i) => `<li class="step reveal"><span class="step-n">${String(i + 1).padStart(2, '0')}</span><h3>${h}</h3><p>${p}</p></li>`).join('')}
    </ol>
  </div>
</section>

<section class="section about">
  <div class="wrap split">
    ${img('assets/img/owner.jpg', `${site.owner.name}, ${site.owner.title} of TTR Renovations`, { w: 800, ratio: '4/5', cls: 'owner-photo' })}
    <div class="reveal">
      <p class="eyebrow">Meet the founder</p>
      <h2>${site.owner.name}</h2>
      <p class="role">${site.owner.title}, TTR Renovations</p>
      <p class="lede-dark">TTR Renovations is a Brookfield-based remodeling company built on a simple idea: do quality work, tell people the truth, and treat every house like it belongs to family.</p>
      <p>${ph('Owner bio: years in the trades, background, specialties, why he started TTR, local roots')}</p>
      <p>When you hire TTR, you work directly with the owner, from the first walkthrough to the final punch list.</p>
      <a class="btn btn-outline" href="${r}about/">More About TTR</a>
    </div>
  </div>
</section>

<section class="section areas">
  <div class="wrap">
    <div class="section-head reveal">
      <p class="eyebrow">Where we work</p>
      <h2>Proudly Serving Brookfield and Western Connecticut</h2>
      <p>From Candlewood Lake to the Ridgefield hills, we know the colonials, capes, lake houses and raised ranches that make up this corner of Connecticut, along with the moisture, old wiring and settled framing that come with them.</p>
    </div>
    <div class="area-grid">
      ${tier1.map(l => `<a class="area-card reveal" href="${r}service-areas/${l.slug}/"><span class="area-name">${l.name}</span>${l.hoods?.length ? `<span class="area-hoods">incl. ${l.hoods.join(' · ')}</span>` : '<span class="area-hoods">Connecticut</span>'}<span class="arrow" aria-hidden="true">→</span></a>`).join('')}
    </div>
    <p class="area-more">Also taking select projects in ${tier2.map(l => l.name).join(', ')}, the shoreline and the Litchfield Hills. <a href="${r}service-areas/">View all service areas →</a></p>
  </div>
</section>

${site.showPlaceholders ? `<section class="section reviews">
  <div class="wrap narrow reveal">
    <p class="eyebrow">Client stories</p>
    <span class="quote-mark" aria-hidden="true">“</span>
    <p class="review-empty">${ph('Draft-only section: appears on the live site once 2–3 real client reviews are added')}</p>
  </div>
</section>` : ''}

<section class="section faq">
  <div class="wrap split">
    <div class="reveal"><p class="eyebrow">Good questions</p><h2>Before you call.</h2><p class="lede-dark">Answers to what homeowners usually ask first. Don't see yours? <a href="${tel}">Give us a call.</a></p></div>
    <div class="faq-list">${faqs.map(([q, a]) => `<details class="reveal"><summary>${q}</summary><p>${a}</p></details>`).join('')}</div>
  </div>
</section>

<section class="section estimate" id="estimate">
  <div class="wrap split split-form">
    <div class="est-copy reveal">
      <p class="eyebrow eyebrow-light">Request an estimate</p>
      <h2>Let's Talk About Your Next Project.</h2>
      <p class="lede">Tell us what you're planning. We'd love to learn about your home, your goals, and how we can help bring your renovation to life.</p>
      <ol class="next">
        <li><strong>Tell us about the project.</strong> Three quick steps, about a minute.</li>
        <li><strong>We'll reach out.</strong> A real conversation about scope, timing and budget.</li>
        <li><strong>We walk the space together.</strong> Then you get a clear written proposal.</li>
      </ol>
      <p class="est-direct"><a href="${tel}" data-track="phone">${site.phone}</a><a href="mailto:${site.email}" data-track="email">${site.email}</a></p>
    </div>
    <form class="est-form" id="estimate-form" action="${esc(site.formEndpoint)}" method="POST" novalidate>
      <div class="progress" aria-hidden="true"><span class="on">Project</span><span>Details</span><span>Contact</span></div>
      <fieldset class="fstep is-active" data-step="1">
        <legend>What type of project?</legend>
        <div class="tiles">${projectTypes.map((t, i) => `<label class="tile"><input type="radio" name="project_type" value="${esc(t)}" ${i === 0 ? 'required' : ''}><span>${esc(t)}</span></label>`).join('')}</div>
        <p class="err" data-err="project_type"></p>
      </fieldset>
      <fieldset class="fstep" data-step="2">
        <legend>Tell us about it</legend>
        <div class="field"><label for="f-town">Project town or ZIP <b aria-hidden="true">*</b></label><input id="f-town" name="project_town" required autocomplete="address-level2" list="town-list"><p class="err" data-err="project_town"></p></div>
        <div class="field"><label for="f-desc">Brief project description <b aria-hidden="true">*</b></label><textarea id="f-desc" name="description" rows="4" required placeholder="e.g. Full gut of a 1990s hall bath: new tile shower, vanity and floor."></textarea><p class="err" data-err="description"></p></div>
        <div class="row2">
          <div class="field"><label for="f-budget">Estimated budget <span class="opt">optional</span></label><select id="f-budget" name="budget"><option value="">Select…</option><option>Under $10,000</option><option>$10,000–$25,000</option><option>$25,000–$50,000</option><option>$50,000–$100,000</option><option>$100,000+</option><option>Not sure yet</option></select></div>
          <div class="field"><label for="f-time">Desired start <span class="opt">optional</span></label><select id="f-time" name="timeline"><option value="">Select…</option><option>As soon as possible</option><option>Within 1–3 months</option><option>Within 3–6 months</option><option>6+ months</option><option>Just exploring</option></select></div>
        </div>
      </fieldset>
      <fieldset class="fstep" data-step="3">
        <legend>How can we reach you?</legend>
        <div class="field"><label for="f-name">Full name <b aria-hidden="true">*</b></label><input id="f-name" name="name" required autocomplete="name"><p class="err" data-err="name"></p></div>
        <div class="row2">
          <div class="field"><label for="f-email">Email <b aria-hidden="true">*</b></label><input id="f-email" name="email" type="email" required autocomplete="email"><p class="err" data-err="email"></p></div>
          <div class="field"><label for="f-phone">Phone <b aria-hidden="true">*</b></label><input id="f-phone" name="phone" type="tel" required autocomplete="tel"><p class="err" data-err="phone"></p></div>
        </div>
        <div class="field"><label for="f-addr">Property address <span class="opt">optional</span></label><input id="f-addr" name="address" autocomplete="street-address"></div>
        <div class="field"><span class="label">Preferred contact <span class="opt">optional</span></span><div class="pills"><label><input type="radio" name="preferred_contact" value="Phone call"><span>Call</span></label><label><input type="radio" name="preferred_contact" value="Text"><span>Text</span></label><label><input type="radio" name="preferred_contact" value="Email"><span>Email</span></label></div></div>
        <p class="consent">By submitting, you agree that TTR Renovations may contact you about your project. We never sell your information. <a href="${r}privacy/">Privacy Policy</a></p>
      </fieldset>
      <input type="text" name="_gotcha" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
      <input type="hidden" name="_subject" value="New estimate request — TTR Renovations website">
      <input type="hidden" name="source_page" value="Homepage">
      <div class="form-nav">
        <button type="button" class="btn btn-text" data-prev hidden>← Back</button>
        <button type="button" class="btn btn-dark" data-next>Next →</button>
        <button type="submit" class="btn btn-gold" data-submit hidden>Send My Request</button>
      </div>
      <p class="form-status" role="status" aria-live="polite"></p>
    </form>
  </div>
</section>`
};
