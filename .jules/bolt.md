## 2025-05-24 - Optimize Array Searches with Map Lookups
**Learning:** In `spoonacularService.js`, extracting multiple different nutrients using `Array.prototype.find()` on an array of length N meant O(K*N) time complexity. Since the application extracts multiple items from the exact same array, building a Map first is more efficient.
**Action:** When a method needs to look up multiple different elements in an array by a unique identifier or property name, convert the array into a Map object first to reduce extraction complexity from O(K*N) to O(N + K).
