## 2026-04-26 - Focus states needed for Tailwind custom elements
**Learning:** Custom interactive components in this app's design system need explicit `focus-visible` utility classes, as Tailwind's preflight strips native browser focus rings. Without this, components are invisible to keyboard navigation.
**Action:** Always include `focus-visible` utility combinations (e.g. `focus-visible:ring-2`) for any newly created interactive custom elements.
