var express = require('express');
var router = express.Router();
const Student = require('../../models/Student');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const xlsx = require('xlsx');
const multer = require('multer');
const upload = multer({ dest: '.././uploads/' });
// Read the image file from disk
router.post('/register/excel', upload.single('file'), (req, res) => {
  try {
    console.log('xlsx eing hit');
    if (!req.file) {
      console.log('no file');
      return res.status(400).json({ message: 'No file uploaded' });
    }
    // Read the uploaded Excel file
    const workbook = xlsx.readFile(req.file.path);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    // Convert the Excel data to JSON
    const studentsData = xlsx.utils.sheet_to_json(worksheet);

    // Save each student to the database
    const students = studentsData.map((studentData) => {
      // Create a new student object
      const student = new Student({
        stdId: studentData.stdId,
        email: studentData.email,
        password: studentData.password,
        fullName: studentData.fullName,
      });

      // Save the student to the database
      return student.save();
    });

    // Wait for all the student saving promises to resolve
    Promise.all(students)
      .then((savedStudents) => {
        // Filter out any null values (failed student saves)
        const validStudents = savedStudents.filter(
          (student) => student !== null,
        );

        return res.status(200).json({
          message: 'Students registered successfully',
          students: validStudents,
          success: true,
        });
      })
      .catch((error) => {
        console.error(error);
        return res
          .status(500)
          .json({ message: 'Same Student cant be inserted' });
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Same Student cant be inserted' });
  }
});

router.post('/register', async function (req, res, next) {
  const { fullName, email, password, stdId } = req.body;
  if (!email || !password || !fullName) {
    return res.status(422).json({ error: 'please add all the fields' });
  }

  Student.findOne({ $or: [{ email: email }, { stdId: stdId }] })
    .then((existingStudent) => {
      if (existingStudent) {
        let errorMessage = '';
        if (existingStudent.email === email) {
          errorMessage = 'Email already exists';
        } else if (existingStudent.stdId === stdId) {
          errorMessage = 'Student ID already exists';
        }
        return res.status(422).json({
          error: errorMessage,
          success: false,
        });
      }

      const student = new Student({
        stdId,
        fullName,
        email,
        password: password,
      });

      student
        .save()
        .then((student) => {
          res.json({ student });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({ error: 'An error occurred' });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: 'An error occurred' });
    });
});

// router.post('/register/otp', async function (req, res, next) {
//   const { fullName, email, password, stdId, imageUrl, studentImage } = req.body;
//   if (!email || !password || !fullName) {
//     return res
//       .status(422)
//       .json({ error: 'Please fill in all the required fields' });
//   }

//   // Generate OTP
//   const otp = Math.floor(1000 + Math.random() * 9000);

//   // Create email transporter
//   const transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 587,
//     secure: false,
//     requireTLS: true,
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });

//   // Set email options
//   const mailOptions = {
//     from: `"QR Attendance App" <${process.env.EMAIL_USER}>`,
//     to: email,
//     subject: 'Verify your email address',
//     html: `
//     <div style="background-color: #fafafa; padding: 20px; border-radius: 10px;">
//   <div style="text-align: center;">
//     <h1 style="color: #235789;">Welcome to QR Attendance App</h1>
//   </div>
//   <hr style="border: none; border-top: 1px solid #ddd;">
//   <p style="font-size: 16px; color: #333; line-height: 1.5;">
//     Hello ${fullName},<br><br>
//     Thank you for signing up for QR Attendance App. To start using the app, please verify your email address by entering the OTP below:<br><br>
//     Your verification OTP is: <strong style="color: #235789;">${otp}</strong><br><br>
//     This OTP is valid for 5 minutes.<br><br>
//     If you did not sign up for QR Attendance App, please ignore this email.<br><br>
//     Thanks,<br>
//     QR Attendance App team
//   </p>
//   <hr style="border: none; border-top: 1px solid #ddd;">
//   <p style="font-size: 12px; color: #777; text-align: center;">
//     This email was sent by QR Attendance App. If you did not sign up for this service, please ignore this email.
//   </p>
// </div>

