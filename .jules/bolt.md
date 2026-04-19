## 2024-05-24 - O(1) Nutrient Map Lookup
**Learning:** When repeatedly querying an array from an external API response for multiple specific values (like extracting 6+ nutrients from a spoonacular recipe), sequential `Array.find()` calls cause O(N*M) performance bottlenecks.
**Action:** Always convert read-heavy API arrays into a `Map` structure upfront for O(1) lookups, especially within mapping/parsing functions handling bulk records.
