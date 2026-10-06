## 2026-10-06 - Application focus rings
**Learning:** The application uses a specific visual pattern for focus states involving standard Tailwind classes rather than standard browser defaults. This needs to be explicitly added to interactive elements to ensure accessibility.
**Action:** Apply `focus-visible:ring-2 focus-visible:ring-[#00FF9C] focus-visible:outline-none focus-visible:ring-offset-2 focus-visible:ring-offset-[#050B08]` to all custom interactive components (like buttons, tabs, links).
