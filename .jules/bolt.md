## 2024-06-09 - Unnecessary populate overhead
**Learning:** In Mongoose, array length operations or discarding fields through virtuals after a .populate() leads to inefficient DB queries.
**Action:** Verify if populated arrays are fully utilized; if only lengths or specific unused fields are fetched, avoid the .populate() method to prevent expensive database joins.
