import backendCall from '../utils/backend';
import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import QuesBlock from '../components/QuesBlock';
import AlertMsg from '../components/AlertMsg';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Edit = () => {
  const navigate = useNavigate();
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [gamedata, setGameData] = useState([]);
  const [type, setType] = useState('single');
  const [question, setQuestion] = useState('');
  const [time, setTime] = useState(0);
  const [point, setPoint] = useState(0);
  const [numChoice, setNumChoice] = useState(2);
  const [source, setSource] = useState('');
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    updateData();
  }, [gamedata]);

  const showModalHandler = () => {
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
    const answers = [];
    let isAnswerSelected = false;
    for (let i = 0; i < numChoice; i++) {
      let dump = {};
      if (document.getElementById('choice' + i).checked) {
        dump = {
          answer: document.getElementById(i).value,
          isRight: true
        }
        isAnswerSelected = true;
      } else {
        dump = {
          answer: document.getElementById(i).value,
          isRight: false
        }
      }
      answers.push(dump)
    }
    console.log('tempAnswer:', answers);

    let errMsg = '';
    if (question === '') {
      errMsg = 'question';
    } else if (time === 0) {
      errMsg = 'time';
    } else if (!isAnswerSelected) {
      errMsg = 'answers';
    }
    if (errMsg) {
      setAlert(<AlertMsg message={`please select/fill ${errMsg}`} successor={() => setAlert(null)} />);
      return;
    }

    const quesData = {
      id: Date.now(),
      type,
      question,
      time,
      point,
      answers,
      source
    }
    setModalIsVisible(false);
    const newData = gamedata;
    newData.questions.push(quesData);
    setGameData(newData);
    updateData();
    reset();
  }

  const updateData = () => {
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
    setType('single');
    setPoint(0);
    setTime(0);
    setNumChoice(2);
    setQuestion('');
  }

  const SingleChoice = () => {
    const [selected, setSelected] = useState(null);

    return (
      Array.from({ length: numChoice }, (_, index) => (
        <div key={`chocice-${index}`}>
          <label>
            <input type='text' id={index} />
            &nbsp; right answer?
            <input type='radio' id={'choice' + index} checked={selected === index} onChange={() => setSelected(index)} />
          </label>
        </div>
      ))
    );
  }

  const MultiChoice = ({ index }) => {
    const [selected, setSelected] = useState(false);

    return (
      <div>
        <input type='text' id={index} />
        &nbsp; right answer?
        <input type='checkbox' id={'choice' + index} checked={selected} onChange={() => setSelected(!selected)} />
      </div>
    );
  }
  const generateChoiceInput = () => {
    if (type === 'single') {
      return (
        <SingleChoice />
      );
    } else if (type === 'multi') {
      return Array.from({ length: numChoice }, (_, index) => (
        <MultiChoice key={`chocice-${index}`} index={index} />
      ));
    }
  }

  const display = () => {
    if (gamedata.questions) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {gamedata.questions.map((data, index) => <QuesBlock key={`question-${index}`} data={data} setData={setGameData} />)}
        </div>
      );
    }
    return <div>loading...</div>
  }

  const handleHideModal = () => {
    reset();
    setModalIsVisible(false);
  }

  return (
    <div>
      {alert}
      {modalIsVisible && (
        <Modal hide={handleHideModal}>
          Type of question<br />
          <input type="radio" id="single" name="type" value="single" defaultChecked onClick={(event) => setType(event.target.value)} />
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
          <button onClick={() => setModalIsVisible(false)}> Cancel </button>
        </Modal>
      )}
      <Button onClick={() => navigate('/dashboard')}>back</Button>
      <Button variant='contained' onClick={showModalHandler} sx={{ ml: '30px' }}> Add a question </Button>
      {display()}
    </div>
  );
}

export default Edit;
