import React, { useState } from 'react';
import backendCall from '../utils/backend';
import Modal from '../components/Modal';
import { useNavigate } from 'react-router-dom';
import AlertMsg from './AlertMsg';
import { Button } from '@mui/material';
import styled from 'styled-components';
import config from '../utils/config';

const Block = styled.div`
  position: relative;
  border: 1px solid black;
  border-radius: 10px;
  width: 380px;
  min-height: 120px;
  padding: 10px;
`;

/**
 * A block of quiz that allows to start, view, edit and delete
 * @param {gameData, refresh} param0 refresh: tells dashboard to handle refresh
 * @returns GameBlock div
 */
const GameBlock = ({ gameData, refresh }) => {
  const navigate = useNavigate();

  const [sessionId, setSessionId] = useState(gameData.active);
  const [alert, setAlert] = useState(null);
  const [openResultModal, setOpenResultModal] = useState(false);

  const startGame = () => {
    const path = `/admin/quiz/${gameData.id}/start`;
    backendCall(path, {}, 'POST', { token: localStorage.getItem('token') })
      .then(() => {
      })
      .catch(err => {
        if (err.message) {
          setAlert(<AlertMsg message={err.message} successor={() => setAlert(null)} />);
        } else {
          console.error(err);
        }
      });

    backendCall(`/admin/quiz/${gameData.id}`, {}, 'GET', { token: localStorage.getItem('token') })
      .then((data) => {
        setSessionId(data.active);
      })
      .catch(err => {
        if (err.message) {
          setAlert(<AlertMsg message={err.message} successor={() => setAlert(null)} />);
        } else {
          console.error(err);
        }
      });
  }

  const stopGame = () => {
    console.log('quizid:' + gameData.id);
    const path = '/admin/quiz/' + gameData.id + '/end';
    backendCall(path, {}, 'POST', { token: localStorage.getItem('token') })
      .then(() => {
      })
      .catch(err => {
        if (err.message) {
          setAlert(<AlertMsg message={err.message} successor={() => setAlert(null)} />);
        } else {
          console.error(err);
        }
      });
    setSessionId(null);
    setOpenResultModal(true);
  }

  const deleteGame = () => {
    backendCall(`/admin/quiz/${gameData.id}`, {}, 'DELETE', { token: localStorage.getItem('token') })
      .then(() => {
        refresh();
      })
      .catch(err => {
        if (err.message) {
          setAlert(<AlertMsg message={err.message} successor={() => setAlert(null)} />);
        } else {
          console.error(err);
        }
      });
  }

  const clipboard = () => {
    navigator.clipboard.writeText(`${config.BASE_NAME}/play/${sessionId}`);
  }

  const toResult = () => {
    navigate(`/result/${gameData.id}`);
  }

  const ToResultModal = () => {
    return (
      <Modal hide={() => setOpenResultModal(false)}>
        Do you want to go to the result page? <br />
        <div style={{ marginTop: '20px' }}>
          <button onClick={() => setOpenResultModal(false)} style={{ marginRight: '20px' }}>no</button>
          <button onClick={toResult}>yes</button>
        </div>
      </Modal>
    );
  }

  const SessionDisplay = () => {
    return (
      <div style={{ marginBottom: '50px' }}>
        <h4 style={{ marginBottom: '5px' }}>Session ID: {sessionId}</h4>
        <Button variant='outlined' size='small' onClick={clipboard}>copy link</Button>
      </div>
    );
  }

  return (
    <>
      {alert}
      {console.log(gameData)}
      {openResultModal && <ToResultModal />}
      <Block>
        <div style={{ maxWidth: '300px' }}>
          <h3 style={{ margin: '0' }}>{gameData.name}</h3>
        </div>
        <Button variant='outlined' onClick={() => navigate(`/edit/${gameData.id}`)} style={{ position: 'absolute', bottom: '10px', left: '148px' }}>Edit</Button>
        <Button variant='outlined' color='error' onClick={deleteGame} disabled={sessionId !== null} style={{ position: 'absolute', bottom: '10px', left: '10px' }}>delete</Button>
        {sessionId !== null && <SessionDisplay />}
        <Button variant='outlined' color='secondary' onClick={toResult} style={{ position: 'absolute', top: '10px', right: '10px' }} >View game</Button>
        {
          sessionId !== null
            ? <Button variant='contained' onClick={stopGame} style={{ position: 'absolute', bottom: '10px', right: '10px' }}>stop game</Button>
            : <Button variant='contained' onClick={startGame} style={{ position: 'absolute', bottom: '10px', right: '10px' }}>start game</Button>
        }
      </Block>
    </>
  );
}

export default GameBlock;
