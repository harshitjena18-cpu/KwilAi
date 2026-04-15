## $(date +%Y-%m-%d) - Optimize batch pantry insertions using insertMany()
**Learning:** Sequential `.create()` calls inside a loop in a Mongoose controller cause an N+1 database issue, leading to multiple synchronous round trips to the database. Replacing them with a single bulk `.insertMany()` operation significantly improves bulk insert performance.
**Action:** When adding multiple items to a MongoDB collection, map the array of input data into plain javascript objects and use `Model.insertMany()` instead of iterating and making multiple `Model.create()` queries.
