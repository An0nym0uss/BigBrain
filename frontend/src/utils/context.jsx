import React, { createContext } from 'react';

export const initialValue = {
  sessionid: 0,
  quizid: 0,
  sessionStarted: false,
};

export const Context = createContext(initialValue);
export const useContext = React.useContext;
