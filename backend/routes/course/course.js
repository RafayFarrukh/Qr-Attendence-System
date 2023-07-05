var express = require('express');
var router = express.Router();
const Teacher = require('../../models/Teacher');
const Course = require('../../models/Course');
const Class = require('../../models/Class');

const xlsx = require('xlsx');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Read the uploaded Excel file and save courses to the database
router.post('/register/excel', upload.single('file'), (req, res) => {
  try {
    console.log('Excel registration being hit');
    if (!req.file) {
      console.log('No file');
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const workbook = xlsx.readFile(req.file.path);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const coursesData = xlsx.utils.sheet_to_json(worksheet);

    const coursePromises = coursesData.map(async (courseData) => {
      const existingCourse = await Course.findOne({
        courseCode: courseData.courseCode,
      });

      if (existingCourse) {
        console.log(
          `Course with code ${courseData.courseCode} already exists. Skipping...`,
        );
        return null;
      }

      const newCourse = new Course({
        courseCode: courseData.courseCode,
        courseShortName: courseData.courseShortName,
        courseName: courseData.courseName,
      });

      return newCourse.save();
    });

    Promise.all(coursePromises)
      .then((savedCourses) => {
        const validCourses = savedCourses.filter((course) => course !== null);

        return res.status(200).json({
          message: 'Courses registered successfully',
          courses: validCourses,
          success: true,
        });
      })
      .catch((error) => {
        console.error(error);
        return res.status(500).json({ message: 'Invalid Excel Sheet Format' });
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Invalid Excel Sheet Format' });
  }
});

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
router.get('/search', async (req, res) => {
  try {
    const searchQuery = req.query.course; // Get the search query from the request query parameters
    const regexQuery = new RegExp(`^${searchQuery}`, 'i');
    const courses = await Course.find({
      $or: [
        { courseName: { $regex: regexQuery } },
        { courseCode: { $regex: regexQuery } },
        { courseShortName: { $regex: regexQuery } },
      ],
    });
    if (courses.length === 0) {
      return res.status(404).json({
        message: 'No Courses found',
        success: true,
      });
    }
    return res.status(200).json({
      courses,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.patch('/course/:id', async (req, res) => {
  try {
    console.log('we are here');
    const courseId = req.params.id;
    const { courseCode, courseShortName, courseName } = req.body;
    console.log(req.body);
    // Find the course by ID
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Update the course fields
    course.courseCode = courseCode;
    course.courseShortName = courseShortName;
    course.courseName = courseName;

    // Save the updated course
    const updatedCourse = await course.save();

    res.status(200).json({
      message: 'Course updated successfully',
      course: updatedCourse,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
router.delete('/delete/:courseId', async (req, res) => {
  try {
    const { courseId } = req.params;

    // Find the course by its ID
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Delete the course from the database
    await course.remove();

    return res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
