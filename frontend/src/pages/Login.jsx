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
      const errMsg = 'Email or password cannot be empty.';
      setAlert(<AlertMsg message={errMsg} successor={() => setAlert(null)} />);
      return;
    }
    backendCall('admin/auth/login', { email, password }, 'POST')
      .then(({ token }) => {
        localStorage.setItem('token', token);
        navigate('/dashboard');
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
        <p>OR</p>
        <Button variant='contained' color='secondary' size='large' onClick={() => navigate('/play/join')}>Just Play</Button>
      </Box>
    </>
  );
}

export default Login;
