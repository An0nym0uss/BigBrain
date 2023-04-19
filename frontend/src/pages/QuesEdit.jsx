import backendCall from '../utils/backend';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AlertMsg from '../components/AlertMsg';

/**
 * Setup question type and answers etc...
 * @returns Edit question modal
 */
const QuesEdit = () => {
  const [type, setType] = useState('');
  const [question, setQuestion] = useState('');
  const [gamedata, setGameData] = useState([{
    id: 1,
    questilon: 'a question',
    point: '10',
    time: '25',
    type: 'single'
  }]);
  const [time, setTime] = useState(0);
  const [point, setPoint] = useState(0);
  const [numChoice, setNumChoice] = useState(2);
  const [answers, setAnswers] = useState([]);
  const [alert, setAlert] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    updateData();
  }, [gamedata]);

  const toEditPage = () => {
    navigate(`/edit/${getId()}`);
  }

  const getId = () => {
    let url = window.location.href;
    url = url.split('/dashboard');
    return url[url.length - 2]
  }

  const getQuesId = () => {
    let url = window.location.href;
    url = url.split('/dashboard');
    return url[url.length - 1]
  }

  const getData = () => {
    const path = '/admin/quiz/' + getId();
    backendCall(path, {}, 'GET', { token: localStorage.getItem('token') })
      .then((data) => {
        setGameData(data);
        for (const ques of data.questions) {
          if (ques.id === getQuesId()) {
            setType(ques.type);
            setQuestion(ques.question);
            setTime(ques.time);
            setPoint(ques.point);
            setAnswers(ques.answers);
            setNumChoice(ques.answers.length)
          }
        }
      })
      .catch(err => {
        if (err.message) {
          setAlert(<AlertMsg message={err.message} successor={() => setAlert(null)} />)
        } else {
          console.error(err);
        }
      });
  }

  const update = () => {
    const answersTemp = [];
    for (let i = 0; i < numChoice; i++) {
      if (document.getElementById(i) === '') {
        const errMsg = 'please fill in all the answers';
        setAlert(<AlertMsg message={errMsg} successor={() => setAlert(null)} />)
        return;
      }
      answersTemp.push(document.getElementById(i).value)
    }
    setAnswers(answersTemp);

    if (type === '' || question === '' || time === '0' || answers === []) {
      const errMsg = 'please fill in all the required field';
      setAlert(<AlertMsg message={errMsg} successor={() => setAlert(null)} />)
      return;
    }

    const quesData = {
      id: getQuesId(),
      type,
      question,
      time,
      point,
      answers: answersTemp
    }

    const tempData = gamedata;
    for (let i = 0; i < tempData.questions.length; i++) {
      if (tempData.questions[i].id === getQuesId()) {
        tempData.questions[i] = quesData;
      }
    }
    setGameData(tempData);
    updateData();
    toEditPage();
  }

  const updateData = () => {
    console.log(gamedata.questions);
    const path = '/admin/quiz/' + getId();
    backendCall(path, gamedata, 'PUT', { token: localStorage.getItem('token') })
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

  const generateChoiceInput = () => {
    const inputs = [];
    for (let i = 0; i < numChoice; i++) {
      inputs.push(
        <input type="text" id={i} value={answers[i]} />
      )
      inputs.push(
        <br />
      )
    }
    return inputs;
  }

  return (
    <div>
      {alert}
      Type of question<br />
      <input type="radio" id="single" name="type" value="single" onClick={(event) => setType(event.target.value)} />
      <label htmlFor="single">single choice</label>
      <input type="radio" id="multi" name="type" value="multi" onClick={(event) => setType(event.target.value)} />
      <label htmlFor="single">multiple choice</label> <br />

      The question:
      <input type="text" value={question} onChange={(event) => setQuestion(event.target.value)} /> <br />

      Time limit:
      <input type="range" value={time} name="time" min="0" max="60" defaultValue={0} onChange={(event) => setTime(event.target.value)} />
      {<label htmlFor="name">{time}s</label>}<br />

      Points for the question
      <input type="range" value={point} name="point" min="0" max="50" defaultValue={0} onChange={(event) => setPoint(event.target.value)} />
      {<label htmlFor="point">{point} points</label>}<br />

      Number of choices
      <input type="range" value={numChoice} name="numChoice" min="2" max="6" defaultValue={2} onChange={(event) => setNumChoice(event.target.value)} />
      {<label htmlFor="numChoice">{numChoice} choices</label>}<br />

      Answers: <br />
      {generateChoiceInput()}

      <button onClick={update}> Update </button>
      <button onClick={toEditPage}> Cancel </button>
    </div>
  );
}

export default QuesEdit;
