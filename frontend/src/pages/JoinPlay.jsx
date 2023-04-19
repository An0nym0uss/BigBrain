import { Box, Button, TextField } from '@mui/material';
import React from 'react';
import backendCall from '../utils/backend';
import { useNavigate, useParams } from 'react-router-dom';
import AlertMsg from '../components/AlertMsg';

const JoinPlay = () => {
  const { sid } = useParams();
  const navigate = useNavigate();

  const [name, setName] = React.useState('');
  const [alert, setAlert] = React.useState(null);

  const joinGame = () => {
    if (!name) {
      setAlert(<AlertMsg message='name cannot be empty' successor={() => setAlert(null)} />);
      return;
    }
    backendCall(`/play/join/${sid}`, { name }, 'POST')
      .then(({ playerId }) => {
        navigate(`/play/${sid}/${playerId}`);
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
    <Box style={{ marginTop: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {alert}
      <TextField label='name' size='small' onChange={(e) => setName(e.target.value)} sx={{ mt: '20px' }}></TextField>
      <div style={{ margin: '20px' }}>
      <Button variant='outlined' color='secondary' onClick={() => navigate('/play/join')} sx={{ mr: '20px' }}>Back</Button>
      <Button variant='contained' onClick={joinGame}>Join Game</Button>
      </div>
    </Box>
  );
}

export default JoinPlay;
