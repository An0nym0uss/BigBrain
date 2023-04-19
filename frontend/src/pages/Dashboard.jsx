/* eslint-disable no-console */

import { Button } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backendCall from '../utils/backend';
import Modal from '../components/Modal';
import GameBlock from '../components/GameBlock';
import AlertMsg from '../components/AlertMsg';

/**
 * Dashboard for admin, contains list of quizzes
 * @returns Dashboard Page
 */
const Dashboard = () => {
  const navigate = useNavigate();

  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [quizName, setQuizName] = useState('');
  const [quizList, setQuizList] = useState([]);
  const [alert, setAlert] = React.useState(null);
  const [refresh, setRefresh] = React.useState(false);

  React.useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    }
    getQuizHandler();
  }, [refresh]);

  const handleToggleRefresh = () => {
    setRefresh(prevRefresh => !prevRefresh);
  }

  const hideModalHandler = () => {
    setModalIsVisible(false);
  }

  const showModalHandler = () => {
    setModalIsVisible(true);
  }

  const handleLogout = () => {
    backendCall('/admin/auth/logout', {}, 'POST', { token: localStorage.getItem('token') })
      .then(() => {
        localStorage.removeItem('token');
        navigate('/login');
      })
      .catch((err) => {
        if (err.message) {
          setAlert(<AlertMsg message={err.message} successor={() => setAlert(null)} />)
        } else {
          console.error(err);
        }
      });
  }

  const newQuizHandler = (name) => {
    backendCall('/admin/quiz/new', { name }, 'POST', { token: localStorage.getItem('token') })
      .then(() => {
      })
      .catch(err => {
        if (err.message) {
          setAlert(<AlertMsg message={err.message} successor={() => setAlert(null)} />)
        } else {
          console.error(err);
        }
      });
    hideModalHandler();
    getQuizHandler();
  }

  const getQuizHandler = () => {
    backendCall('/admin/quiz', {}, 'GET', { token: localStorage.getItem('token') })
      .then((data) => {
        setQuizList(data.quizzes);
      })
      .catch(err => {
        if (err.message) {
          setAlert(<AlertMsg message={err.message} successor={() => setAlert(null)} />)
        } else {
          console.error(err);
        }
      });
  }

  const display = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', rowGap: '20px', margin: '20px' }}>
        {quizList.map((data, index) => <GameBlock key={index} gameData={data} refresh={handleToggleRefresh} />)}
      </div>
    )
  }

  return (
    <div>
      {alert}

      {modalIsVisible && (
        <Modal hide={hideModalHandler}>
          Enter a name for the new quiz <br />
          <input type="text" onChange={(event) => setQuizName(event.target.value)} /> <br />
          <button onClick={() => newQuizHandler(quizName)}> Confirm </button>
          <button onClick={hideModalHandler}> Cnacel </button>
        </Modal>
      )}
      <div style={{ margin: '20px' }}>
        <Button variant='contained' onClick={showModalHandler} sx={{ mr: '170px' }}>New quiz</Button>
        <Button variant='outlined' onClick={handleLogout}>Logout</Button>
      </div>
      {display()}
    </div>
  );
}

export default Dashboard;
