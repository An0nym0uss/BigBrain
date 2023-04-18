import backendCall from '../utils/backend';
import AlertMsg from './AlertMsg';
import styles from './QuesBlock.module.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const QuesBlock = (props) => {
  const navigate = useNavigate();
  const [alert, setAlert] = React.useState(null);

  const toEditQuesPage = () => {
    navigate(`/edit/${getId()}/${props.data.id}`);
  }

  const getId = () => {
    let url = window.location.href;
    url = url.split('/');
    return url[url.length - 1]
  }

  const QuesDelete = () => {
    const path = '/admin/quiz/' + getId();
    backendCall(path, {}, 'GET', { token: localStorage.getItem('token') })
      .then((data) => {
        let index;
        for (const ques of data.questions) {
          if (ques.id === props.data.id) {
            index = data.questions.indexOf(ques);
          }
        }
        data.questions.splice(index, 1);
        props.setData(data);
      })
      .catch(err => {
        if (err.message) {
          setAlert(<AlertMsg message={err.message} successor={() => setAlert(null)} />)
        } else {
          console.error(err);
        }
      });
  }

  return (
    <>
      {alert}
      <div className={styles.block}>
        {props.data.question}
        <br />
        {props.data.type} choice
        <button className={styles.editbtm} onClick={toEditQuesPage}> Eidt </button>
        <button className={styles.delbtm} onClick={QuesDelete}> Delete </button>
      </div>
    </>
  );
}

export default QuesBlock;
