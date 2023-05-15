var express = require('express');
var router = express.Router();
const Teacher = require('../../models/Teacher');
const Course = require('../../models/Course');
const Class = require('../../models/Class');

router.post('/addCourse', async function (req, res, next) {
  try {
    const teacher = req.user;
    // console.log(teacher.admin);

    if (teacher.admin) {
      const courseCode = req.body.courseCode;
      const existingCourse = await Course.findOne({ courseCode });

      if (existingCourse) {
        return res.status(400).json({
          message: 'Course code already exists',
        });
      }

      const newCourse = new Course({
        ...req.body,
      });

      const course_ = await newCourse.save();
      // course_.teacher = teacher;

      await course_.save();
      res.status(200).json({
        message: 'Course successfully created',
        course_,
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
router.get('/showAllCourses', async function (req, res, next) {
  try {
    const teacherEmail = req.user.email;
    // console.log(teacherId);
    let courseList = await Class.find({
      'teacher.email': teacherEmail,
    })
      .populate('Course._id')
      .exec();
    // console.log(courseList.Course);
    console.log(courseList.map((course) => course.Course));
    // console.log(courseList.map((e)
    // =>e.teacher
    // ));
    if (!courseList)
      return res.status(401).json({
        message: 'Teacher is not teaching this class',
      });

    res.status(200).json({
      courseList,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
router.get('/showOneCourse/:id', async function (req, res, next) {
  try {
    const classId = req.params.id;
    const classObj = await Class.findById(classId)
      .populate('Course._id')
      .exec();
    if (!classObj) {
      return res.status(404).json({ message: 'Class not found' });
    }
    return res.status(200).json({ classObj });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// students courses

router.get('/showAllCourses/student', async function (req, res, next) {
  try {
    const studentEmail = req.user._id;

    let courseList = await Class.find({
      'students._id': studentEmail,
    })
      .populate('Course._id')
      .exec();

    if (!courseList || courseList.length === 0) {
      return res.status(404).json({
        message: 'Student is not enrolled in any class',
      });
    }

    res.status(200).json({
      courseList,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
router.get('/teachers', async function (req, res, next) {
  try {
    const teachers = await Teacher.find().exec();
    res.status(200).json({ teachers });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch teachers' });
  }
});

// Fetch courses
router.get('/courses', async function (req, res, next) {
  try {
    const courses = await Course.find().exec();
    res.status(200).json({ courses });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch courses' });
  }
});
module.exports = router;
