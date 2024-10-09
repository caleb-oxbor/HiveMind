import './App.css';
import React, { Fragment, useState } from "react";

import {BrowserRouter as Router, 
  Routes,
  Route, 
  Navigate
}  from "react-router-dom";

//components
import CreateAccount from './components/CreateAccount';
import LogIn from './components/LogIn';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  };
  
  return (
    <Fragment>
      <Router>
        <div className='container'>
          <Routes>
            <Route path="/login" element={<LogIn />} />

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
