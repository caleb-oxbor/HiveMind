import React, { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { slide as Menu } from "react-burger-menu";
import './Dashboard.css'


const Classes = ({ setAuth }) => {
  const [name, setUsername] = useState("");
  const navigate = useNavigate();


  const location = useLocation();
  const classId = location.state?.classId;

  console.log("Classes ClassID = ", classId);
    
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

  const handleNavigation = async () =>{
    console.log("PASS IN CLASS ID CHECK = ", classId);
    navigate("/create-post", {state: {classId} }); 
  };


  useEffect(() => {
    getName();
  }, []);

  return (
    <div>
    <div className="dashboard-container">
      <div className="burger-menu-container">
        <Menu >
          <Link to="/">Home</Link>
          <a onClick={logout}>Logout</a>
        </Menu>
      </div>

      <header>
        <h1 className="font-tiny5 font-bold text-left text-white text-7xl heading-shadow">Class Example</h1>
      </header>
      <h2 className="font-tiny5 font-bold text-right text-white text-3xl heading-shadow">{name}</h2>
    </div>
      <Link to="/create-post">
      
      <button 
          onClick={handleNavigation}
          className="mt-10 font-dotgothic custom-button"> Create Post
          </button>
      </Link>
    </div>
  );
};

export default Classes;