//   `,
//   };

//   // Send email with OTP
//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.log(error);
//       return res.status(500).json({ error: 'Failed to send email OTP' });
//     }
//     console.log('Email sent: ' + info.response);

//     // Store OTP in database with expiration time
//     const otpExpiration = new Date().getTime() + 600000; // OTP expires in 10 minutes
//     const otpData = {
//       email: email,
//       otp: otp,
//       expiration: otpExpiration,
//     };
//     Student.updateOne({ email: email }, { $set: { otpData: otpData } })
//       .then((result) => {
//         console.log(result);
//       })
//       .catch((err) => {
//         console.log(err);
//       });

//     // Hash password and save user to database
//     bcrypt.hash(password, 12).then((hashedpassword) => {
//       const user = new Student({
//         fullName,
//         email,
//         password: hashedpassword,
//         stdId,
//         imageUrl,
//         studentImage,
//         verified: false,
//         otp,
//       });

//       user
//         .save()
//         .then((user) => {
//           res.json({ user });
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//     });

//     res.status(200).json({ message: 'OTP sent successfully' });
//   });
// });

// router.post('/verify-otp', async function (req, res, next) {
//   const { email, otp } = req.body;
//   if (!email || !otp) {
//     return res
//       .status(422)
//       .json({ error: 'Please fill in all the required fields' });
//   }

//   // Check if OTP exists in database and is not expired
//   Student.findOne({ email: email })
//     .then((user) => {
//       console.log(user);
//       if (!user) {
//         return res.status(422).json({ error: 'Invalid email address' });
//       }
//       if (!user.otp) {
//         return res
//           .status(422)
//           .json({ error: 'OTP not generated for this email address' });
//       }
//       if (user.otp !== otp) {
//         return res.status(422).json({ error: 'Invalid OTP' });
//       }
//       // if (user.otpData.expiration < new Date().getTime()) {
//       //   return res.status(422).json({ error: 'OTP has expired' });
//       // }
//       console.log(user, 'user in verify email');
//       // Remove OTP data
//       user.otp = undefined;
//       user.verified = true;
//       user
//         .save()
//         .then(res.status(200).json({ message: 'User verified successfully' }))
//         .catch((err) => {
//           console.log(err);
//           res.status(500).json({ error: 'Internal server error' });
//         });
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(500).json({ error: 'Internal server error' });
//     });
// });

router.post('/login', async function (req, res, next) {
  console.log('login eing hit');
  let user = await Student.findOne({
    email: req.body.email,
  });
  if (!user) {
    res
      // .status(404)
      .json({ error: 'Student Dont Exists', success: false });
  } else {
    // const validPassword = await bcrypt.compare(
    //   req.body.password,
    //   user.password,
    // );
    const validPassword = req.body.password == user.password;

    if (!validPassword) {
      return (
        res
          // .status(404)
          .json({ error: 'Invalid Password', success: false })
      );
    }
    const token = jwt.sign(
      {
        _id: user._id,
        stdId: user.stdId,
        fullName: user.fullName,

        email: user.email,
      },
      '12bob12ou2b1ob',
    );
    const { _id, fullName, email, stdId } = user;

    res
      .status(201)
      .json({ user: { _id, fullName, email, stdId }, token, success: true });
  }
});

router.get('/all', async (req, res) => {
  try {
    const students = await Student.find();

    return res.status(200).json({
      students,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/search', async (req, res) => {
  try {
    const searchQuery = req.query.student; // Get the search query from the request query parameters
    const regexQuery = new RegExp(`${searchQuery}`, 'i');
    const students = await Student.find(
      {
        $or: [
          { fullName: { $regex: regexQuery } }, // Case-insensitive search on the fullName field
          { email: { $regex: regexQuery } }, // Case-insensitive search on the email field
        ],
      },
      { password: 0 }, // Exclude the password field from the query results
    );
    if (students.length === 0) {
      return res.status(404).json({
        message: 'No Students found',
        success: true,
      });
    }
    return res.status(200).json({
      students,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});
module.exports = router;
