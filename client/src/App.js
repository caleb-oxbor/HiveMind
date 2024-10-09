import './App.css';
import React, { Fragment } from "react";

import {BrowserRouter as Router, 
  Switch, 
  Route, 
  Redirect
}  from "react-router-dom";

//components

import Welcome from './components/Welcome';
import createAccount from './components/CreateAccount';
import logIn from './components/LogIn';

function App() {
  return (
    <Fragment>
      <Router>
        <div className='container'>
        <Switch>
          <Route exact path="/login" render={props => <logIn{...props}/>} />
          <Route exact path="/register" render={props => <createAccount{...props}/>} />
          <Route exact path="/welcome" render={props => <Welcome{...props}/>} />
        </Switch>
        </div>
      </Router>
    </Fragment>
  );
}

export default App;
