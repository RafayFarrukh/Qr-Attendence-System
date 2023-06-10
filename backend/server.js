const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const dbConnect = require('./db/db-connect.js');
const teacherAuth = require('./routes/auth/teacher');
const studentAuth = require('./routes/auth/student');
const teacher = require('./routes/teacher/teacher.js');
const course = require('./routes/course/course');
const StudentClass = require('./routes/class/class');
const studentProfile = require('./routes/student/student.js');
const cors = require('cors');
const apiauth = require('./middleware/apiAuth.js');
// const attendanceArray = require('./routes/attendance/attendance');
const app = express();
var server = http.createServer(app);
var io = socketIO(server, {
  cors: {
    origin: '*',
  },
});
const attendance = require('./routes/attendance/attendance', io);
const studentAttendance = require('./routes/attendance/student/attendance.js');
require('dotenv').config();
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    return res.status(200).json({});
  }
  next();
});

//path
//auth
app.use('/api/auth/teacher', teacherAuth);
app.use('/api/auth/student', studentAuth);
//course
app.use('/api/course/teacher', apiauth, course);
//class
app.use('/api/class/teacher', apiauth, StudentClass);
// app.use("/api/class/teacher/attendance",apiauth, attendance);
app.use('/api/class/teacher/attendance', apiauth, attendance);
app.use('/api/class/student/attendance', apiauth, studentAttendance);
app.use('/api/class/student', apiauth, studentProfile);
app.use('/api/teacher', apiauth, teacher);

app.get('/', (req, res) => {
  res.send('welcome to backend of Qr code');
});

const port = process.env.PORT || 5000;

// Initialize Socket.IO server
io.on('connection', (socket) => {
  console.log('Connected to socket!', socket.id);
  socket.on('connect', () => {
    console.log('Connected to socket!');
  });
  // console.log(attendanceArray, 'attendance');
  socket.emit('attendanceUpdated', 'attendgfgfance');
  // Emit a welcome message to the client
  socket.on('disconnect', (reason) => {
    console.log('a user disconnected', socket.id);
  });
});

const startServer = async () => {
  try {
    await dbConnect(process.env.MONGO_URL);
    console.log('db-connected');
    server.listen(port, () => {
      console.log(`server is listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
global.io = io;
