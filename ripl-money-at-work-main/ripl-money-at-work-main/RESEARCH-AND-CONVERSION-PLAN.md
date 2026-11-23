# RIPL Money at Work — V3 conversion strategy

Prepared October 29, 2026. This is a researched design hypothesis, not a promise of a conversion rate. The business outcome is suitable prospects booking and attending useful conversations with Adam.

## The strategic choice

Make the page feel like the beginning of the service: listen, clarify, offer something useful, and make the next step easy. The team photograph and Adam’s recordings are the strongest available proof of real people. The page demonstrates care through its behavior rather than asserting unmatched satisfaction.

The opening connects the campaign’s tax concern to the broader value: “You work hard. Your money should have a job, too.” Tax planning is the first visible quiz question. The invitation remains positive; the page does not shame an owner or claim to have discovered overpayment.

## Research translated into the experience

| Principle | Evidence and limits | Implementation |
|---|---|---|
| Make trust concrete | Stanford’s foundational credibility research recommends showing the real organization, people, expertise, and ways to contact it. It is credibility research, not a forecast for this campaign. [1] | Actual team and advisor photos; Fort Collins location; direct email; plain language; existing professional-site links. |
| Be clear about the exchange | NNGroup identifies design quality, transparency, and content quality among web trust factors. [2] | The offer says 30 minutes, free introductory conversation, no obligation, no document upload required. Fees for an ongoing relationship are not invented. |
| Earn the next commitment | NNGroup’s hierarchy-of-trust framework argues for asking only after establishing relevance and value. [3] | No email gate for results. Visitors can save the starting point, watch, ask a question, or book directly. The quiz is optional. |
| Reduce thinking and typing | NNGroup’s form guidance emphasizes structure, clarity, transparency, and support. Recognition-based choices generally demand less recall. [4,5] | One question at a time; familiar wording; visible progress; Back and review controls; no balances to retrieve; short, single-column inquiry form. |
| Reduce uncertainty about the meeting | This is our design inference from the trust and form guidance, not a separate experimentally established uplift. | A three-part meeting agenda, explicit lack of obligation, and FAQs about the CPA, preparation, Zoom, and cost. |
| Keep the page responsive | Google’s embed guidance recommends lazy loading or lightweight facades where suitable. [6] | Small WebP hero images, lazy thumbnails, YouTube loaded only when opened, Calendly’s script loaded when requested. Media space is reserved. |

### Psychological attributes used deliberately

- **Recognition:** visitors can identify a familiar problem without learning financial product terminology.
- **Agency:** they choose the priority and route forward. An optional quiz does not hold booking hostage.
- **Reduced uncertainty:** the time, preparation, agenda, and next step are clear.
- **Personal relevance:** the selected priority determines a practical step and a relevant recorded video. This is transparent matching, not a psychometric diagnosis.
- **Familiarity and warmth:** the real team, real voice, and first-person copy let visitors judge fit.
- **Demonstrated usefulness:** the result can be kept without handing over an email address. Any feeling of reciprocity is a possible consequence, not an obligation the page imposes.

We intentionally avoid false scarcity, countdowns, invented testimonials, shame, and unsupported tax or service guarantees. First-person copy is draft copy for Adam’s review, not a quotation from a recorded testimonial.

## Quiz and video decisions

Seven questions cover existing planning, cash, coordination, business dependence, current priority, life stage, and a Safety/Opportunity preference. The four stages remain Builder, Accumulator, Navigator, and Steward. Stage is self-selected, not inferred from a made-up scoring scale. Safety/Opportunity is not a risk-tolerance or suitability assessment.

Results acknowledge good existing practices as well as possible questions. The visitor’s priority selects one of six useful starting points. Each includes one practical organizing step, three questions to bring, an available recording, and contact choices. The visitor can save a text copy locally.

The library keeps all eight approved topics and stage filters. Five supplied recordings appear before the three clearly labeled placeholders. Product limitations stay beside relevant topics. A portrait-friendly player accommodates vertical video. No guessed video runtimes are shown.

## Measurement: what is implemented and what is not

UTM source, medium, campaign, content, and term are captured in session storage and passed to Calendly and inquiry submissions. Quiz answers remain in page memory unless a visitor explicitly includes them with an inquiry. Contact information and quiz answers are excluded from the event hooks.

