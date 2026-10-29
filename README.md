# RIPL Wealth Landing Page — GitHub-ready V7.4.1

This is a **source-code project for Astro**, not a prebuilt HTML site. It retains the V7.4 website design and functionality. No historical CHANGE files are included.

## Upload through the GitHub website

1. **Extract this ZIP onto your computer. Do not upload the ZIP itself to GitHub.**
2. Open the extracted `RIPL-GitHub-Ready-V7.4.1` folder. Select **all contents INSIDE it** (including `src`, `public`, `package.json`, `package-lock.json`, `astro.config.mjs`).
3. Open your GitHub repository → **Add file → Upload files**. Drag the selected files and folders into the upload area. If you are replacing the prior site, remove obsolete source files in your repository so the old and new copies do not coexist.
4. Commit your changes to the branch connected to Cloudflare.

## Cloudflare Pages configuration

- Framework preset: **Astro**
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: repository root (`/`)
- Node.js: version 20 or 22

## Local check (optional)

```sh
npm ci
npm run build
```

The site intentionally has `noindex,nofollow` while in preview mode. Before public launch, verify the calendar timing (site says 20 minutes while Calendly's URL specifies a 30-minute event), booking/email behavior, video playback, mobile layout, and firm compliance disclosures. Tax returns must only be shared through an agreed secure channel after contact.
