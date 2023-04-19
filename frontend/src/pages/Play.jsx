import { Box } from '@mui/material';
import React from 'react';
import { useParams } from 'react-router-dom';
import backendCall from '../utils/backend';
import AlertMsg from '../components/AlertMsg';

const Play = () => {
  const { pid } = useParams();
  const [alert, setAlert] = React.useState(null);
  const [started, setStarted] = React.useState(false);
  const [data, setData] = React.useState(null);
  const [answer, setAnswer] = React.useState(null);

  const Question = () => {
    const [count, setCount] = React.useState(parseInt(data.time, 10));
    const interval = setInterval(() => {
      if (count <= 0) {
        const answers = [];
        for (let i = 0; i < data.answers.length; i++) {
          if (document.getElementById('choice' + i).checked) {
            answers.push(i)
          }
        }

        backendCall(`/play/${pid}/answer`, { answerIds: answers }, 'PUT')
          .then(() => {
          })
          .catch((err) => {
            if (err.message) {
              setAlert(<AlertMsg message={err.message} successor={() => setAlert(null)} />)
            } else {
              console.error(err);
            }
          });
        backendCall(`/play/${pid}/answer`, {}, 'GET')
          .then((data) => {
            setAnswer(data);
            console.log(answer);
            console.log('answer', data);
          })
          .catch((err) => {
            if (err.message) {
              setAlert(<AlertMsg message={err.message} successor={() => setAlert(null)} />)
            } else {
              console.error(err);
            }
          });
        clearInterval(interval)
      } else {
        setCount(count => count - 1);
      }
    }, 1000);

    const SingleChoice = () => {
      const [selected, setSelected] = React.useState(null);

      return (
        Array.from({ length: data.answers.length }, (_, index) => (
          <div key={`chocice-${index}`}>
            <label htmlFor={`choice${index}`}>{data.answers[index].answer}</label>
            <input type='radio' id={'choice' + index} checked={selected === index} onChange={() => setSelected(index)} />
          </div>
        ))
      );
    }

    const MultiChoice = ({ index }) => {
      const [selected, setSelected] = React.useState(false);

      return (
        <div>
          <label htmlFor={`choice${index}`}>{data.answers[index].answer}</label>
          <input type='checkbox' id={'choice' + index} checked={selected} onChange={() => setSelected(!selected)} />
        </div>
      );
    }

    const Choices = () => {
      if (data.type === 'single') {
        return (
          <SingleChoice />
        );
      } else if (data.type === 'multi') {
        return Array.from({ length: data.answers.length }, (_, index) => (
          <MultiChoice key={`chocice-${index}`} index={index} />
        ));
      } else {
        return (
          <></>
        )
      }
    }

    return (
      <>
        <h3>{data.question}</h3>
        <div>data.source</div>
        <div>
          <Choices />
        </div>
      </>
    );
  }

  const getQuestion = async () => {
    backendCall(`/play/${pid}/question`, {}, 'GET')
      .then(({ question }) => {
        setData(question);
        console.log(question);
      })
      .catch((err) => {
        if (err.message) {
          setAlert(<AlertMsg message={err.message} successor={() => setAlert(null)} />)
        } else {
          console.error(err);
        }
      });
  }

  React.useEffect(async () => {
    if (started) {
      await getQuestion();
    }
  }, [started]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      backendCall(`/play/${pid}/status`, {}, 'GET')
        .then(({ started }) => {
          if (started) {
            setStarted(started);
            clearInterval(interval);
          }
        })
        .catch((err) => {
          if (err.message) {
            setAlert(<AlertMsg message={err.message} successor={() => setAlert(null)} />)
          } else {
            console.error(err);
          }
        });
    }, 1000);
  }, []);

  return (
    <Box style={{ marginTop: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {alert}
      {
        started
          ? data !== null && <Question />
          : <h2>Please wait...</h2>
      }
    </Box>
  );
}

export default Play;
