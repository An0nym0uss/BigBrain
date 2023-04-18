import React from 'react';
import { Box, Button, TextField } from '@mui/material';
import backendCall from '../utils/backend';
import { useNavigate } from 'react-router-dom';
import AlertMsg from '../components/AlertMsg';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [alert, setAlert] = React.useState(null);

  const handleLogin = () => {
    if (email === '' || password === '') {
      alert('Email or password cannot be empty.');
      return;
    }
    backendCall('admin/auth/login', { email, password }, 'POST')
      .then(({ token }) => {
        localStorage.setItem('token', token);
        navigate('/');
      })
      .catch(err => {
        if (err.message) {
          setAlert(<AlertMsg message={err.message} successor={() => setAlert(null)} />)
        } else {
          console.error(err);
        }
      });
  }

  return (
    <>
      {alert}
      <Box sx={{ mt: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <TextField required id='login-email' label='Email' onChange={(e) => { setEmail(e.target.value) }} sx={{ mb: '20px' }} />
        <TextField required id='login-password' type='password' label='Password' onChange={(e) => { setPassword(e.target.value) }} sx={{ mb: '20px' }} />
        <Button variant='contained' onClick={handleLogin} sx={{ mb: '20px' }}>Login</Button>
        <p>Do not have an account? <a href='/register'>Sign Up here</a></p>
      </Box>
    </>
  );
}

export default Login;
