import './App.css';
import React from 'react';
import { Link } from 'react-router-dom';

function App() {
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
