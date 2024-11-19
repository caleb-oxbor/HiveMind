import React, { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from 'react-router-dom';
import { slide as Menu } from "react-burger-menu";
import './Dashboard.css'
import logoutIcon from '../images/logout.png'; 
import hivemindLogo from '../images/spacebee.png'; 
import supabase from '../supabaseClient'



const Dashboard = ({ setAuth }) => {
  const [name, setUsername] = useState("");
  const navigate = useNavigate();

  //have to check if user posts has given classes ID
  const checkIsPosted = async (userID, classID) => {
    try {
      const { data, error } = await supabase
        .from("posts") // Replace "posts" with your actual table name
        .select("*") // Adjust columns if needed (e.g., 'id' or specific fields)
        .eq("user_id", userID) // Filter by user ID
        .eq("course_id", classID); // Filter by class ID
  
      if (error) throw error;

      return data.length > 0;

    } catch (err) {
      console.error("Error checking if user has posted:", err.message);
    }
  };

  const getUserId = async () => {
    try {
      const { data, error } = await supabase
        .from('users') // Replace with your actual table name
        .select('user_id') // Only fetch the user_id
        .eq('username', name) // Replace with appropriate condition
        .single(); // Ensures we only fetch one record
  
      if (error) {
        console.error("Error fetching user ID:", error.message);
        return null;
      }
  
      return data?.user_id; // Return the user_id if found
    } catch (err) {
      console.error("Unexpected error querying user ID:", err.message);
      return null;
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
        toast.success("Logout successful!");
    }
    catch(err){
        console.error(err.message);
    }
  };

  const handleNavigation = async () => {
    const userId = await getUserId(); // Get userID
    const classId = 2; // Replace with actual class ID logic

    const hasPosted = await checkIsPosted(userId, classId);

    try {  
      if (hasPosted) {
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

        <div className="dashboard-container">
        <Menu>
          <a onClick={logout} style={{ display: 'flex', alignItems: 'center' }}>
            <img src={logoutIcon} alt="Logout Icon" style={{ marginRight: '5px', verticalAlign: 'middle', width: '24px', height: '24px' }} /> Logout
          </a>
        </Menu>
          <header>
            <h1 className="dashboard-header-left font-tiny5 font-bold text-left text-white text-7xl heading-shadow">Dashboard</h1>
          </header>

          <img src={hivemindLogo} alt="Hivemind Logo" className="dashboard-logo" /> 

          <h2 className="dashboard-header-right font-tiny5 font-bold text-left text-white text-3xl heading-shadow">
            <Link to="/profile" className="text-white">{name}</Link>
          </h2>
        </div>

      <div className="your-classes-container">
        <h1 className="font-tiny5 font-bold text-left text-white text-7xl heading-shadow">Your Classes</h1>
      </div>

      <div style={{ display: 'inline-block' }}>
        <Link to="/class">
          <button 
            onClick={handleNavigation}
            className="mt-10 font-dotgothic custom-button"> Class Example
            </button>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;