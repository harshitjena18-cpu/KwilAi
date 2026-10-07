## 2026-10-07 - Standardize Focus States
**Learning:** The primary button component (`KwilButton`) lacked keyboard focus indicators, which degrades accessibility for keyboard users.
**Action:** Applied the application-standard Tailwind focus ring classes (`focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00FF9C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050B08]`) to ensure consistent, highly visible focus states across the UI.
