// const baseURL = 'https://qr-attendence-system-backend.vercel.app';
const baseURL = process.env.NODE_ENV==='development'? 'http://localhost:5000':'https://qr-attendence-system-backend.vercel.app'
export default baseURL;
