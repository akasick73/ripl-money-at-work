# RIPL Wealth — Quiz-First Landing Page

This is the GitHub-ready source for the RIPL business-owner landing page, including the redesigned, mobile-first personalized quiz results experience.

## Deployment

1. Extract the ZIP and copy its contents **into the root of your existing GitHub repository** (alongside `package.json`). Replace matching files; do not nest the ZIP's contents inside a new folder.
2. In GitHub Desktop, verify changes appear in `src/pages/index.astro`, `public/money-at-work/campaign.js`, and `public/money-at-work/style.css`.
3. Commit, then **Push origin**. Wait for Cloudflare to build the production branch.
4. Refresh the live page on your phone and complete all nine questions. Confirm that the results page opens directly without showing the large hero headline above it.

## Results behavior

- The completed quiz presents a compact, category-specific heading, a three-part snapshot grounded in quiz answers, and the first complete discussion priority.
- Two additional priorities appear as deliberately locked placeholders rather than blurred actual text.
- The visitor may optionally submit an email to unlock the full report in their browser. Marketing consent is separate and optional.
- Lead submissions are sent to **adam@riplwealth.com** using FormSubmit's AJAX endpoint. **FormSubmit must be activated by confirming the one-time activation email** before production lead delivery works.
- The report is not automatically emailed to visitors. After unlock, they may use the browser's Print / Save as PDF or their own email application.
- Refreshing the page restarts the quiz. Question feedback auto-advances after approximately 5–6 seconds.

## Pre-launch checks

- Verify FormSubmit activation and delivery to the inbox with a real test submission. Avoid submitting real customer information until the workflow has been verified and approved.
- Test mobile layout, quiz completion, report unlock, PDF saving, Calendly booking, and privacy notice.
- Review all public-facing copy, privacy and marketing consent language, and disclosures under the firm's compliance process before paid advertising.

This ZIP contains source files only, no CHANGELOG files or dependencies. Cloudflare's build installs dependencies from `package-lock.json`.

## Alternating section backgrounds

Full-bleed white and warm taupe bands now alternate beneath the quiz-first hero. The team-photo recognition section starts on white; the following sections alternate. Copy, quiz, results, media, and booking links are unchanged.

## Consistent typography update

This build introduces one shared heading/body/eyebrow/quote type scale across all seven alternating page sections. On mobile, section headings use 28–31 px, paragraphs 16 px, quote text 19 px, and section labels 11 px. Hero, quiz, results, wording, photography, links, and section background colors are unchanged.
