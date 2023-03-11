var express = require("express");
var router = express.Router();
const Teacher = require("../../models/Teacher");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/register", async function (req, res, next) {
  const { fullName, email, password } = req.body;
  if (!email || !password || !fullName) {
    return res.status(422).json({ error: "please add all the fields" });
  }
  Teacher.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        return res.status(422).json({
          error: "Teacher Already Exists",
          success: false,
        });
      }
      bcrypt.hash(password, 12).then((hashedpassword) => {
        const teacher = new Teacher({
          fullName,
          email,
          password: hashedpassword,
        });

        teacher
          .save()
          .then((teacher) => {
            res.json({ teacher });
          })
          .catch((err) => {
            console.log(err);
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});
router.post("/login", async function (req, res, next) {
  let teacher = await Teacher.findOne({
    email: req.body.email,
  });
  if (!teacher) {
    res.status(404).send({ error: "Teacher Dont Exists", success: false });
  } else {
    const validPassword = await bcrypt.compare(
      req.body.password,
      teacher.password
    );
    if (!validPassword) {
      return res
        .status(404)
        .send({ error: "Invalid Password", success: false });
    }
    const token = jwt.sign(
      {
        _id: teacher._id,

        fullName: teacher.fullName,

        email: teacher.email,
      },
      "12bob12ou2b1ob"
    );
    const { _id, fullName, email } = teacher;

    res.status(201).json({ teacher: { _id, fullName, email }, token });
  }
});
module.exports = router;
