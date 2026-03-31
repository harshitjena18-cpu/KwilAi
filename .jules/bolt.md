## 2026-03-31 - Optimize KwilScanner Re-renders
**Learning:** In performance-critical React components, defining complex static mapping objects and keyword lookup arrays inside the component body triggers redundant object allocations on every render cycle.
**Action:** Hoist these static resources to the module level and pre-calculate structural derivatives (like Object.entries) globally to eliminate repeated parsing overhead and reduce Garbage Collection pressure during renders.
