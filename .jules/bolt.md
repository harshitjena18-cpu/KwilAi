## 2026-04-18 - Optimize Dashboard Analytics Queries
**Learning:** When retrieving statistics for analytics or dashboards, fetching full document arrays into memory using methods like `.find()` just to evaluate their `.length` introduces significant memory overhead and slow JSON serialization, especially for large datasets. This is a common performance bottleneck.
**Action:** Always use Mongoose's `.countDocuments()` directly in the database when only document counts are needed to dramatically reduce Node.js memory footprint and network transfer size.
