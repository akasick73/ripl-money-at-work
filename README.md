# RIPL Wealth — Quiz-First Landing Page

This version moves Question 1 of the nine-question Financial Freedom Quiz directly under the approved emotional headline. There is no quiz-start button or welcome screen. The approved personalized results, booking integration, authentic images, four existing videos, disclosures, and supporting page sections remain.

## Deployment

Cloudflare Pages with GitHub: build command `npm run build`, output directory `dist`, Node 22+. Upload the ZIP contents to the repository root, not the ZIP file itself. Use the correct repository in Cloudflare Pages.

For direct upload, use the separate static ZIP. Do not upload this source ZIP as a static website.

## Testing before launch

1. Check iPhone 320–430px and desktop widths; confirm no horizontal overflow.
2. Question 1 is visible directly on load. Complete all nine questions, use Back, change an answer, and review all four result motivations.
3. Confirm session progress survives a reload, results print/save correctly, and the mailto fallback works.
4. Confirm the 20-minute Calendly event and successful booking attribution in the actual environment.
5. Verify privacy/disclosures, approved RIA copy, tracking consent and security headers with firm compliance.
6. Record four new personal videos as the final creative step.

The quiz is educational and is not individualized investment, tax, or legal advice.
