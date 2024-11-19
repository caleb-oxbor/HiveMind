import React, { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link } from 'react-router-dom';
import { slide as Menu } from "react-burger-menu";
import "./ProfilePage.css";

const Profile = ({ setAuth }) => {
  const [name, setUsername] = useState("");
  const [userEmail, setEmail] = useState("");

  const getName = async () => {
    try {
      const response = await fetch("http://localhost:5000/profile", 
        {
        method: "GET",
        headers: {token: localStorage.token }
        });

      const parseData = await response.json();
      setUsername(parseData.username);
      setEmail(parseData.email);
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
                <Menu >
                <Link to="/dashboard">Home</Link>
                <a onClick={logout}>Logout</a>
                </Menu>
            </div>

            <header className="profile-header">
                <h1 className="font-tiny5 font-bold text-center text-white text-7xl heading-shadow">Profile</h1>
            </header>

        </div>
        
        <div className="info-header">
            <h1 className="font-tiny5 font-bold text-left text-white text-5xl heading-shadow">Your Information</h1>
            <div className="info-box">
                <div className="profile-photo">Insert Profile Photo Here</div>

                <div className="user-details">
                    <div className="key">Username:</div>
                    <div className="label">{name}</div>
                    <div className="key">Email:</div>
                    <div className="label">{userEmail}</div>
                    
                </div>

            </div>

        </div>

    </div>
  );
};

export default Profile;