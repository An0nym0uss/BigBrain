import { Button } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import backendCall from '../utils/backend';

const Dashboard = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    }
  }, []);

  const handleLogout = () => {
    backendCall('/admin/auth/logout', {}, 'POST', { token: localStorage.getItem('token') })
      .then(() => {
        localStorage.removeItem('token');
        navigate('/login');
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div>
      Dashboard!!
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
}

export default Dashboard;