The JavaScript emits local `dataLayer` and `ripl:campaign` events for landing views, quiz starts and steps, completion, saved results, video opens, calendar opens, selected appointment times, confirmed embedded bookings, and sent inquiries. **No analytics collector or advertising pixel is installed. These events are not a persistent reporting dashboard.**

A calendar open is not counted as a booked appointment. Embedded booking confirmation uses the official Calendly `calendly.event_scheduled` event, validated against its origin and iframe source. [8] Bookings completed through the external-calendar fallback will need Calendly reporting or a future server-side integration for reliable attribution.

There is no automatic durable attachment of quiz answers to a Calendly booking. The visitor can explicitly send the result to Adam separately. A future secure form backend plus booking webhook/CRM integration can support durable association. Do not claim that this ZIP already provides that integration.

### A prudent improvement cycle

1. Before paid traffic, have a small group of representative owners use the page on their own phones. Ask them to explain what RIPL offers, what happens after clicking, and what they expect from the meeting. Observe hesitation rather than coaching them. This is qualitative usability work, not a statistically representative conversion study.
2. Verify one real inquiry reaches Adam and one intended test booking appears in Calendly. No live email or appointment was submitted during this build.
3. Connect an approved analytics collector and confirm that it receives only the intended non-sensitive events. Use Calendly as the source of truth for bookings. Record attended and qualified conversations separately.
4. Establish a baseline by device and campaign source. Primary metrics: qualified booked meetings per eligible landing-page visit, attended meetings, and cost per qualified attended meeting. Quiz completion, video opens, and calendar opens are diagnostic signals.
5. Test one meaningful hypothesis at a time. First candidate: this reassuring money-at-work headline versus a more specific tax-coordination headline, while keeping the rest of the page constant. Define the primary metric, minimum useful improvement, sample-size plan, and test duration before launch. Do not stop just because one version briefly leads.
6. Examine lead quality and attendance, not only the lowest-cost form submission. Avoid splitting a small campaign into many simultaneous tests.

Unbounce’s finance report is useful industry context but aggregates unlike businesses, audiences, and conversion actions on its platform. Its rates are not an appropriate promise or pass/fail target for this advisor’s booked-call campaign. [7]

## Content review

The page retains the required RIPL disclosure and nearby product limitations. It avoids claiming that RIPL prepares taxes or provides tax/legal advice. The SEC marketing guide is a useful fair-and-balanced claims review reference; its applicability depends on registration status and circumstances. This package is not a legal determination of compliance. [9]

Before publishing, Adam should confirm the first-person copy, free introductory-call description, service statements, and current privacy/data-processing setup reflect actual practice. No numeric tax savings, fee bargain, performance results, or guaranteed satisfaction are claimed.

## Sources

1. Stanford Persuasive Technology Lab, *Stanford Guidelines for Web Credibility* (foundational research): https://credibility.stanford.edu/guidelines/index.html
2. Nielsen Norman Group, *Trustworthiness in Web Design*: https://www.nngroup.com/articles/trustworthy-design/
3. Nielsen Norman Group, *The Hierarchy of Trust*: https://www.nngroup.com/articles/commitment-levels/
4. Nielsen Norman Group, *4 Principles to Reduce Cognitive Load in Forms* (2025): https://www.nngroup.com/articles/4-principles-reduce-cognitive-load/
5. Nielsen Norman Group, *Recognition vs. Recall in User Interfaces*: https://www.nngroup.com/articles/recognition-and-recall/
6. Google web.dev, *Best practices for using third-party embeds*: https://web.dev/articles/embed-best-practices
7. Unbounce, *Financial Services & Insurance Conversion Rate Benchmarks*: https://unbounce.com/conversion-benchmark-report/finance-insurance-conversion-rate/
8. Calendly, *Advanced embed options*: https://calendly.com/help/advanced-calendly-embed-for-developers
9. U.S. Securities and Exchange Commission, *Investment Adviser Marketing — Small Entity Compliance Guide*: https://www.sec.gov/resources-small-businesses/small-business-compliance-guides/investment-adviser-marketing
