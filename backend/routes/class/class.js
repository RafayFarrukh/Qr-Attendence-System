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
    const courseCode = req.body.courseCode;
    const teacherEmail = req.body.teacher;

    if (teacher.admin) {
      const course = await Course.findOne({
        courseCode: courseCode,
      });
      console.log(course, 'course');
      const teacherInfo = await Teacher.findOne({
        email: teacherEmail,
      });

      if (!teacherInfo) {
        return res.status(400).json({
          message: 'Teacher does not exist',
          success: false,
        });
      }

      if (!course) {
        return res.status(401).json({
          message: 'Course does not exist',
          success: false,
        });
      }

      const selectedStudents = req.body.students || [];
      // Fetch the student objects based on the IDs
      const studentObjects = await Student.find({
        _id: { $in: selectedStudents },
      });

      // Create a new array with the fetched student objects
      const students = studentObjects.map((student) => student.toObject());
      console.log({
        teacher: teacherEmail,
        students: students,
        Course: course._id,
      });
      const newClass = new Class({
        teacher: teacherEmail,
        students: students,
        Course: course._id,
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
        message: 'You are not authorized for this action',
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
router.post('/batches/create', async function (req, res, next) {
  try {
    const students = await Student.find().exec();
    const batches = new Set(); // Use a Set to store unique batches

    for (let i = 0; i < students.length; i++) {
      const student = students[i];
      const { email } = student;
      const batch = email.substring(0, 8); // Extract the first 8 characters

      batches.add(batch); // Add the batch to the Set
    }

    res.status(200).json({
      message: 'Batches successfully created',
      batches: Array.from(batches), // Convert the Set to an array and include it in the response
    });
  } catch (error) {
    res.status(500).json({
      message: 'An error occurred while creating batches',
      error: error.message,
    });
  }
});
router.get('/students/batch/:batch', async function (req, res, next) {
  try {
    const batch = req.params.batch;
    const students = await Student.find({
      email: { $regex: batch, $options: 'i' },
    }).exec();
    res.status(200).json({ students });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error occurred while fetching students' });
  }
});

module.exports = router;
