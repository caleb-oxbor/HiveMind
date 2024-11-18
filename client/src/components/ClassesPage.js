import React, { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link } from 'react-router-dom';
import { slide as Menu } from "react-burger-menu";
import './Dashboard.css'
import hivemindLogo from '../images/spacebee.png'; 
import logoutIcon from '../images/logout.png'; 

const Classes = ({ setAuth }) => {
  const [name, setUsername] = useState("");

    
  const getName = async () => {
    try {
      const response = await fetch("http://localhost:5000/dashboard/", 
        {
        method: "GET",
        headers: {token: localStorage.token }
        });

      const parseData = await response.json();
      setUsername(parseData.username);
    } catch (err) {
      console.error(err.message);
    }
  };
  
  const logout = async e => {
    e.preventDefault();
    try{
        localStorage.removeItem("token");
        setAuth(false);
        toast.success("Logout successfully");
    }
    catch(err){
        console.error(err.message);
    }
  };


  useEffect(() => {
    getName();
  }, []);

  return (
    <div>
    <div className="dashboard-container">
      <div className="burger-menu-container">
        <Menu>
          <Link to="/dashboard">Home</Link>
          <a onClick={logout} style={{ display: 'flex', alignItems: 'center' }}>
            <img src={logoutIcon} alt="Logout Icon" style={{ marginRight: '5px', verticalAlign: 'middle', width: '24px', height: '24px' }} /> Logout
          </a>
        </Menu>
      </div>

      <header>
        <h1 className="dashboard-header-left font-tiny5 font-bold text-left text-white text-7xl heading-shadow">Class Example</h1>
      </header>

      <img src={hivemindLogo} alt="Hivemind Logo" className="dashboard-logo" />

      <h2 className="dashboard-header-right font-tiny5 font-bold text-right text-white text-3xl heading-shadow">
      <Link to="/profile" className="text-white">{name}</Link>
      </h2>
    </div>
    <div style={{ display: 'inline-block' }}>
      <Link to="/create-post">
        <button className="mt-10 font-dotgothic custom-button">Create Post</button>
      </Link>
      </div>
    </div>
  );
};

export default Classes;