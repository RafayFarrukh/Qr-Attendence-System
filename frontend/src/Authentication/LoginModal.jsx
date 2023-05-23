import React, { useState, useEffect } from 'react';
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
import { useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';

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
  marginBottom: theme.spacing(4),
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: theme.palette.primary.main,
      borderRadius: theme.shape.borderRadius,
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.light,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.dark,
    },
  },
  '& .MuiInputBase-root': {
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.default,
    '&:hover': {
      backgroundColor: theme.palette.background.default,
    },
    '&.Mui-focused': {
      backgroundColor: theme.palette.background.default,
    },
  },
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1.5),
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
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
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform login logic with username and password
    // ...
  };

  const handleClose = () => {
    onClose();
    // navigate('/home');
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    // <Modal open={open} onClose={handleClose} disableScrollLock>
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
            label='Username'
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            variant='outlined'
            InputLabelProps={{
              style: {
                color: '#333333',
              },
            }}
          />
          <TextFieldStyled
            label='Password'
            type={showPassword ? 'text' : 'password'}
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant='outlined'
            InputLabelProps={{
              style: {
                color: '#333333',
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <EyeIconButton onClick={togglePasswordVisibility}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </EyeIconButton>
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
            Submit
          </SubmitButton>
          <ForgotPassword variant='body2'>Forgot Password?</ForgotPassword>
        </Form>
      </ModalContainer>
    </Modal>
  );
};

export default LoginModal;
