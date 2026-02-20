# Palette's Journal

## 2026-02-15 - Missing Loading State Pattern
**Learning:** The application's `KwilButton` component lacked a loading state, which is a critical interaction pattern for async operations (like login).
**Action:** When auditing components, check if primary action buttons (Submit, Login, Save) have a visual feedback mechanism for loading states. Implemented `isLoading` prop in `KwilButton` using `lucide-react`'s `Loader2` and ensured accessibility via `aria-busy` and `disabled` state.
