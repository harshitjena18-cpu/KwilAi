## 2024-05-23 - Accessibility Pattern: Icon-only Action Buttons
**Learning:** The Kwil application frequently uses icon-only buttons for critical actions (e.g., share, download, delete, navigate) to maintain a clean mobile UI, but these lack accessible names for screen readers.
**Action:** Always verify that buttons containing only SVG icons or lucide-react components include descriptive aria-label attributes to ensure screen reader users can understand their function.
