var express = require("express");
var router = express.Router();
const Teacher = require("../../models/Teacher");
const Course = require("../../models/Course");

router.post("/addCourse", async function (req, res, next) {
  try {
    const teacher = req.user;
    // console.log(teacher.admin);

    if (teacher.admin) {
      const newCourse = new Course({
        ...req.body,
      });

      const course_ = await newCourse.save();
      // course_.teacher = teacher;

      await course_.save();
      res.status(200).json({
        message: "Course successfully created",
        course_,
      });
    } else {
      res.status(401).json({
        message: "You are not authorized for this action",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
module.exports = router;
