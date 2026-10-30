# V8.6 production and launch checklist

## Implemented in source
- [x] Six-section flow, primary Let's Talk, secondary anonymous seven-question quiz
- [x] Free 20-minute Zoom Calendly link with embedded booking modal and external fallback
- [x] UTM parameters preserved in embedded booking URL
- [x] Calendly `calendly.event_scheduled` listener (needs real-world verification)
- [x] Real family photo unchanged and personal bio; AI stage photo removed from page and package
- [x] Original studio hero image preserved; mobile-only 1.4x CSS crop
- [x] Four video cards in horizontal scroll with on-page click-to-play
- [x] Optional $497 tax evaluation and investment risk language retained
- [x] Seven-question quiz with immediate anonymous results and five educational CPA questions
- [x] Quiz email delivery UI clearly marked unavailable until integrated

## Requires setup and verification before promotion
- [x] Add newly supplied Meet Adam YouTube introduction (approximately 1 minute): https://youtu.be/ibtJjhboaiA; link beneath the hero photo plays on-page after click.\n- [ ] Test the new hero video on iPhone Safari, Android Chrome, and desktop; verify captions are enabled on YouTube.
- [ ] Select secure email service and configure delivery of quiz summary + five CPA questions; display upfront notice of educational drip emails, maintain opt-out and unsubscribe. No collection or enrollment is live in V8.6.
- [ ] Provide GA4 measurement ID; install with privacy/consent review. Current code emits anonymous dataLayer events only; no analytics provider is connected.
- [ ] Test Calendly embedded booking and actual `event_scheduled` confirmation on iPhone Safari, Android Chrome and desktop; confirm tracking is not merely click counting.
- [ ] Review and approve marketing copy, tax evaluation scope, privacy notices, email language and investment-risk disclosures with RIPL compliance.
- [ ] Confirm consent requirements before Meta Pixel or other advertising trackers. Do not transmit quiz answers or sensitive financial data to advertising services.
- [ ] Decide whether preview should remain noindex and when to move to branded RIPL subdomain; update OG URL when moving.
- [ ] Check all 4 YouTube embeds, video titles and thumbnails; inspect mobile scroll and performance.
- [ ] Run full Astro build and device tests. Source generation environment could not complete dependency installation; do not treat build as verified.

## New 40-second intro video
Use `MEET-ADAM-40-SECOND-SCRIPT.md` in the ZIP. Natural delivery, camera-facing, no autoplay.
