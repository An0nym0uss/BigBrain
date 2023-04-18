import React from 'react';
import { Box, Button, TextField } from '@mui/material';
import backendCall from '../utils/backend';
import { useNavigate } from 'react-router-dom';
import AlertMsg from '../components/AlertMsg';

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [alert, setAlert] = React.useState(null);

  const register = () => {
    if (email === '' || password === '') {
      const errMsg = 'Email or password cannot be empty.';
      setAlert(<AlertMsg message={errMsg} successor={() => setAlert(null)} />)
      return;
    }
    if (name === '') {
      const errMsg = 'Name cannot be empty.';
      setAlert(<AlertMsg message={errMsg} successor={() => setAlert(null)} />)
      return;
    }
    backendCall('admin/auth/register', { email, password, name }, 'POST')
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
        <TextField required id='register-email' label='Email' onChange={(e) => { setEmail(e.target.value) }} sx={{ mb: '20px' }} />
        <TextField required id='register-password' type='password' label='Password' onChange={(e) => { setPassword(e.target.value) }} sx={{ mb: '20px' }} />
        <TextField required id='register-name' label='name' onChange={(e) => { setName(e.target.value) }} sx={{ mb: '20px' }} />
        <Button variant='contained' onClick={register}>Sign Up</Button>
        <p>Already have an account? <a href='/login'>Login here</a></p>
      </Box>
    </>
  );
}

export default Register;
