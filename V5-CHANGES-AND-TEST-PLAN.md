# RIPL Money at Work V5 — Mobile-first conversion rebuild

## Why this design
The prior mobile page put seven quiz questions above the personal connection and business-owner value explanation. V5 prioritizes an understandable promise, an optional meeting, genuine team photo, and human introduction, followed by recognizable pain points and then an optional quiz. It deliberately avoids manipulative urgency and unverifiable success claims.

## Changes
- Shorter, more direct hero headline: “You built the business. Now build what’s next.”
- Mobile readable headline/body fonts and a compact team image.
- One prominent 30-minute Zoom CTA and an unobtrusive quiz link.
- Human introduction moved above the topic cards and quiz.
- Quiz moved below recognizable business-owner situations; no gating introduced.
- Larger mobile answer tap targets and readable form prompts.
- Existing Calendly, quiz script, videos, FormSubmit, and disclosures retained.

## Prelaunch checklist
1. Run npm ci && npm run build in CI/Cloudflare.
2. Inspect 320, 375, 390, 430, 768, and 1440px viewport sizes.
3. Finish the quiz and confirm personalized result and reset.
4. Test booking on iOS Safari and verify actual Calendly confirmation.
5. Test email form and FormSubmit recipient activation/delivery.
6. Confirm live video IDs and images.
7. Obtain investment-adviser compliance approval before paid distribution.
8. Confirm analytics, consent, privacy policy, UTM attribution, and booking-confirmed tracking (do not count calendar opens as booked meetings).
9. Remove robots noindex/nofollow only when approved for indexing.

## Evidence
- Unbounce 2024 finance benchmark: investing median 3.9% and mobile conversion advantages within financial services, not guarantees. https://unbounce.com/conversion-benchmark-report/finance-insurance-conversion-rate/
- Baymard mobile forms: visible above-field labels; large readable forms. https://baymard.com/research-articles/mobile-form-usability-label-position
- SEC marketing rule: avoid misleading or unsubstantiated claims, provide fair risk context. https://www.sec.gov/resources-small-businesses/small-business-compliance-guides/investment-adviser-marketing

## Measurements
Primary: confirmed qualified introductory meetings per unique qualified visitor; then show-up rate, opportunities, and funded AUM. Secondary: quiz completion, topic click, booking-start and email inquiries. Run a controlled A/B test when enough traffic exists; don't confuse benchmark rates with qualified meeting rates.
