import React from 'react';
import backendCall from '../utils/backend';
import { useNavigate, useParams } from 'react-router-dom';
import AlertMsg from '../components/AlertMsg';
import { Button } from '@mui/material';

const Results = () => {
  const { qid } = useParams();
  const [sessionId, setSessionId] = React.useState(null);
  const [alert, setAlert] = React.useState(null);

  const navigate = useNavigate();

  React.useEffect(() => {
    backendCall(`/admin/quiz/${qid}`, {}, 'GET', { token: localStorage.getItem('token') })
      .then((data) => {
        console.log(data);
        setSessionId(data.active);
      })
      .catch(err => {
        if (err.message) {
          setAlert(<AlertMsg message={err.message} successor={() => setAlert(null)} />)
        } else {
          console.error(err);
        }
      });
  }, []);

  const advance = () => {
    const path = '/admin/quiz/' + qid + '/' + 'start';
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
    const path = '/admin/quiz/' + qid + '/end';
    backendCall(path, {}, 'POST', { token: localStorage.getItem('token') })
      .then(() => {
        setSessionId(null);
      })
      .catch(err => {
        if (err.message) {
          setAlert(<AlertMsg message={err.message} successor={() => setAlert(null)} />)
        } else {
          console.error(err);
        }
      });
  }

  const toDashboard = () => {
    navigate('/');
  }

  return (
    <div style={{ margin: '20px' }}>
      {alert}
      <Button variant='outlined' onClick={(toDashboard)} sx={{ mb: '20px' }}>Back</Button>
      <div>
        {/* current session haven't ended yet */}
        {sessionId === null
          ? <div>
            Results: <br />
          </div>
          : <div>
            <button onClick={advance}>advance a question</button>
            <button onClick={stopGame}>stop this quiz</button>
          </div>
        }
      </div>
    </div>
  );
}

export default Results;
