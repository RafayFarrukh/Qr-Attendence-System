var express = require('express');
var router = express.Router();
const Student = require('../../models/Student');
const Teacher = require('../../models/Teacher');
const Course = require('../../models/Course');
const Class = require('../../models/Class');

router.get('/totalclasses', async function (req, res, next) {
  try {
    const classes = await Class.find().populate('teacher', 'email').populate({
      path: 'courseDetails',
      select: 'courseCode courseShortName courseName',
    });

    res.status(200).json({
      success: true,
      classes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.post('/addClass', async function (req, res, next) {
  try {
    const teacher = req.user;
    // console.log(teacher.admin);
    const courseCode = req.body.courseCode;
    const teacherEmail = req.body.teacher;
    if (teacher.admin) {
      const course = await Course.findOne({
        courseCode: courseCode,
      });
      const teacherInfo = await Teacher.findOne({
        email: teacherEmail,
      });
      if (!teacherInfo) {
        return res.status(400).json({
          message: 'Teacher does not exist',
          success: false,
        });
      }
      if (!course)
        return res.status(401).json({
          message: 'Course does not exist',
          success: false,
        });
      const newClass = new Class({
        ...req.body,
        course,
      });
      const class_ = await newClass.save();
      class_.Course = course;
      class_.teacher = teacherInfo;
      await class_.save();

      res.status(200).json({
        message: 'Class successfully created',
        class_,
      });
    } else {
      res.status(401).json({
        message: 'You are not Authorized for this action',
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
router.post('/addStudents/:id', async function (req, res, next) {
  try {
    const teacher = req.user;
    const id = req.params.id;
    if (teacher.admin) {
      const classInfo = await Class.findById(id).exec();
      console.log(classInfo);
      const studentsArray = classInfo.students;
      console.log(studentsArray, 'studentsarray');
      const { username } = req.body;
      const students = await Student.find({
        email: { $regex: username, $options: 'i' },
      });
      for (let i = 0; i < students.length; i++) {
        let studentExists = false;
        for (let j = 0; j < studentsArray.length; j++) {
          if (students[i]._id.toString() === studentsArray[j].toString()) {
            studentExists = true;
            break;
          }
        }
        if (!studentExists) {
          studentsArray.push(students[i]._id);
          students[i].save();
        }
      }
      console.log(classInfo);
      await classInfo.save();
      res.status(200).json({
        message: 'Students successfully added',
        classInfo,
      });
    } else {
      res.status(401).json({
        message: 'You are not Authorized for this action',
      });
    }
  } catch (error) {}
});

module.exports = router;
