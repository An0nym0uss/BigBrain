/* eslint-disable no-console */

import styles from './Dashboard.module.css';
import { Button } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import backendCall from '../utils/backend';
import serverRequest from '../utils/server';
import Modal from '../components/Modal';
import GameBlock from '../components/GameBlock';


const Dashboard = () => {
    const navigate = useNavigate();

    const [modalIsVisible, setModalIsVisible] = useState(false);
    const [quizName, setQuizName] = useState('');
    const [quizList, setQuizList] = useState([{}]);

    React.useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/login');
        }
        getQuizHandler();
        let lis = quizList;
        lis.shift();
        setQuizList(lis);
    }, []);

    function hideModalHandler() {
        setModalIsVisible(false);
    }
    function showModalHandler() {
        setModalIsVisible(true);
    }

    const handleLogout = () => {
        backendCall('/admin/auth/logout', {}, 'POST', { token: localStorage.getItem('token') })
            .then(() => {
                localStorage.removeItem('token');
                navigate('/login');
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function newQuizHandler(name) {
        backendCall('/admin/quiz/new', { name: name }, 'POST', { token: localStorage.getItem('token') }).then(() => {
        }).catch(error => {
            console.log(error);
            alert(error);
        })
        hideModalHandler();
    }

    function getQuizHandler() {
        backendCall('/admin/quiz', {}, 'GET', { token: localStorage.getItem('token') }).then((data) => {
            setQuizList(quizList.concat(data.quizzes));
            console.log(data.quizzes);
        }).catch(error => {
            console.log(error);
            alert(error);
        })
    }

    function display() {
        return (
            <div className={styles.gameContainer}>
                {quizList.map((data) => <GameBlock data={data}/>)}
            </div>
        )
    }

    return (
        <div>
            Dashboard!
            {modalIsVisible && (
                <Modal hide={hideModalHandler}>
                    Enter a name for the new quiz <br />
                    <input type="text" onChange={(event) => setQuizName(event.target.value)} /> <br />
                    <button onClick={() => newQuizHandler(quizName)}> Confirm </button>
                    <button onClick={hideModalHandler}> Cnacel </button>
                </Modal>
            )}
            <Button onClick={handleLogout}>Logout</Button>
            <Button onClick={showModalHandler}>New quiz</Button>
            {display()}
        </div>
    );
}

export default Dashboard;
