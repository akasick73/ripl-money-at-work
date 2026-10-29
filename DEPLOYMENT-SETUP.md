# RIPL Financial GC Landing Page — deployment guide

## What changed
Rebuilt page with contractor/trades-focused financial general contractor positioning, primary secure AI tax evaluation CTA, secondary original seven-question quiz (same questions, scoring, and outcome definitions), two pillars, three-step process, six services, direct indexing and structured notes (visible risk disclosures), exit planning, Adam bio, and eight original problem-titled videos grouped by Builder, Accumulator, Navigator, Steward.

## REQUIRED BEFORE LAUNCH
Edit `public/money-at-work/campaign.js` and set:
- `SECURE_UPLOAD_URL`: the HTTPS secure tax-return portal provided by RIPL/Hazel. The code currently allows only Altruist, Hazel or RIPL Wealth hostnames; adjust approved host allowlist *only after verifying the official portal host*. Do not use email or an ordinary web form to collect returns. Until configured, upload CTA is deliberately disabled and visibly marked coming soon.
- `BOOKING_URL`: the approved scheduling link. The landing page labels the call 20 minutes even if the linked Calendly event is 30 minutes, **as requested**; consider updating the calendar event itself for consistency. Until configured, button is disabled with a visible explanation.
- `INTRO_YOUTUBE_ID`: YouTube ID for the hero's unlisted video.
- `TRANSITION_YOUTUBE_ID`: Optional exit-planning video ID.
- `public/money-at-work/images/adam.webp`: replace with approved headshot if needed.
- Final domain, website disclosures, privacy terms, cookie/analytics configuration, and removal of `noindex,nofollow` when ready for indexing.
- Referral compensation disclosure is marked pending compliance approval. Do not publish a definitive compensation claim until reviewed.

## UTM handling
UTM source/medium/campaign/content/term are captured from page URL and stored in sessionStorage. Approved secure portal and booking links will receive these UTM parameters via `linkWithUtm()`. Same-page quiz anchors retain the current query parameters and UTMs in session state. No tax return data or quiz answers go to analytics. There is no live analytics service installed.

## Known limitations
No tax return upload form is present. A secure-upload URL and booking URL must be supplied before conversion flow can work. Hero and exit videos show honest placeholders. No claims of guaranteed tax savings or returns, testimonials, ratings, performance numbers, or unauthorized logos.

## Run / verify
`npm ci && npm run build` (Astro 5), then deploy Astro `dist` with Cloudflare Pages or the existing static deployment process. Test iPhone and Android screen widths, quiz answer navigation/results, video links, approved secure portal, calendar confirmations, UTMs, privacy and compliance.
