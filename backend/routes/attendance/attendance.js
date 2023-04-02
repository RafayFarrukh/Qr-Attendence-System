var express = require("express");
var router = express.Router();
const Student = require("../../models/Student");
const Teacher = require("../../models/Teacher");
const Course = require("../../models/Course");
const Class = require("../../models/Class");
const Attendance = require("../../models/Attendance");
router.get(
  "/takeAttendence/:classId/students/:studentId/attendance",
  async function (req, res, next) {
    try {
      // Find the class by ID
      console.log("attendance started")
      const classId = req.params.classId;
      const classInfo = await Class.findById(classId).exec();
 console.log(classInfo)
      // Make sure the class exists
      if (!classInfo) {
        console.log("class not found")
        return res.status(404).json({ message: "Class not found" });
      }

      // Find the student by ID
      const student = await Student.findById(req.params.studentId).exec();
console.log(student)
      // Make sure the student exists
      if (!student) {
        console.log("student not found")
        return res.status(404).json({ message: "Student not found" });
      }

      // Check if the student is enrolled in the class

      // Check if student is enrolled in class
      let enrolled = false;
      for (let i = 0; i < classInfo.students.length; i++) {
        if (classInfo.students[i]._id.toString() === student._id.toString()) {
          enrolled = true;
          break;
        }
      }

      if (!enrolled) {
        console.log("Student is not enrolled in the class")

        return (
          
          res
            // .status(400).
            .json({
              message: "Student is not enrolled in the class",
              success: false,
            })
        );
      }
      // if (!classInfo.students.includes(student._id)) {
      //   return res
      //     .status(400)
      //     .json({ message: "Student is not enrolled in the class" });
      // }

      // Check if attendance has already been marked for the student on the current date
      const today = new Date().toISOString().slice(0, 10);
      const existingAttendance = await Attendance.findOne({
        classInfoId: classInfo._id,
        studentId: student.stdId,
        // date: today,
      });
      if (existingAttendance) {
        console.log(existingAttendance)
        console.log("Attendance has already been marked for this student on the current date")
        return (
          res
            .status(400)
            .json({
              message:
                "Attendance has already been marked for this student on the current date",
              success: false,
            })
        );
      }

      // Create new attendance record for the student in the classInfo
      const newAttendance = new Attendance({
        ClassId: classInfo._id,
        stdId: student.stdId,
        // date: today,
      });

      await newAttendance.save();
     console.log("attendance marked successfull")
      return res.status(200).json({
        message: "Attendance marked successfully",
        newAttendance,
        success: true,
      });
    } catch (err) {
      // console.error(err);
      // res.status(500).json({ message: "Internal server error" });
    }
  }
);
module.exports = router;
