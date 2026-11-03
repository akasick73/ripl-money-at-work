# RIPL Quiz-First — Inbox Lead Capture (FormSubmit)

This package preserves the quiz-first landing page, purple-and-gold auto-advance quiz, blurred results preview, and personalized full report. It replaces the previous Cloudflare/Resend backend with a static form submission to FormSubmit.

## Deploy
1. Unzip the GitHub-ready archive. Copy the **contents** (not the containing folder) into your existing landing-page repository, replacing matching files.
2. Commit and **Push origin** in GitHub Desktop. Wait for Cloudflare to build.
3. Complete the nine-question quiz and enter a test email. FormSubmit sends a **one-time activation message to adam@riplwealth.com**. Open that inbox and click the activation link. If needed, check spam.
4. After activation, submit another test and verify that the lead arrives in Adam's inbox with the results category, all nine answers, and the marketing opt-in status.
5. Confirm the complete report unlocks, Save as PDF works, the quiz resets on refresh, and the Calendly link opens.

## Important behavior
- The report unlocks on-page after FormSubmit confirms the submission. The visitor can save as PDF or use the built-in 'Email Myself My Results' mailto action. This version **does not automatically send a personalized email to the visitor**.
- FormSubmit is a third-party service. Visitors are informed in the report form and privacy page.
- No Cloudflare email credentials, secrets, Workers Functions, or Resend account are needed.
- FormSubmit activation and actual delivery **cannot be verified before you activate the recipient inbox**.
- `_captcha` is disabled for an uninterrupted quiz; a honeypot is included. Monitor spam and consider additional protections if needed.
- Compliance/privacy review is recommended before paid promotion.
