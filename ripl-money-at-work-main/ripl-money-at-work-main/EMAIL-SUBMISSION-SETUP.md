# RIPL quiz email submission — setup and testing

This package preserves the existing quiz, results, styling, and OpenAI Ads events. It replaces FormSubmit with a same-origin Cloudflare Worker that uses Resend to send a notification to adam@riplwealth.com. It does not automatically email the full report to visitors.

## Required setup before testing

1. Confirm Resend is approved under RIPL's compliance and privacy policies. Create or use a Resend account at https://resend.com/.
2. Verify a domain or sending subdomain owned by RIPL. Add the DNS records **exactly as Resend provides them**. Do not assume a sender domain is verified.
3. Create a sending-only Resend API key. Never put the key in GitHub or in a ZIP.
4. In Cloudflare Workers & Pages, open the deployed `ripl-money-at-work` Worker and add the following bindings in Settings > Variables and Secrets (names are exact):
   - `RESEND_API_KEY`: **secret** containing the API key.
   - `RIPL_EMAIL_FROM`: **text** containing a verified sender, such as `RIPL Wealth <quiz@YOUR-VERIFIED-DOMAIN>` (replace the placeholder).
5. Deploy the updated source to the same Cloudflare Worker. Confirm the Worker has both bindings in the deployed environment. Depending on your Cloudflare UI, you may need to redeploy after adding bindings.

## End-to-end verification

1. In a browser, `GET https://ripl-money-at-work.akasick.workers.dev/api/quiz-lead` should return JSON with HTTP 405. If it returns the homepage or 404, the Worker route is not active.
2. Complete all nine quiz questions. Submit a test email. The browser should **stay on RIPL**, the full report should unlock, and the request to `/api/quiz-lead` should return HTTP 200 JSON `{ "success": true }`.
3. Verify the lead notification actually reaches `adam@riplwealth.com` and contains the test email, quiz answers, and optional marketing-consent state. Resend API acceptance alone does not guarantee inbox delivery.
4. Test a deliberately invalid email and a temporary missing-key/error condition; the report must remain locked, an inline error must appear, and no `lead_created` event should fire.
5. Verify the privacy notice and locked disclosures page are reachable. Have RIPL compliance approve the third-party processor and data flow.
6. Test mobile and desktop. Do not turn on paid ads until the complete test passes.

**Important:** This ZIP cannot send real emails without your Resend account configuration. It does not deploy itself or change the live site. The email provider may charge fees depending on plan and volume. No private API key should be sent to ChatGPT.
