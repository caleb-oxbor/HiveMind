// npm install react-router-dom
import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Welcome from './components/Welcome';
import CreateAccount from './components/CreateAccount';
import Login from './components/LogIn';

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

function App() {
  return (
    <div className="App">APP TEST</div>
  );
}

export default App;
