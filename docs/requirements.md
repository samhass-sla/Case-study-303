# Requirements and Verification

## Implemented

- Mobile-first welcome with emergency notice and demonstration-only disclosure.
- Six labeled steps with textual and visual progress, Back navigation, and focus moved to each new heading.
- Patient/caregiver reporting, symptom and other-problem entry, chronology, serious outcomes, product details, optional context, fictional contact details, and editable review.
- Field-level validation that preserves entered answers, permits uncertain dates, and does not require optional product details.
- Serious-outcome reminder without blocking, a truthful no-report-sent completion state, and Start over clearing the draft.
- Client-only reactive data with no network submission or persistent storage.

## Verification

- `npm run build` checks TypeScript and produces the production bundle.
- Exercise the welcome, conditional Other field, unknown date, serious outcome, review/edit, Finish demo, and Start over paths in a browser.
- Check at approximately 375 px, 768 px, and 1440 px, and navigate with a keyboard.

## Not implemented

Deployment, a real safety-team workflow, FDA submission, clinical advice, authentication, server storage, analytics, or production privacy/security controls are outside this demonstration.
