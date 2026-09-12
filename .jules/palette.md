## 2026-09-12 - Shopping List Hover Reveals
**Learning:** The app frequently uses hover-based revealing components (like opacity-0 group-hover:opacity-100 on delete buttons) which hide interactive elements from keyboard users.
**Action:** Always pair hover-reveal utility classes with focus-visible:opacity-100 to ensure elements become explicitly visible during keyboard traversal.
