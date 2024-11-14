import React, { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from 'react-router-dom';
import { slide as Menu } from "react-burger-menu";
import './Dashboard.css'
import logoutIcon from '../images/logout.png'; 
import hivemindLogo from '../images/spacebee.png'; 


const Dashboard = ({ setAuth }) => {
  const [name, setUsername] = useState("");
  const [isPosted, setIsPosted] = useState(false);
  const navigate = useNavigate();

  //have to check if user posts has given classes ID
  const checkIsPosted = async (userID, classID) => {
    try {
      const { data, error } = await supabase
        .from("posts") // Replace "posts" with your actual table name
        .select("*") // Adjust columns if needed (e.g., 'id' or specific fields)
        .eq("user_id", userID) // Filter by user ID
        .eq("class_id", classID); // Filter by class ID
  
      if (error) throw error;
  
      if (data.length > 0) {
        setIsPosted(true); 
      } else {
        setIsPosted(false); 
      }
    } catch (err) {
      console.error("Error checking if user has posted:", err.message);
    }
  };
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
      await checkIsPosted(); 
  
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
  }, []);

  return (
    <div>
        <Menu>
          <a onClick={logout} style={{ display: 'flex', alignItems: 'center' }}>
            <img src={logoutIcon} alt="Logout Icon" style={{ marginRight: '5px', verticalAlign: 'middle', width: '24px', height: '24px' }} /> Logout
          </a>
        </Menu>

        <div className="dashboard-container">
          <header>
            <h1 className="font-tiny5 font-bold text-left text-white text-7xl heading-shadow">Dashboard</h1>
          </header>

          <img src={hivemindLogo} alt="Hivemind Logo" style={{ width: '70px', height: '70px' }} /> 

          <h2 className="font-tiny5 font-bold text-right text-white text-5xl heading-shadow">
            <Link to="/profile" className="text-white">{name}</Link>
          </h2>
        </div>

      <div className="your-classes-container">
        <h1 className="font-tiny5 font-bold text-left text-white text-7xl heading-shadow">Your Classes</h1>
      </div>

        <Link to="/class">
          <button 
            onClick={[handleNavigation, checkIsPosted]}
            className="mt-10 font-dotgothic custom-button"> Class Example
            </button>
        </Link>
    </div>
  );
};

export default Dashboard;