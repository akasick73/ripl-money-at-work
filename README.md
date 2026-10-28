# RIPL Money at Work — standalone site

Upload these extracted files to a NEW GitHub repository: ripl-money-at-work. package.json belongs at the repository root, not inside an outer ZIP folder.

Cloudflare Pages Git integration: production branch main; framework Astro; build command npm run build; output dist; root directory blank; no environment variables required.

The campaign opens at the root of the pages.dev URL Cloudflare returns. No custom domain or changes to existing sites required.

Quiz, five YouTube videos and three placeholders, email form, UTM capture, and Adam's 30-minute Calendly link are included. FormSubmit delivery needs a live test and may require endpoint activation. Form context is emailed separately, not attached automatically to confirmed Calendly records. No booking webhook/database is included. Quiz answers stay in page memory until submitted with consent. Campaign UTM labels persist in browser session storage. Supply videos in public/money-at-work/data.js.

This review site has noindex and robots.txt restrictions. The temporary URL remains publicly accessible; noindex is not password protection.

Local build: npm ci then npm run build.

## Video update V2
Eight finalized topics, two per stage. Five recordings use YouTube privacy-enhanced embeds with direct YouTube fallback links. Placeholders: Accumulator 2, Navigator 2, Steward 2. Upload the extracted contents into the existing standalone campaign repository and commit. Build settings remain unchanged. Video visibility and embedding permission remain controlled by your YouTube account.
