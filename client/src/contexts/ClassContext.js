import React, { createContext, useState } from "react";

export const ClassContext = createContext();

export const ClassProvider = ({ children }) => {
  const [classId, setClassId] = useState(null);
  const [className, setClassName] = useState(""); 
  const [classCode, setClassCode] = useState(""); 

  return (
    <ClassContext.Provider value={{ classId, setClassId, className, setClassName, classCode, setClassCode }}>
      {children}
    </ClassContext.Provider>
  );
};