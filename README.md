# RIPL Money at Work — standalone site

Upload these extracted files to a NEW GitHub repository: ripl-money-at-work. package.json belongs at the repository root, not inside an outer ZIP folder.

Cloudflare Pages Git integration: production branch main; framework Astro; build command npm run build; output dist; root directory blank; no environment variables required.

The campaign opens at the root of the pages.dev URL Cloudflare returns. No custom domain or changes to existing sites required.

Quiz, 16 video placeholders, email form, UTM capture, and Adam's 30-minute Calendly link are included. FormSubmit delivery needs a live test and may require endpoint activation. Form context is emailed separately, not attached automatically to confirmed Calendly records. No booking webhook/database is included. Quiz answers stay in page memory until submitted with consent. Campaign UTM labels persist in browser session storage. Supply videos in public/money-at-work/data.js.

This review site has noindex and robots.txt restrictions. The temporary URL remains publicly accessible; noindex is not password protection.

Local build: npm ci then npm run build.
