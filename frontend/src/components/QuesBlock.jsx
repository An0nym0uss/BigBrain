import backendCall from '../utils/backend';
import styles from './QuesBlock.module.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';

function QuesBlock (props) {
  const navigate = useNavigate();

  function toEditQuesPage () {
    navigate(`/edit/${getId()}/${props.data.id}`);
  }

  function getId () {
    let url = window.location.href;
    url = url.split('/');
    return url[url.length - 1]
  }

  function QuesDelete () {
    const path = '/admin/quiz/' + getId();
    backendCall(path, {}, 'GET', { token: localStorage.getItem('token') }).then((data) => {
      let index;
      console.log(data.questions);
      for (const ques of data.questions) {
        if (ques.id === props.data.id) {
          index = data.questions.indexOf(ques);
        }
      }
      data.questions.splice(index, 1);
      props.setData(data);
    }).catch(error => {
      console.log(error);
      alert(error);
    })
  }

  return (
        <div className={styles.block}>
            {props.data.question}
            <br />
            {props.data.type} choice
            <button className={styles.editbtm} onClick={toEditQuesPage}> Eidt </button>
            <button className={styles.delbtm} onClick={QuesDelete}> Delete </button>
        </div>
  );
}

export default QuesBlock;
