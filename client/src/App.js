import './App.css';
import React, { Fragment, useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

import {BrowserRouter as Router, 
  Routes,
  Route, 
  Navigate
}  from "react-router-dom";

//components
import CreateAccount from './components/CreateAccount';
import LogIn from './components/LogIn';

toast.configure();


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  };

  async function isAuth(){
    try {
      const response = await fetch("http://localhost:5000/auth/is-verify", {
        method: "GET",
        headers: {token : localStorage.token }
      });

      const parseRes = await response.json();

      parseRes === true ? setIsAuthenticated(true) : setIsAuthenticated(false);

    } 
    catch (err) {
      console.error(err.message);
      
    }
  }

  useEffect(() => {
    isAuth();
  }, []);
  
  return (
    <Fragment>
      <Router>
        <ToastContainer style={{ zIndex: 9999 }}/>
        <div className='container'>
          <Routes>
            <Route 
              path="/login" 
              element = {<LogIn setAuth={setAuth} />}
              />

            <Route 
              path="/register" 
              element={<CreateAccount setAuth={setAuth} />} 
            />

            {/* Add other routes here */}
          </Routes>
        </div>
      </Router>
    </Fragment>
  );
}

export default App;
