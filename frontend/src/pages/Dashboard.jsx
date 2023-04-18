/* eslint-disable no-console */

import styles from './Dashboard.module.css';
import { Button } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backendCall from '../utils/backend';
import Modal from '../components/Modal';
import GameBlock from '../components/GameBlock';
import { Context, useContext } from '../utils/context';
import AlertMsg from '../components/AlertMsg';

const Dashboard = () => {
  const navigate = useNavigate();

  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [toresult, setToresult] = useState(false);
  const [quizName, setQuizName] = useState('');
  const [quizList, setQuizList] = useState([]);
  const [alert, setAlert] = React.useState(null);

  const { getters, setters } = useContext(Context);

  React.useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    }
    getQuizHandler();
  }, []);

  const hideModalHandler = () => {
    setModalIsVisible(false);
  }

  const showModalHandler = () => {
    setModalIsVisible(true);
  }

  const hideToresultHandler = () => {
    setToresult(false);
  }

  const showToresultHandler = () => {
    setToresult(true);
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

  const stopGame = () => {
    console.log('quizid:' + getters.quizid);
    const path = '/admin/quiz/' + getters.quizid + '/end';
    backendCall(path, {}, 'POST', { token: localStorage.getItem('token') })
      .then(() => {
      })
      .catch(err => {
        if (err.message) {
          setAlert(<AlertMsg message={err.message} successor={() => setAlert(null)} />)
        } else {
          console.error(err);
        }
      });
    setters.setSessionStarted(false);
    showToresultHandler();
  }

  const display = () => {
    return (
      <div className={styles.gameContainer}>
        {quizList.map((data, index) => <GameBlock key={index} data={data} />)}
      </div>
    )
  }

  const toResultPage = () => {
    navigate(`/result/${getters.sessionid}`);
  }

  return (
    <div>
      {alert}
      Dashboard!
      <Button onClick={handleLogout}>Logout</Button>

      {modalIsVisible && (
        <Modal hide={hideModalHandler}>
          Enter a name for the new quiz <br />
          <input type="text" onChange={(event) => setQuizName(event.target.value)} /> <br />
          <button onClick={() => newQuizHandler(quizName)}> Confirm </button>
          <button onClick={hideModalHandler}> Cnacel </button>
        </Modal>
      )}
      {toresult && (
        <Modal hide={hideModalHandler}>
          Do you want to go to the result page? <br />
          <button onClick={toResultPage}>yes</button>
          <button onClick={hideToresultHandler}>no</button>
        </Modal>
      )}
      <Button onClick={showModalHandler}>New quiz</Button>
      <Button onClick={stopGame}> stop current game </Button>
      <Button onClick={toResultPage}> manage current game </Button>
      {display()}
    </div>
  );
}

export default Dashboard;
