# RIPL Wealth — Financial Freedom Landing Page

## Deploy with GitHub + Cloudflare Pages

This is the Astro source project. Upload the root contents to the connected GitHub repository. Cloudflare Pages build command: `npm run build`; output directory: `dist`; Node.js 22 recommended.

For direct upload to Cloudflare Pages without a build, use the separately provided **RIPL-Financial-Freedom-Direct-Upload.zip**.

## Implemented

- Approved landing page messaging, authentic hero and family photos, and original RIPL branding.
- Nine-question quiz with explicit Next buttons, back navigation, brief contextual observations and session progress.
- Four personalized result openings/closings, three response-based discussion points, and a 20-minute Calendly CTA.
- Save Results as PDF via browser print dialog and optional email-to-self through visitor's email app (no backend collection).
- Adaptive mobile CTA, hidden while quiz is visible.
- UTM preservation and anonymous dataLayer booking/quiz events.

## Launch checks / limitations

- The four **new** personal videos are not yet recorded; existing videos remain as interim content.
- No server-side email/PDF delivery is connected. Save as PDF uses the browser; email-to-self uses the visitor's own email app. Do not advertise automatic email delivery.
- Confirm live Calendly booking and GA4 conversion in production; Calendly postMessage is instrumented but not verified live.
- Have RIPL compliance approve final copy and disclosures before promoting the page.
- Verify video links and mobile layout on real devices.
- This package has not been deployed to Cloudflare automatically.

Mobile refinement: corrected headline nowrap/oversized cascade and horizontal overflow; adjusted hero rhythm and CTA hierarchy. Verify on actual iPhone before production deployment.
