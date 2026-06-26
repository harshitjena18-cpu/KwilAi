## 2025-05-18 - [Prevent Recreation of Static Arrays]
**Learning:** In React functional components, declaring static object arrays (e.g., configurations or constants) directly inside the component body causes them to be recreated on every render. This leads to unnecessary memory allocation and potential performance bottlenecks, especially in frequently rendered dashboards.
**Action:** Always move static arrays, objects, or constants outside of the component definition if they do not depend on props or state.
