## 2026-06-28 - Extracted Static Arrays from Component Scopes
**Learning:** Defining static arrays inside React component bodies causes them to be recreated on every render, which leads to unnecessary garbage collection overhead and potential performance degradation in list-heavy components like `SearchPage`.
**Action:** Always move static arrays and objects that do not depend on component state or props outside the component definition to ensure they are created only once.
