## 2026-03-29 - Mongoose bulk insert preserves array downstream logic
**Learning:** When refactoring loops of sequential Mongoose `Model.create()` calls into a single `Model.insertMany()` bulk operation, `insertMany` inherently returns an array of the inserted documents, natively preserving array-based downstream logic without requiring manual document aggregation.
**Action:** Always prefer `insertMany` over sequential `create` loops when handling batch inputs.
