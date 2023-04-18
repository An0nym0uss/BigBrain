import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Edit from './pages/Edit';
import QuesEdit from './pages/QuesEdit';
import Results from './pages/Results';
import { Context, initialValue } from './utils/context';

function App () {
  const [sessionid, setSessionid] = React.useState(initialValue.sessionid);
  const [quizid, setQuizid] = React.useState(initialValue.quizid);
  const [sessionStarted, setSessionStarted] = React.useState(initialValue.sessionStarted);

  const getters = {
    sessionid,
    quizid,
    sessionStarted,
  };
  const setters = {
    setSessionid,
    setQuizid,
    setSessionStarted,
  };

  return (
    <>
    <Context.Provider value={{ getters, setters, }}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/edit/:id' element={<Edit />} />
          <Route path='/edit/:id/:quesid' element={<QuesEdit />} />
          <Route path='/play/:id' element={<Results />} />
        </Routes>
      </BrowserRouter>
    </Context.Provider>
    </>
  );
}

export default App;
