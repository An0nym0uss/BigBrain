import { Box, Button, TextField } from '@mui/material';
import React from 'react';
import AlertMsg from '../components/AlertMsg';
import { useNavigate } from 'react-router-dom';

/**
 * Asks player to enter url or session id to join a running game.
 * @returns Join Page
 */
const Join = () => {
  const navigate = useNavigate();

  const [sessionId, setSessionid] = React.useState('');
  const [alert, setAlert] = React.useState(null);

  const joinSession = () => {
    if (!sessionId) {
      setAlert(<AlertMsg message='url or session ID cannot be empty' successor={() => setAlert(null)} />);
      return;
    }
    if (sessionId.includes('play')) {
      const id = sessionId.split('/').pop();
      if (id) {
        navigate(`/play/${id}`);
      }
    } else {
      navigate(`/play/${sessionId}`);
    }
  }

  return (
    <Box style={{ marginTop: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {alert}
      <h4>Please input url or session id below</h4>
      <TextField label='url or session id' size='small' onChange={(e) => { setSessionid(e.target.value) }}></TextField>
      <Button variant='contained' onClick={joinSession} sx={{ mt: '20px' }}>join game</Button>
      <p>OR</p>
      <Button variant='contained' size='large' color='secondary' onClick={() => { navigate('/login') }}>Sign in as Admin</Button>
    </Box>
  );
}

export default Join;
