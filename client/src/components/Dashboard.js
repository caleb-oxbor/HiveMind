import React, { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from 'react-router-dom';
import { slide as Menu } from "react-burger-menu";
import './Dashboard.css'
import logoutIcon from '../images/logout.png'; 
import hivemindLogo from '../images/spacebee.png'; 
import supabase from '../supabaseClient'
import Select from "react-select";


const Dashboard = ({ setAuth }) => {
  const [name, setUsername] = useState("");
  const [classId, setSelectedOption] = useState();
  const [options, setOptions] = useState([]);
  const navigate = useNavigate();

  const handleSelect = (selectedOption) =>{
    setSelectedOption(selectedOption.value);
  }

  const getOptions = async () => {
    try {
      const { data, error } = await supabase
        .from("courses") // Replace "posts" with your actual table name
        .select("course_name, course_code, course_id") // Adjust columns if needed (e.g., 'id' or specific fields)
  
      if (error) throw error;

      const formattedOptions = data.map((course) => ({
        value: `${course.course_id}`, // Combine course_code and course_name
        label: `${course.course_code}: ${course.course_name}` // Same format for label
      }));
     
      setOptions(formattedOptions);

    } catch (err) {
      console.error("Error checking if user has posted:", err.message);
    }
  }

  //have to check if user posts has given classes ID
  const checkIsPosted = async (userID, classId) => {
    try {
      const { data, error } = await supabase
        .from("posts") // Replace "posts" with your actual table name
        .select("*") // Adjust columns if needed (e.g., 'id' or specific fields)
        .eq("user_id", userID) // Filter by user ID
        .eq("course_id", classId); // Filter by class ID
  
      if (error) throw error;

      // console.log(data.length);

      if(data.length > 0)
        return 1;
      else
        return 0;

    } catch (err) {
      console.error("Error checking if user has posted:", err.message);
      return 2;
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
        toast.success("Logout successfully");
    }
    catch(err){
        console.error(err.message);
    }
  };

  const handleNavigation = async () => {
    const userId = await getUserId(); // Get userID
    const classID = classId;

    console.log("Dashboard Class ID:", classID);

    const hasPosted = await checkIsPosted(userId, classID);

    if (hasPosted === 2){
      toast.error("Select a class!");
      return;
    }

    // console.log("hasposted value", hasPosted);

    try {  
      if (hasPosted === 1) {
        navigate("/view-posts", { replace: true, state: {classId} }); 
      } else {
        navigate("/class", { replace: true, state: {classId} }); 
      }
    } catch (err) {
      console.error("Failed to navigate:", err.message);
    }
  };

  useEffect(() => {
    getName();
    getOptions();
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



      <div className="your-classes-container">
        <h1 className="font-tiny5 font-bold text-left text-white text-7xl heading-shadow">Select Class</h1>
      </div>
      <Select
        options = {options}
        value = {options.find(option => option.value === classId)}
        onChange= {handleSelect}
      ></Select>
        <button 
          onClick={handleNavigation}
          className="mt-10 font-dotgothic custom-button"> Class Example
          </button>
    </div>
  );
};

export default Dashboard;