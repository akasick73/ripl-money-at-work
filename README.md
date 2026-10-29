# RIPL Money at Work — V3

A standalone Astro landing page for the existing `akasick73/ripl-money-at-work` repository and its existing Cloudflare Workers deployment. This is a reviewable source package; uploading it to GitHub is the publication step. No deployment was made during this build.

## Included

- Real RIPL team photograph and immediately visible first quiz question.
- Seven-question money review, four stages, six priority-based starting points, and local result download without an email gate.
- Five YouTube recordings and three clearly marked placeholders, with stage filters and portrait-friendly playback.
- Adam’s current 30-minute Zoom calendar: https://calendly.com/adam-riplwealth/30-minute-zoom-meeting
- Short inquiry form and direct email option; results shared only when explicitly selected.
- Privacy page, product limitations, required footer disclosure, UTM handling, and local measurement hooks.
- `RESEARCH-AND-CONVERSION-PLAN.md` explains the evidence, psychology, implementation tradeoffs, and measurement plan.

## Update your existing site

1. Extract the ZIP on your computer.
2. Open the existing GitHub repository on `main`.
3. Upload the extracted project contents at the repository root. `package.json`, `astro.config.mjs`, `src`, and `public` belong at the top level, not inside an extra nested folder. Do not upload the ZIP itself.
4. Replace files with matching paths. Preserve your existing Cloudflare/Wrangler deployment configuration and other platform settings. This package does not require creating a new Cloudflare project or changing hosting products.
5. Commit the changes. The existing build should use `npm run build` and deploy its `dist` output using your already-configured Worker deployment command.
6. In Cloudflare, check the new build/deployment and commit, then inspect the temporary site URL on a phone.

### If GitHub commits do not trigger Cloudflare

Check GitHub → Settings → Applications → Installed GitHub Apps → Cloudflare → Configure → Repository access. With “Only select repositories” enabled, add `ripl-money-at-work` and save. This was the recurring issue with this project. Then make a new commit or retry the build as appropriate. Do not assume a commit was deployed just because the GitHub upload succeeded.

## Local build

```sh
npm install
npm run build
npm run dev
```

The production output is `dist`. Dependencies and generated output are intentionally omitted from the ZIP.

## Editing

- Quiz, result logic, video IDs, contact destination and calendar configuration: `public/money-at-work/data.js`.
- Layout and initial HTML: `src/pages/index.astro`.
- Interactions, opt-in inquiry data, UTM parameters and event hooks: `public/money-at-work/campaign.js`.
- Styling: `public/money-at-work/style.css`.
- Privacy copy: `src/pages/money-at-work-privacy.astro`.

The calendar URL is also present in the initial HTML links, so update those links along with `data.js` if it changes again.

## Verification and integration limits

The production build and automated functional checks passed. Tests covered all 48 stage/priority/tendency combinations, incomplete answers, result logic, quiz review, filters, video cleanup, booking-event validation, attribution filtering, optional result sharing, and successful/failed inquiry handling. Form delivery and booking events were simulated; no actual message or appointment was submitted. Desktop and phone-sized layouts, a real YouTube embed, and calendar opening were inspected in a browser.

Before paid traffic, verify one intended test inquiry arrives and one intended test booking appears in your account. FormSubmit may require recipient activation; approve its activation email if prompted. The displayed success state reports the provider response, not proof that an email reached your inbox. The direct email link remains available if form delivery fails.

Quiz answers are not automatically attached to Calendly bookings. Visitors can explicitly send them in a separate inquiry. There is no CRM/database or server-side booking webhook. Analytics hooks exist but no collector is installed; local events alone do not provide reporting. See the research plan before interpreting conversion data.

Review draft first-person copy and current business/contact statements before publishing. Third-party services and browser privacy settings can affect embeds and forms; direct calendar, YouTube, and email alternatives are provided.
