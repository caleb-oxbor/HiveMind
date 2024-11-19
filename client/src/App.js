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

      parseRes === true ? setIsAuthenticated(true) : setIsAuthenticated(false);

    } 
    catch (err) {
      console.error(err.message);
    }
  }

  // async function isCreated() {
  //   try {
  //     const response = await fetch("http://localhost:5000/dashboard/is-posted", {
  //       method: "GET",
  //       headers: {token : localStorage.token }
  //     });

  //     const parseRes = await response.json();
  //     setCreatedPost(parseRes); 
  //   } catch (err) {
  //     console.error(err.message);
  //   }
  // }

  useEffect(() => {
    isAuth();
  }, []);

  // useEffect(() => {
  //   isCreated();
  // }, []);
  
  return (
    <Fragment>
      <Router>
        <ToastContainer style={{ zIndex: 9999 }}/>
        <div className='container'>
          <Routes>
            {/* Welcome Page */}
            <Route path="/" element={<Welcome />} />

            {/* Login Page */}
            <Route
              path="/login"
              element={
                !isAuthenticated ? (
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
                isAuthenticated ? (
                  <Dashboard setAuth={setAuth} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />


            {/* Create post Page */}
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/view-posts" element={<ViewPosts />} />

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
            <Route path="/class" element={<Classes />} />
          </Routes>
        </div>
      </Router>
    </Fragment>
  );
}

export default App;