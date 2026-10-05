# P303 Castelzor Patient Safety Reporting Brief

## Project summary

Build a **mobile-first responsive web app** for a patient or caregiver to report a possible problem experienced while taking **Castelzor**, a fictional prescription medicine. The experience is a short, step-by-step questionnaire with a clear progress indicator, flexible symptom entry, review before finishing, and a final explanation of what would happen to a report in a real Castelzor patient-reporting service.

The proposed real service is owned by **Castelzor's safety team**. In a real implementation, the team would review incoming reports, might contact the reporter for more detail, and would report information to the FDA when required. This case study is a **demonstration only**: no report is sent to a safety team or the FDA, and users should enter fictional details only.

The goal is to demonstrate thoughtful patient-centered design for an important mobile task, not to claim that this prototype is an operational medical or regulatory reporting system.

## User, context, and job to be done

**Primary user:** A patient taking Castelzor who notices a symptom or other possible problem and wants to make sure it is documented. A caregiver reporting on someone's behalf is a supported variation.

The user may be concerned, tired, uncertain about dates or medication details, and using a phone with one hand. They may not know whether Castelzor caused the event; the form should let them report an observation without making a medical judgment.

**Job to be done:** “Help me describe what happened, provide the details I know, and understand what happens after I finish.”

Assume a fictional U.S. post-market prescription medicine, not a clinical-trial product. If the scenario changes, revisit the reporting pathway and language before building.

## Safety, trust, and demonstration boundaries

### Opening message

Prominently display before the questionnaire:

> **If you are having a medical emergency, call 911 now.** This form does not provide medical advice or urgent care. If you have concerns about your symptoms or your medicine, contact a healthcare professional.

Immediately below, state:

> **Demonstration only.** Castelzor is fictional. This prototype does not send a report to a safety team or the FDA. Please use made-up information, not real personal or medical details.

The emergency notice should remain easy to find later in the flow, especially near questions about current symptoms or outcomes. Do not use patient answers to declare an event safe, diagnose the user, direct them to stop treatment, or offer a substitute for emergency help.

### Final screen

After a completed demonstration submission, lead with the truthful system status:

> **Demo complete — no report was sent.** Thank you for walking through the Castelzor reporting experience. Your answers were used only in this on-screen demonstration and were not sent to Castelzor's safety team or the FDA.

Then clearly label the intended service process:

> **In a real Castelzor service:** The safety team would review the report, might contact the reporter if it needed more information, and would submit information to the FDA when required. This reporting flow would not provide medical advice or emergency care.

Include a visible **Start over** action that clears the entered demonstration data. Do not display a fake official case number, a promised response time, or a “sent to FDA” badge. If a later version implements a real submission service, rewrite the messages to reflect actual delivery, confirmation, security, staffing, and reporting processes.

## Information architecture and question flow

The welcome and completion screens sit outside the count. Display **“Step X of 6”** and a labeled six-segment progress tracker at the top of each question step. The active label should tell the user where they are, for example, “Step 2 of 6: What happened.” Back navigation preserves answers. A user can review and edit before completing the demo.

| Step | Purpose | Key prompts and behavior |
| --- | --- | --- |
| 1. Who is reporting? | Clarify patient and reporter | “Are you reporting for yourself or someone else?” Collect fictional patient initials or a demo identifier and age or age range; for caregiver, ask relationship. Keep patient and reporter concepts distinct. |
| 2. What happened? | Capture the observed experience in the patient's words | Multi-select plain-language symptom examples such as nausea, headache, dizziness, and rash; **Other symptom or problem** reveals a required free-text input when selected. Also provide “Tell us what happened” free text and a separate medication-error/product-problem option if needed. Examples are *not* asserted Castelzor side effects. |
| 3. When and what happened next? | Capture chronology and seriousness | Approximate start date or “I'm not sure”; ongoing vs. ended; optional end date. Ask whether the person sought medical care and whether outcomes such as hospitalization, a life-threatening event, or another serious medical event occurred. Keep a visible emergency instruction for an emergency occurring now. |
| 4. About Castelzor | Link the report to the suspect product | Castelzor name prefilled and read-only; optional dose, how taken, start and stop dates, lot number, and “I don't know” or “I don't have the package.” Never invent an approved indication or dosage instruction. |
| 5. Other relevant context | Help safety review without overwhelming the user | Optional other medicines and supplements, relevant conditions, and details the user thinks matter. Explain that these details can help the team understand the event; do not imply they prove causation. |
| 6. Contact and review | Enable a hypothetical follow-up and prevent mistakes | Ask for fictional reporter name and contact method, clearly labeled **demo data only**. Show an editable summary of previous answers. Have a checkbox acknowledging that this is a demonstration, then a button labeled **Finish demo**. |

For the capstone, fields marked “required” should serve an understandable user or demonstration need. Allow uncertain dates and unknown product details; do not prevent a person from reporting because they lack a lot number. The “Other symptom” text should remain intact if the user goes back and returns. If they uncheck “Other symptom,” decide deliberately whether to retain or clear the text and reflect that behavior consistently in the summary.

FDA's consumer-facing Form 3500B provides a reference for the information categories: what happened, date, serious outcomes, suspect product and use, patient context, and reporter contact. Adapt its content to plain-language questions rather than copying the form's presentation. A report of a possible event does not establish that Castelzor caused it.

## Main interaction and acceptance flow

1. On a phone-sized screen, the user understands the emergency instruction and **demonstration-only** status before starting.
2. They select one or more symptom examples, select **Other symptom or problem**, and enter an unlisted experience.
3. They move between steps, enter uncertain information where permitted, and can go back without losing answers.
4. If they choose a serious outcome, the app offers the appropriate emergency reminder without making a clinical determination or blocking historical reports.
5. They review their answers, edit a prior step, then select **Finish demo**.
6. The completion screen truthfully states **no report was sent** and separately explains what Castelzor's safety team would do in a real service.

