import { Button, TextField } from '@mui/material';
import React from 'react';
import AlertMsg from '../components/AlertMsg';
import backendCall from '../utils/backend';

const Join = () => {
  const [sessionId, setSessionid] = React.useState('');
  const [name, setName] = React.useState('');
  const [alert, setAlert] = React.useState(null);

  const joinGame = () => {
    if (!sessionId) {
      setAlert(<AlertMsg message='url or session ID cannot be empty' successor={() => setAlert(null)} />);
      return;
    }
    if (!name) {
      setAlert(<AlertMsg message='name cannot be empty' successor={() => setAlert(null)} />);
      return;
    }
    if (sessionId.includes('/play/join/')) {
      const id = sessionId.split('/').pop();
      console.log(id);
      setSessionid(id);
    }
    backendCall(`/play/join/${sessionId}`, { name: name }, 'POST')
      .then(({ playerId }) => {
        console.log(playerId);
      })
      .catch((err) => {
        if (err.message) {
          setAlert(<AlertMsg message={err.message} successor={() => setAlert(null)} />)
        } else {
          console.error(err);
        }
      });
  }

  return (
    <div style={{ marginTop: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {alert}
      <h4>Please input url or session id below</h4>
      <TextField label='url or session id' size='small' onChange={(e) => { setSessionid(e.target.value) }}></TextField>
      <TextField label='name' size='small' onChange={(e) => setName(e.target.value)} sx={{ mt: '20px' }}></TextField>
      <Button variant='contained' onClick={joinGame} sx={{ mt: '20px' }}>join game</Button>
    </div>
  );
}

export default Join;
