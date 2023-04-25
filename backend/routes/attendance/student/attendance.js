var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
// const io = require('../server');
const Student = require('../../../models/Student');
const Teacher = require('../../../models/Teacher');
const Course = require('../../../models/Course');
const Class = require('../../../models/Class');
const Attendance = require('../../../models/Attendance');

router.get('/calculateAttendance/:classId/students/:studentId', async function (req, res, next) {
  try {
    // Find the class by ID
    const classId = req.params.classId;
    const classInfo = await Class.findById(classId).exec();

    // Make sure the class exists
    if (!classInfo) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Find the student by ID
    const student = await Student.findById(req.params.studentId).exec();
      

    // Make sure the student exists
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Calculate the student's attendance for the class
     const attendances = await Attendance.find({ ClassId: classId, stdId: student.stdId }).exec();
    const totalClasses = await Attendance.find({ ClassId: classId }).distinct('date').exec();
    const attendedClasses = attendances.length;
    const attendancePercentage = (attendedClasses / totalClasses.length) * 100;
    // const totalClasses = await Attendance.find({ ClassId: classId }).distinct('date').exec();
    // console.log(classInfo,"Class Info")
    // let attendedClasses = 0;


     console.log(attendedClasses," attendedClasses")
    // const attendancePercentage = (attendedClasses / totalClasses) * 100;

    return res.status(200).json({
      message: 'Attendance fetched successfully',
      attendancePercentage,
      success: true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});






















module.exports = router;
