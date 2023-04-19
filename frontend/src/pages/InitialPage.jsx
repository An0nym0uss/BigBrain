import { Box, Button } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Initial page that asks for sign in for admins
 * or play for guest users to just join a game.
 * @returns Initial Page
 */
const InitialPage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ mt: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Button variant='contained' size='large' onClick={() => navigate('/dashboard')}>Signin as Admin</Button>
      <p style={{ fontSize: '20px' }}>OR</p>
      <Button variant='contained' size='large' color='secondary' onClick={() => navigate('/play/join')}>Just Play</Button>
    </Box>
  );
}

export default InitialPage;
