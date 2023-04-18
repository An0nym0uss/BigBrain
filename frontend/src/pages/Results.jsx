import React from 'react';
import backendCall from '../utils/backend';
import { useNavigate } from 'react-router-dom';
import { Context, useContext } from '../utils/context';
import AlertMsg from '../components/AlertMsg';

const Results = () => {
  const { getters, setters } = useContext(Context);
  const [alert, setAlert] = React.useState(null);

  const navigate = useNavigate();

  const advance = () => {
    const path = '/admin/quiz/' + getters.quizid + '/' + 'start';
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
  }

  const stopGame = () => {
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
  }

  const toHome = () => {
    navigate('/');
  }

  return (
    <>
      {alert}
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
