const express = require("express");
const app = express();
app.use(express.json());
app.get("/", (req, res) => {
  res.send("welcome to backend of Qr code");
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});
