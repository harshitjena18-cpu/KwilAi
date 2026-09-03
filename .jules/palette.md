## 2026-02-15 - Global Focus Visible States
**Learning:** Custom UI components without `focus-visible` utility classes break keyboard navigation, significantly impacting accessibility for power users and users with disabilities in the app's complex flows.
**Action:** Always include `focus-visible` utility classes globally on base components (like KwilButton) rather than repeating them on individual instances to ensure a consistent keyboard accessible experience.
