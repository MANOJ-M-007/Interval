import React, { createContext, useContext, useState } from 'react';

const TaskContext = createContext();

export function TaskProvider({ children }) {
  const [contextUpdated, setContextUpdated] = useState(false);

  const updateContext = () => {
    setContextUpdated(!contextUpdated);
  };

  return (
    <TaskContext.Provider value={{ contextUpdated, updateContext}}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext() {
  return useContext(TaskContext);
}