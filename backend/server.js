const express = require("express");
const dbConnect = require("./db/db-connect.js");
const teacherAuth = require("./routes/auth/teacher");
const cors = require("cors");
const app = express();
require("dotenv").config();
app.use(express.json());
app.use(cors());
//path
app.use("/api/auth/teacher", teacherAuth);

app.get("/", (req, res) => {
  res.send("welcome to backend of Qr code");
});
app.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Origin",
    "https://qr-attendence-system.vercel.app"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const port = process.env.PORT || 5000;
const server = () => {
  try {
    dbConnect(process.env.MONGO_URL)
      .then(() => console.log("db-connected"))
      .catch(() => console.log("Error in connecting"));
  } catch (error) {
    console.log(error);
  }
};

server();
app.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});
