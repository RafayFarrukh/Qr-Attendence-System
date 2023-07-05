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
      console.log(course, 'course we are in create classs');
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
      console.log(selectedStudents, 'selectedStudents');
      // Fetch the student objects based on the IDs
      const studentObjects = await Student.find({
        _id: { $in: selectedStudents },
      });

      // Create a new array with the fetched student objects
      const students = studentObjects.map((student) => student.toObject());
      console.log(students, 'studentss in class------');
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

router.delete('/class/:classId/student/:studentId', async (req, res) => {
  try {
    const classId = req.params.classId;
    const studentId = req.params.studentId;
    console.log(studentId, classId);
    // Find the class by ID
    const classObj = await Class.findById(classId);

    if (!classObj) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Check if the student is enrolled in the class
    const studentIndex = classObj.students.findIndex(
      (student) => student._id.toString() === studentId,
    );

    if (studentIndex === -1) {
      return res
        .status(404)
        .json({ message: 'Student not found in the class' });
    }

    // Remove the student from the class
    classObj.students.splice(studentIndex, 1);

    // Save the updated class
    await classObj.save();

    return res.status(200).json({ message: 'Student removed from the class' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/addStudents/:id', async function (req, res, next) {
  try {
    const teacher = req.user;
    const id = req.params.id;
    if (teacher.admin) {
      const classInfo = await Class.findById(id).exec();

      const studentsArray = classInfo.students;

      const { username } = req.body;
      const students = await Student.find({
        email: { $regex: username, $options: 'i' },
      });
      if (students.length == 0) {
        console.log('studnt null');
        res.status(400).json({
          message: 'No Student Found',
        });
      }
      console.log(students, '-----------> student');
      const newStudentsArray = studentsArray.map((studentId) =>
        studentId.id.toString(),
      );
      console.log(newStudentsArray, 'newStudentsArray');
      const addedStudents = students.filter(
        (student) => !newStudentsArray.includes(student._id.toString()),
      );
      console.log(addedStudents, 'addedStudents');
      if (addedStudents.length === 0) {
        return res.status(400).json({
          message: 'Students are already added',
        });
      }
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

      // console.log(classInfo);
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

router.get('/class/:classId/students', async (req, res) => {
  try {
    const { classId } = req.params;

    // Find the class by classId and populate the students field
    const classObj = await Class.findById(classId);
    // console.log(classObj, '------> class obj');
    if (!classObj) {
      return res.status(404).json({ message: 'Class not found' });
    }
    const students = classObj.students.map((student) => student);
    // const students = classObj.students.map((student) =>
    //   Student.findById(student._id),
    // );
    const _students = students.map((student) => student._id);

    // Find students by their object IDs
    const foundStudents = [];
    for (let i = 0; i < _students.length; i++) {
      const studentId = _students[i];
      const student = await Student.findById(studentId).select('-password');
      if (student) {
        foundStudents.push(student);
      }
    }

    // console.log(foundStudents, '------> students obj');

    res.status(200).json({ foundStudents });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/search', async (req, res) => {
  try {
    const searchQuery = req.query.course;
    const regexQuery = new RegExp(`^${searchQuery}`, 'i');

    const classes = await Class.aggregate([
      {
        $lookup: {
          from: 'courses',
          localField: 'Course._id',
          foreignField: '_id',
          as: 'courseDetails',
        },
      },
      {
        $lookup: {
          from: 'students',
          localField: 'students._id',
          foreignField: '_id',
          as: 'students',
        },
      },
      {
        $match: {
          $or: [
            { 'courseDetails.courseName': { $regex: regexQuery } },
            { 'students.stdId': { $regex: regexQuery } },
            { 'teacher.email': { $regex: regexQuery } },
          ],
        },
      },
      {
        $project: {
          'Course._id': 1,
          'courseDetails': { $arrayElemAt: ['$courseDetails', 0] },
          'students._id': 1,
          'teacher.email': 1,
        },
      },
    ]);

    if (classes.length === 0) {
      return res.status(404).json({
        message: 'No classes found',
        success: true,
      });
    }

    return res.status(200).json({
      classes,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
