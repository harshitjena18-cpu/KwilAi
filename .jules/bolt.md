## 2026-04-27 - Unpopulated Reference Arrays Can Replace .length on Populated Arrays
**Learning:** When needing only the length of an array of referenced documents (e.g., `user.savedRecipes.length`), populating the array with `.populate()` wastes database resources and memory. Unpopulated reference arrays in Mongoose remain as arrays of ObjectIds, which evaluate to the exact same length.
**Action:** Verify if populated arrays are actually used for their document properties before applying `.populate()`, or if just the length is needed.
