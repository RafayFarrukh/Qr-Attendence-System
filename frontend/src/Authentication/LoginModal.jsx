import React, { useContext, useState, useEffect } from 'react';
import {
  Button,
  Modal,
  Box,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  styled,
} from '@mui/material';
import * as Loader from 'react-loader-spinner';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import BaseURL from '../services/BaseURL';
import { UserContext } from '../App';
const validationSchema = Yup.object().shape({
  email: Yup.string().required('Email is required').email('Invalid email'),
  password: Yup.string().required('Password is required'),
});
const ModalContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  height: 420,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[10],
  padding: theme.spacing(4),
  outline: 'none',
  borderRadius: theme.spacing(3),
  textAlign: 'center',
  overflow: 'hidden',
}));

const Title = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(6),
  fontWeight: 'bold',
}));

const Form = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

const TextFieldStyled = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderWidth: 2, // Adjust the border width as desired
      borderColor: theme.palette.primary.light, // Adjust the border color as desired
    },
  },
  '& .MuiOutlinedInput-notchedOutline': { display: 'none' },
  '& .MuiOutlinedInput-input': { padding: theme.spacing(1.5) },
  '& .Mui-focused': {
    '& fieldset': { borderColor: theme.palette.primary.light },
  },
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1.5),
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: theme.palette.primary.light,
    boxShadow: 'none',
  },
}));

const ForgotPassword = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const EyeIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

const LoginModal = ({ open, onClose }) => {
  const { state, dispatch } = useContext(UserContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const body = document.body;
    if (open) {
      body.style.overflow = 'hidden';
    } else {
      body.style.overflow = 'auto';
    }
    return () => {
      body.style.overflow = 'auto';
    };
  }, [open]);

  const handleSubmit = (e, setSubmitting) => {
    console.log({
      username,
      password,
    });
    e.preventDefault();
    setLoading(true);
    axios
      .post(`${BaseURL}/api/auth/teacher/login`, {
        email: username,
        password: password,
      })
      .then((resp) => {
        localStorage.setItem('Token', resp?.data?.token);
        localStorage.setItem('Teacher', JSON.stringify(resp?.data?.teacher));
        setLoading(false);
        dispatch({
          type: 'USER',
          payload: resp?.data?.teacher,
        });
        dispatch({
          type: 'FETCH_TOKEN',
          payload: resp?.data?.token,
        });
        navigate('/');
      })
      .catch((error) => {
        if (error?.response?.data?.success === false) {
          setError(error?.response?.data?.error);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const handleClose = () => {
    onClose();
    // navigate('/home');
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      disableScrollLock={true}
      style={{ overflow: 'hidden' }}
    >
      <ModalContainer>
        <Title variant='h5'>Login</Title>
        <Form onSubmit={handleSubmit}>
          <TextFieldStyled
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder='Enter your Email'
            InputLabelProps={{ style: { color: '#333333' } }}
          />{' '}
          <TextFieldStyled
            fullWidth
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Enter your Password'
            InputLabelProps={{ style: { color: '#fffff' } }}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  {' '}
                  <EyeIconButton onClick={togglePasswordVisibility}>
                    {' '}
                    {showPassword ? <VisibilityOff /> : <Visibility />}{' '}
                  </EyeIconButton>{' '}
                </InputAdornment>
              ),
            }}
          />
          <SubmitButton
            type='submit'
            variant='contained'
            color='primary'
            fullWidth
          >
            {loading ? (
              <Loader.TailSpin
                type='ThreeDots'
                color='#fff'
                height={25}
                width={30}
              />
            ) : (
              'Log in'
            )}
          </SubmitButton>
          {error && (
            <Typography
              variant='body2'
              color='error'
              sx={{ mt: '1rem', textAlign: 'left', fontSize: '1rem' }}
            >
              {error}
            </Typography>
          )}
          {/* <ForgotPassword variant='body2'>Forgot Password?</ForgotPassword> */}
        </Form>
      </ModalContainer>
    </Modal>
  );
};

export default LoginModal;
