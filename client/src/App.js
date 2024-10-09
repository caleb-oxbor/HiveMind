// npm install react-router-dom
//import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Welcome from './components/Welcome';
import CreateAccount from './components/CreateAccount';
import Login from './components/LogIn';
import { Link } from 'react-router-dom';

// function App() {
//   return (
//     <Router>
//       <div className="App">

//         <Routes>
//           <Route path="/" element={<Welcome />} />
//           <Route path="/create-account" element={<CreateAccount />} />
//           <Route path="/login" element={<Login />} />
//         </Routes>

//       </div>
//     </Router>
//   );
// }
//import React, { Fragment, useState } from "react";

//components

// function App() {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   const setAuth = (boolean) => {
//     setIsAuthenticated(boolean);
//   };
  
//   return (
//     <div className="App">APP TEST</div>
//   );
// }

function App() {
  console.log("Welcome component rendered"); // Debug line
  return (
    <div>
      <h1>Welcome to HiveMind!</h1>
      <p>Click below to redirect:</p>
      <Link to="/create-account">
        <button>Create Account</button>
      </Link>
      <Link to="/login">
        <button>Login</button>
      </Link>
    </div>
  );
}

export default App;
