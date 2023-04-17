import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Edit from './pages/Edit';
import QuesEdit from './pages/QuesEdit';

function App () {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/edit/:id' element={<Edit />} />
          <Route path='/edit/:id/:quesid' element={<QuesEdit />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
