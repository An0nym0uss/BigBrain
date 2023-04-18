import styles from './Edit.module.css';
import backendCall from '../utils/backend';
import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import QuesBlock from '../components/QuesBlock';
import AlertMsg from '../components/AlertMsg';

const Edit = () => {
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [gamedata, setGameData] = useState([{
    id: 1,
    questilon: 'a question',
    point: '10',
    time: '25',
    type: 'single'
  }]);
  const [type, setType] = useState('');
  const [question, setQuestion] = useState('');
  const [time, setTime] = useState(0);
  const [point, setPoint] = useState(0);
  const [numChoice, setNumChoice] = useState(2);
  const [answers, setAnswers] = useState([]);
  const [source, setSource] = useState('');
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    updateData();
  }, [gamedata]);

  const hideModalHandler = () => {
    setModalIsVisible(false);
  }
  const showModalHandler = () => {
    setAnswers([]);
    setModalIsVisible(true);
  }

  const getId = () => {
    let url = window.location.href;
    url = url.split('/');
    return url[url.length - 1]
  }

  const getData = () => {
    const path = '/admin/quiz/' + getId();
    backendCall(path, {}, 'GET', { token: localStorage.getItem('token') })
      .then((data) => {
        setGameData(data);
      })
      .catch(err => {
        if (err.message) {
          setAlert(<AlertMsg message={err.message} successor={() => setAlert(null)} />)
        } else {
          console.error(err);
        }
      });
    return display()
  }

  const newQues = () => {
    const answersTemp = [];
    for (let i = 0; i < numChoice; i++) {
      let dump = {};
      if (document.getElementById('radio' + i).checked) {
        dump = {
          answer: document.getElementById(i).value,
          isRight: true
        }
      } else {
        dump = {
          answer: document.getElementById(i).value,
          isRight: false
        }
      }
      answersTemp.push(dump)
    }
    setAnswers(answersTemp);

    if (type === '' || question === '' || time === '0' || answers === []) {
      alert('please fill in all the required field');
      return;
    }

    const quesData = {
      id: Date.now(),
      type,
      question,
      time,
      point,
      answers: answersTemp,
      source
    }
    hideModalHandler();
    const newData = gamedata;
    newData.questions.push(quesData);
    setGameData(newData);
    updateData();
    reset();
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

  const reset = () => {
    setAnswers([]);
    setType('');
    setPoint(0);
    setTime(0);
    setQuestion('');
  }

  const generateChoiceInput = () => {
    const inputs = [];
    for (let i = 0; i < numChoice; i++) {
      inputs.push(
        <input type="text" id={i} />
      )
      inputs.push(
        'right answer?'
      )
      inputs.push(
        <input type="radio" id={'radio' + i} />
      )
      inputs.push(
        <br />
      )
    }
    return inputs;
  }

  const display = () => {
    if (gamedata.questions) {
      return (
        <div className={styles.quesContainer}>
          {gamedata.questions.map((data, index) => <QuesBlock key={`question-${index}`} data={data} setData={setGameData} />)}
        </div>
      );
    }
    return <div>loading...</div>
  }

  return (
    <div>
      {alert}
      {modalIsVisible && (
        <Modal hide={hideModalHandler}>

          Type of question<br />
          <input type="radio" id="single" name="type" value="single" onClick={(event) => setType(event.target.value)} />
          <label htmlFor="single">single choice</label>
          <input type="radio" id="multi" name="type" value="multi" onClick={(event) => setType(event.target.value)} />
          <label htmlFor="single">multiple choice</label> <br />

          The question:
          <input type="text" onChange={(event) => setQuestion(event.target.value)} /> <br />

          Time limit:
          <input type="range" name="time" min="0" max="60" defaultValue={0} onChange={(event) => setTime(event.target.value)} />
          {<label htmlFor="name">{time}s</label>}<br />

          Points for the question
          <input type="range" name="point" min="0" max="50" defaultValue={0} onChange={(event) => setPoint(event.target.value)} />
          {<label htmlFor="point">{point} points</label>}<br />

          URL of the media source: (optional)
          <input type="text" onChange={(event) => setSource(event.target.value)} /> <br />

          Number of choices
          <input type="range" name="numChoice" min="2" max="6" defaultValue={2} onChange={(event) => setNumChoice(event.target.value)} />
          {<label htmlFor="numChoice">{numChoice} choices</label>}<br />

          Answers: <br />
          {generateChoiceInput()}

          <button onClick={newQues}> Confirm </button>
          <button onClick={hideModalHandler}> Cancel </button>
        </Modal>
      )}
      <button onClick={showModalHandler}> Add a question </button>
      {display()}
    </div>
  );
}

export default Edit;
