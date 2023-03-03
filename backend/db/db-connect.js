const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
const dbConnect = (link) => {
  return mongoose.connect(link);
};
module.exports = dbConnect;
