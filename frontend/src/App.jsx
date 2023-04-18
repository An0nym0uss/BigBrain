import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Edit from './pages/Edit';
import QuesEdit from './pages/QuesEdit';
import Results from './pages/Results';
import { Context } from './utils/context';
import Join from './pages/Join';
import JoinPlay from './pages/JoinPlay';
import InitialPage from './pages/InitialPage';
import Play from './pages/Play';

function App () {
  const getters = {
  };
  const setters = {
  };

  return (
    <>
    <Context.Provider value={{ getters, setters, }}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<InitialPage />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/edit/:id' element={<Edit />} />
          <Route path='/edit/:id/:quesid' element={<QuesEdit />} />
          <Route path='/result/:qid' element={<Results />} />
          <Route path='/play/join' element={<Join />} />
          <Route path='/play/:sid' element={<JoinPlay />} />
          <Route path='/play/:sid/:pid' element={<Play />} />
        </Routes>
      </BrowserRouter>
    </Context.Provider>
    </>
  );
}

export default App;
