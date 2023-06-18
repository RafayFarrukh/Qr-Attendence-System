var express = require('express');
var router = express.Router();
const Teacher = require('../../models/Teacher');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const xlsx = require('xlsx');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const apiauth = require('../../middleware/apiAuth');
// Read the uploaded Excel file and save teachers to the database
router.post('/register/excel', apiauth, upload.single('file'), (req, res) => {
  try {
    const teacher = req.user;
    console.log('xlsx  teacher eing hit');
    if (!req.file) {
      console.log('no file');
      return res.status(400).json({ message: 'No file uploaded' });
    }
    console.log(teacher);
    // Read the uploaded Excel file
    if (teacher?.admin) {
      // Read the uploaded Excel file
      const workbook = xlsx.readFile(req.file.path);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];

      // Convert the Excel data to JSON
      const teachersData = xlsx.utils.sheet_to_json(worksheet);

      // Save each teacher to the database
      const teachers = teachersData.map((teacherData) => {
        // Create a new teacher object

        const teacher = new Teacher({
          fullName: teacherData.fullName,
          email: teacherData.email,
          password: teacherData.password,
          admin: teacherData.admin || false,
        });

        // Save the teacher to the database
        return teacher.save();
      });

      // Wait for all the teacher saving promises to resolve
      Promise.all(teachers)
        .then((savedTeachers) => {
          // Filter out any null values (failed teacher saves)
          const validTeachers = savedTeachers.filter(
            (teacher) => teacher !== null,
          );

          return res.status(200).json({
            message: 'Teachers registered successfully',
            teachers: validTeachers,
            success: true,
          });
        })
        .catch((error) => {
          console.error(error);
          return res.status(500).json({ message: 'An Error Occured' });
        });
    } else {
      res.status(401).json({
        message: 'You are not authorized for this action',
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Same Teacher cant be inserted' });
  }
});

router.post('/register', async function (req, res, next) {
  const { fullName, email, password } = req.body;
  if (!email || !password || !fullName) {
    return res.status(422).json({ error: 'please add all the fields' });
  }
  Teacher.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        return res.status(422).json({
          error: 'Teacher Already Exists',
          success: false,
        });
      }
      // bcrypt.hash(password, 12).then((hashedpassword) => {
      const teacher = new Teacher({
        fullName,
        email,
        password: password,
      });

      teacher
        .save()
        .then((teacher) => {
          res.json({ teacher });
        })
        .catch((err) => {
          console.log(err);
        });
      // });
    })
    .catch((err) => {
      console.log(err);
    });
});
router.post('/login', async function (req, res, next) {
  let teacher = await Teacher.findOne({
    email: req.body.email,
  });
  if (!teacher) {
    res.status(404).send({ error: 'User Dont Exists', success: false });
  } else {
    const validPassword = await bcrypt.compare(
      req.body.password,
      teacher.password,
    );
    // const validPassword = req.body.password == teacher.password;
    if (!validPassword) {
      return res
        .status(404)
        .send({ error: 'Invalid Password', success: false });
    }
    const token = jwt.sign(
      {
        _id: teacher._id,

        fullName: teacher.fullName,

        email: teacher.email,
        image: teacher.image,
        admin: teacher.admin,
      },
      '12bob12ou2b1ob',
    );
    const { _id, fullName, email, image, admin } = teacher;

    res
      .status(201)
      .json({ teacher: { _id, fullName, email, image, admin }, token });
  }
});

router.get('/all', async (req, res) => {
  try {
    // Fetch all teachers from the database
    const teacher = req.user;
    // if (teacher?.admin) {
    const teachers = await Teacher.find();

    return res.status(200).json({
      teachers,
      success: true,
    });
  } catch (error) {
    //   else {
    //     res.status(401).json({
    //       message: 'You are not authorized for this action',
    //     });
    //   }
    // }
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Assuming you have already imported the necessary dependencies and set up your Express.js app

// Backend API route for searching teachers
router.get('/search', async (req, res) => {
  try {
    const searchQuery = req.query.teacher; // Get the search query from the request query parameters
    const regexQuery = new RegExp(`${searchQuery}`, 'i');
    const teachers = await Teacher.find(
      {
        $or: [
          { fullName: { $regex: regexQuery } }, // Case-insensitive search on the fullName field
          { email: { $regex: regexQuery } }, // Case-insensitive search on the email field
        ],
      },
      { password: 0 }, // Exclude the password field from the query results
    );

    if (teachers.length === 0) {
      return res.status(404).json({
        message: 'No teachers found',
        success: true,
      });
    }

    return res.status(200).json({
      teachers,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
