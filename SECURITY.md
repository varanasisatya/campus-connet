# Campus Connect Security and Safety Policy

## Protected data

- Lost-item ownership details and verification answers are private.
- Anonymous confessions must not store a public author identity.
- Authentication, role assignment, moderation, and claim decisions are server-authorized actions.
- AI prompts must not include secrets, verification answers, or unnecessary personal data.

## Moderation and escalation

Community reports enter a human review queue. Threats, harassment, self-harm indicators, and credible safety concerns must be escalated to trained university staff under the institution's emergency policy. AI classification may prioritize review but never makes a final disciplinary decision.

## Reporting vulnerabilities

Report vulnerabilities privately to the university security team. Include reproduction steps, affected route or collection, impact, and suggested mitigation. Do not access or retain student data beyond what is required to demonstrate the issue.

## Deployment requirements

- Deploy and test `firestore.rules` before production use.
- Use Firebase App Check, MFA for staff, least-privilege roles, rate limits, immutable audit logs, encrypted backups, and secret management.
- Complete accessibility, privacy-impact, penetration, and incident-response reviews before a campus-wide launch.
