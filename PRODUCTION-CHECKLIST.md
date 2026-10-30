# RIPL Landing Page V8.2 — Production checklist

This is a working production list, **not** a list of completed assets. Do not publish new claims, videos, or payment instructions without verification and compliance review.

## Required before promotion
- [ ] Confirm live Calendly event is **30 minutes** and URL `https://calendly.com/adam-riplwealth/30-minute-zoom-meeting` is correct. All page references now say 30 minutes.
- [ ] Review advisor biography, credentials, registration links, claims, product risks, and the $497 tax-evaluation scope with RIPL compliance.
- [ ] Confirm exactly what the **$497 tax evaluation** delivers (e.g., whether a written summary, tax-return review, or follow-up call is included), the payment method, cancellation/refund terms, and the secure-document workflow. Do not add unapproved deliverables.
- [ ] Configure analytics destination (GTM/GA4 or privacy-conscious equivalent). `dataLayer` events are emitted, but **no analytics service is installed**.
- [ ] Configure completed Calendly booking event tracking in Calendly/analytics and validate across mobile and desktop. Current page only tracks booking clicks, not confirmed appointments.
- [ ] Update RIPL privacy notice if collecting/retaining new behavioral analytics. No quiz answers should be sent to analytics.
- [ ] Check on iPhone Safari and Android Chrome: large three-line hero, quiz progression/results, sticky navigation, video playback and booking links.
- [ ] Validate `social-preview.jpg` in iMessage, Facebook, LinkedIn. Absolute URL is set for the current workers.dev domain; change if domain changes.
- [ ] Consider a final accessibility/performance audit and optimize any images if needed.

## Videos already on the page — verify their live YouTube content
- [ ] Existing introduction: `ONoWDcglifw`. Review message and ending CTA to invite a money conversation.
- [ ] Four existing business-owner videos and their YouTube thumbnail images: review accuracy, captions, volume, length, and first-tap playback on iPhone. The videos' IDs are sourced from `public/money-at-work/data.js`.
- [ ] Add/verify accurate on-video captions and optional text transcripts.

## Suggested **new** recordings (not needed for this release)
1. **Why RIPL / financial quarterback** (45–60 seconds): how investments, CPA conversations, business cash, and personal financial goals fit together; include accurate limits of RIPL's services; invite a free 30-minute introduction. This best supports the early credibility section.
2. **What happens in your first call** (30–45 seconds): one question to bring, how the conversation works, what you will and will not do in 30 minutes, and no-obligation nature. Useful beside booking CTA.
3. **What the $497 tax evaluation includes** (45–75 seconds): exact reviewed materials, secure sharing, deliverables, fees, and CPA coordination **after scope is finalized**. Do not film until compliance signs off.
4. **Quiz follow-up** (30–45 seconds): explain that the seven questions surface discussion topics, not diagnoses; invite a personalized conversation. Optional for results section.

## Optional visual assets / future conversion experiments
- [ ] A second authentic RIPL team photograph in wide landscape format, with permission for public use. Current one is reused rather than replaced.
- [ ] No stock photo or invented client testimonial was added. If RIPL has verifiable disclosures/credentials, choose one or two for the early trust section subject to compliance.
- [ ] Optional tax-first, business-cash-first, and business-sale-first variants for different ad campaigns; they should not be substituted for the single current general page without testing.
- [ ] A/B test quiz-first vs. conversation-first hero after actual booking completion data is available.

## Measurement definitions
Existing page pushes `ripl_landing_view`, `ripl_quiz_start`, `ripl_quiz_complete` (with general result category only), `ripl_quiz_cta_click`, `ripl_booking_click`, `ripl_tax_evaluation_interest`, and `ripl_video_start` into `window.dataLayer` for future tag-manager configuration. Do not treat these events as confirmed leads or meetings. CRM must separately record qualified appointments and resulting new accounts/AUM.

## About Adam photo placeholder
- [ ] Replace `public/money-at-work/images/adam-on-stage-placeholder.webp` with a genuine, approved landscape photo of Adam presenting at a small venue, photographed from the side. Current image is AI-generated and illustrative, NOT evidence of a real speaking engagement.
- [ ] When replacing, update image path, alt text, dimensions and remove the illustrative-image caption from `src/pages/index.astro`.

- HERO IMAGE (V8.4): Authentic RIPL studio photograph `public/money-at-work/images/adam-studio-hero.webp`, supplied by Adam. Review crop on iPhone and desktop; no replacement photo needed unless desired.
