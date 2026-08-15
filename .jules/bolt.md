## 2024-08-15 - Redundant Populate Calls
**Learning:** Unpopulated ObjectId arrays natively retain their length and populating unused fields wastes resources.
**Action:** Verify virtual implementations before using populate.
