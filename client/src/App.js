import './App.css';
import React, { Fragment, useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

import {BrowserRouter as Router, 
  Routes,
  Route, 
  Navigate,
}  from "react-router-dom";

//components
import CreateAccount from './components/CreateAccount';
import LogIn from './components/LogIn';
import Welcome from './components/Welcome';
import Dashboard from './components/Dashboard';
import CreatePost from './components/CreatePost';
import ViewPosts from './components/ViewPosts';
import Classes from './components/ClassesPage';

import Profile from './components/ProfilePage';

import { ClassProvider } from "./contexts/ClassContext"; 


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [createdPost, setCreatedPost] = useState(false);

  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  };

  const setCreated = (boolean) => {
    setCreatedPost(boolean);
  };

  async function isAuth(){
    try {
      const response = await fetch("http://localhost:5000/auth/is-verify", {
        method: "GET",
        headers: {token : localStorage.token }
      });

      const parseRes = await response.json();

      //Upon successful verification, user is authenticated
      parseRes === true ? setIsAuthenticated(true) : setIsAuthenticated(false);

    } 
    catch (err) {
      console.error(err.message);
    }
  }

  //Check users authentication status
  useEffect(() => {
    isAuth();
  }, []);

  
  return (
    <Fragment>
      <Router>
        <ToastContainer style={{ zIndex: 9999 }}/>
        <ClassProvider>
        <div className='container'>
          <Routes>
            {/* Welcome Page */}
            <Route path="/" element={<Welcome />} />

            {/* Login Page */}
            <Route
              path="/login"
              element={
                !isAuthenticated ? (  // Checks if authenticated, if they are, auto direct to dashboard
                  <LogIn setAuth={setAuth} />
                ) : (
                  <Navigate to="/dashboard" />
                )
              }
            />

            {/* Register Page */}
              <Route
              path="/register"
              element={
                !isAuthenticated ? (
                  <CreateAccount setAuth={setAuth} />
                ) : (
                  <Navigate to="/dashboard" />
                )
              }
            />

            {/* Dashboard Page */}
            <Route
              path="/dashboard"
              element={
                isAuthenticated ? ( // does the opposite of login, reroutes to login if not authenticated
                  <Dashboard setAuth={setAuth} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />


            {/* Create post Page */}
            <Route
              path="/create-post"
              element={
                isAuthenticated ? (
                  <CreatePost setAuth={setAuth} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            <Route path="/view-posts" 
              element={
              isAuthenticated ? (
              <ViewPosts setAuth={setAuth} />
              ) : (
              <Navigate to="/login" />
              )
              }
            />

            {/* Profile Page */}
            <Route
              path="/profile"
              element={
                isAuthenticated ? (
                  <Profile setAuth={setAuth} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />


            {/* Add other routes here */}
            <Route path="/class" 
              element={
                isAuthenticated ? (
                  <Classes setAuth={setAuth} />
                ) : (
                  <Navigate to="/login" />
                )
              }
              />
          </Routes>
        </div>
        </ClassProvider>
      </Router>
    </Fragment>
  );
}

export default App;