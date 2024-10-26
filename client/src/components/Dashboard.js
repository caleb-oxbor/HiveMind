import React, { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from 'react-router-dom';
import { slide as Menu } from "react-burger-menu";
import './Dashboard.css'


const Dashboard = ({ setAuth }) => {
  const [name, setUsername] = useState("");
  const [isPosted, setIsPosted] = useState(false);
  const navigate = useNavigate();

  const getPost = async () => {
    try {
        const response = await fetch("http://localhost:5000/dashboard/is-posted",
        {
            method: "GET",
            headers: {token: localStorage.token }
        });

        const data = await response.json();

        if (response.ok && data.isPosted) {
          setIsPosted(true);
        } else {
          setIsPosted(false);
        }

    } catch (err){
        console.error(err.message);
    }
  }

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

  const handleNavigation = async () => {
    try {
      await getPost(); 
  
      if (isPosted) {
        navigate("/view-posts", { replace: true }); 
      } else {
        navigate("/class", { replace: true }); 
      }
    } catch (err) {
      console.error("Failed to navigate:", err.message);
    }
  };

  useEffect(() => {
    getName();
    getPost();
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

      <header>
        <h1 className="font-tiny5 font-bold text-left text-white text-7xl heading-shadow">Dashboard</h1>
      </header>
      
      <h2 className="font-tiny5 font-bold text-right text-white text-3xl heading-shadow">
        <Link to="/profile" className="text-white">{name}</Link>
      </h2>
      </div>
      <Link to="/class">
        <button 
          onClick={handleNavigation}
          className="mt-10 font-dotgothic custom-button">
        Class Example</button>
      </Link>

    </div>
  );
};

export default Dashboard;