## 2024-04-05 - Batch Database Insertions in Pantry Controller
**Learning:** Sequential `Model.create()` calls inside loops cause N+1 database roundtrips, creating a severe performance bottleneck during array processing (like batch ingredient addition or multi-item scanning).
**Action:** Always replace sequential `create()` loops with `Model.insertMany()` for array data, ensuring to verify that the target model (like `Pantry`) does not rely on `pre('save')` middleware which `insertMany` bypasses.
