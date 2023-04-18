import React from 'react';
import backendCall from '../utils/backend';
import { useNavigate } from 'react-router-dom';
import { Context, useContext } from '../utils/context';

function Results () {
  const { getters, setters } = useContext(Context);

  const navigate = useNavigate();

  function advance () {
    const path = '/admin/quiz/' + getters.quizid + '/' + 'start';
    backendCall(path, {}, 'POST', { token: localStorage.getItem('token') }).then(() => {
    }).catch(error => {
      console.log(error);
      alert(error);
    })
  }

  function stopGame () {
    const path = '/admin/quiz/' + getters.quizid + '/end';
    backendCall(path, {}, 'POST', { token: localStorage.getItem('token') }).then(() => {
    }).catch(error => {
      console.log(error);
      alert(error);
    })
    setters.setSessionStarted(false);
  }

  function toHome () {
    navigate('/');
  }

  return (
        <>
            <div>
                {/* current session haven't ended yet */}
                {getters.sessionStarted && (
                    <div>
                        <button onClick={advance}>advance a question</button>
                        <button onClick={stopGame}>stop this quiz</button>
                    </div>
                )}
                {/* current session has ended */}
                Results: <br />
                <button onClick={toHome}>Back</button>
            </div>
        </>
  );
}

export default Results;