The demo is complete only if this entire flow works end to end in the deployed web app. A decorative progress bar or static form screens alone are insufficient.

## Content and design direction

- Use calm, reassuring, direct language and avoid blaming or leading phrasing such as “What side effect did Castelzor cause?”
- Prioritize one clear task per screen, large touch targets, visible labels, generous spacing, and a persistent or easy-to-find Back control.
- Keep the progress indicator legible as text (“Step 3 of 6”) as well as a visual tracker; announce progress to assistive technology.
- Use the mobile keyboard types that fit each field; dates should have accessible labels and an “unknown” path.
- Show inline validation near the relevant question with specific guidance. Preserve user input when an error appears.
- Distinguish mandatory, optional, and “I don't know” answers clearly. Use native checkboxes for “select all that apply,” radio buttons for mutually exclusive options, and text areas for personal descriptions.
- Use restrained life-sciences styling and a fictional Castelzor brand. Avoid a generic survey template, fear-driven red alerts, or an official FDA look that could mislead users into thinking the demo is government-operated.
- Test at roughly 375 px, 768 px, and 1440 px; the primary design target is a phone.

## Technical setup

Build a **Vue 3 + TypeScript + Vite** responsive web app, continuing the stack used in earlier capstones. Use Vue Single File Components with `<script setup lang="ts">`; no native mobile framework is needed. The app can run entirely on the client with demonstration data.

From the VS Code terminal in the directory where you want the project:

```bash
npm create vite@latest castelzor-safety-report -- --template vue-ts
cd castelzor-safety-report
npm install
npm run dev
```

Use a supported, current Node.js release and follow any scaffold warning. Install the **Vue - Official** extension in VS Code. Copy this file into the repository root as `BRIEF.md`. Run `npm run build` before deployment. [Vue Quick Start](https://vuejs.org/guide/quick-start.html) and [Vite Getting Started](https://vite.dev/guide/) describe the current scaffold and build workflow.

### Suggested structure

```text
castelzor-safety-report/
├── BRIEF.md
├── README.md
├── LICENSE
├── docs/
│   ├── context.md
│   ├── content-and-safety-decisions.md
│   └── requirements.md
├── src/
│   ├── components/
│   │   ├── ProgressTracker.vue
│   │   ├── EmergencyNotice.vue
│   │   ├── SymptomSelector.vue
│   │   ├── FormField.vue
│   │   └── ReviewSummary.vue
│   ├── steps/
│   │   ├── ReportingStep.vue
│   │   ├── ExperienceStep.vue
│   │   ├── TimelineStep.vue
│   │   ├── ProductStep.vue
│   │   ├── ContextStep.vue
│   │   └── ReviewStep.vue
│   ├── types/
│   │   └── report.ts
│   ├── App.vue
│   ├── main.ts
│   └── style.css
└── package.json
```

### Implementation decisions

- Define a typed report shape and hold responses in reactive memory for the current page session. Do not send data to a server, log answers to analytics, or persist health/contact details in `localStorage`, URLs, or browser history.
- Treat **Finish demo** as a local state transition to the demonstration completion screen. Clear all answers with **Start over** and on page reload. Use fictional seed examples only when clearly labeled.
- Keep validation and conditional “Other” logic in reusable functions or composables; use accessible native controls.
- Allow keyboard navigation and screen readers to perceive step headings, the progress value, errors, and completion status. Put focus on the new step heading after navigation.
- Do not add real FDA integration or represent the prototype as a compliant production safety intake tool.

## Repository and certification checklist

The P303 review considers whether the deployed app works against the submitted brief, whether the repo has organized AI scaffolding and meaningful history, and whether the design fits a specific industry, user, and mobile task.

- [ ] The deployed site is reachable and the whole patient-reporting demo works from welcome to completion.
- [ ] The emergency notice and demonstration-only disclosure are clear on entry; the completion screen says **no report was sent**.
- [ ] The mobile layout supports one-handed use; progress, Back, Other text, validation, review/edit, and Start over work.
- [ ] The app asks for fictional details only; no answers are sent to a server, stored beyond the current page session, or represented as filed.
- [ ] The experience uses patient-friendly language and product-safety context, with no invented Castelzor-specific clinical claims.
- [ ] Empty, unknown, conditional, and validation states are handled gracefully at mobile and wider sizes.
- [ ] The root repo contains a `BRIEF.md` that matches the build, a meaningful `README.md`, and `LICENSE`.
- [ ] AI context docs and project decisions are logically placed and updated as implementation choices evolve.
- [ ] Descriptive commits show meaningful work across sessions rather than a single final upload.
- [ ] `npm run build` passes, and the deployed flow has been exercised on a phone-sized viewport and with a keyboard.

## Evidence references for the design team

- [FDA MedWatch consumer/patient form 3500B](https://www.fda.gov/safety/medical-product-safety-information/medwatch-forms-fda-safety-reporting) is the reference for voluntary-report information categories.
- [FDA postmarketing adverse event reporting](https://www.fda.gov/drugs/surveillance/post-drug-approval-activities/postmarketing-adverse-event-reporting-compliance-program) describes the real-world manufacturer safety-reporting context. This capstone makes no claim to implement that process.
- [FDA guidance on what happens after a MedWatch report](https://www.fda.gov/consumers/consumer-updates/fda-101-how-use-consumer-complaint-system-and-medwatch) concerns reports actually received by FDA; the prototype receives none.

Before any real-world use, clinical safety, legal, privacy, security, and regulatory teams would need to define the operational workflow, reporting obligations, consent, retention, and oversight. These are outside the capstone build.
