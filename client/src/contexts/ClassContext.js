import React, { createContext, useState } from "react";

export const ClassContext = createContext();

//Context is used so that classes selected from dashboard can be updated in
//view posts and classes page easily.

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