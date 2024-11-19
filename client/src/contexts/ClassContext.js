import React, { createContext, useState } from "react";

// Create the context
export const ClassContext = createContext();

// Create the provider component
export const ClassProvider = ({ children }) => {
  const [classId, setClassId] = useState(null); // Shared state

  return (
    <ClassContext.Provider value={{ classId, setClassId }}>
      {children}
    </ClassContext.Provider>
  );
};