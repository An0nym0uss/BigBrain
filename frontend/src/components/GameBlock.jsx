import styles from './GameBlock.module.css';
import React, { useState, useEffect } from 'react';
import backendCall from '../utils/backend';
import Modal from '../components/Modal';
import { useNavigate } from 'react-router-dom';
import { Context, useContext } from '../utils/context';

function GameBlock (props) {
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [sessionId, setSessionId] = useState(0);
  const { setters } = useContext(Context);

  const navigate = useNavigate();

  useEffect(() => {
    console.log('sessionid:' + sessionId);
    setters.setSessionid(sessionId);
  }, [sessionId]);

  function hideModalHandler () {
    setModalIsVisible(false);
  }
  function showModalHandler () {
    setModalIsVisible(true);
  }

  function startGame () {
    const path = '/admin/quiz/' + props.data.id + '/' + 'start';
    backendCall(path, {}, 'POST', { token: localStorage.getItem('token') }).then(() => {
    }).catch(error => {
      console.log(error);
      alert(error);
    })
    setSessionId(Date.now());
    showModalHandler();
    setters.setQuizid(props.data.id);
    setters.setSessionStarted(true);
    setters.setSessionid(sessionId);
  }

  function toEditPage () {
    navigate(`/edit/${props.data.id}`);
  }

  function clipboard () {
    navigator.clipboard.writeText('localhost:3000/play' + sessionId);
  }

  return (
        <div className={styles.block} id={props.data.id}>
            {modalIsVisible && (
                <Modal hide={hideModalHandler}>
                    <div>
                        Game started!
                        Copy the session id to start a game
                        Session id: {sessionId}
                        <button onClick={clipboard}> copy </button>
                    </div>
                </Modal>
            )}
            {props.data.name}
            <button className={styles.editbtm} onClick={toEditPage}> Eidt </button>
            <button className={styles.startbtm} onClick={startGame}> start game </button>
        </div>
  );
}

export default GameBlock;
