## 2024-05-15 - Unnecessary Mongoose Populate Overheads
**Learning:** In Mongoose, an unpopulated array of ObjectId references inherently retains its correct `.length` property. Also, populating fields that are subsequently omitted by virtuals or `.select()` creates expensive and redundant database joins.
**Action:** Avoid populating reference arrays if the application logic only requires the array's length. Always verify if populated fields are actually used in the response.
