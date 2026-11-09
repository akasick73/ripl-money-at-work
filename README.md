RIPL Wealth V24 — source package

This release includes the approved nine-question Lazy Money Quiz order, immediate three-part educational results, optional email copy, refreshed landing-page messaging, and the Market Plus historical index chart.

Deploy using the existing Cloudflare/GitHub process. Verify Resend secrets and test email delivery, Calendly booking, privacy notices, GA4/ads events, and mobile layout before production. Historical index figures are 2011–2025 full calendar-year S&P 500 total returns, based on the cited source; obtain firm compliance approval of the chart and all marketing copy before publishing.

The source was syntax-checked and quiz results were tested programmatically; a full Astro build could not be completed in this environment because the required npm dependencies were unavailable. Run npm ci and npm run build in your deployment environment.

# RIPL Wealth — Quiz-First Landing Page

This is the source for the existing RIPL business-owner landing page. The approved page design, nine-question quiz, personalized results, video assets, OpenAI Ads measurement calls, and disclosures are retained. The email submission is handled by a same-origin Cloudflare Worker and Resend, replacing the failing browser redirect to FormSubmit.

## Deployment

1. Read **EMAIL-SUBMISSION-SETUP.md** first. Set up a verified sending domain and configure `RESEND_API_KEY` and `RIPL_EMAIL_FROM` in Cloudflare. Never commit API keys.
2. Copy the ZIP's contents into the **root** of your existing GitHub repository, next to `package.json`. Do not nest the files in an additional folder.
3. Commit and push the changes, then wait for Cloudflare to deploy the production branch. This source uses `worker.js` with `wrangler.jsonc` and Astro's `dist` assets.
4. Test `GET /api/quiz-lead` for an HTTP 405 response, then complete the nine-question quiz and submit a test email. Confirm that the page does not redirect, the report unlocks only after provider acceptance, and the RIPL inbox receives the notification.
5. Verify `/disclosures/`, `/money-at-work-privacy/`, Calendly booking, and mobile display before approving paid ads.

## Results behavior

- The quiz shows a free personalized preview with two additional discussion priorities locked.
- Submitting an email is optional for the full report; marketing-email opt-in is separate and optional.
- After a confirmed successful provider response, the full report unlocks **on the same page** and the existing `lead_created` event fires. A failed submission leaves the preview in place with an inline error.
- The report is not automatically emailed to visitors; they can print/save it or initiate an email from their own mail application.
- No database of quiz responses is added; a lead notification containing the email, quiz responses, and consent state is sent to RIPL's inbox by Resend.

**This package is not deployed and cannot send real email until the Cloudflare bindings and verified sender are configured.** Compliance review and end-to-end inbox testing are required before ads go live.
