import React, { Fragment, useEffect, useState, useRef, useContext } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from 'react-router-dom';
import { slide as Menu } from "react-burger-menu";
import logoutIcon from '../images/logout.png'; 
import hivemindLogo from '../images/spacebee.png'; 
import supabase from '../supabaseClient'
import Select from "react-select";
import { ClassContext } from "../contexts/ClassContext";
import './Dashboard.css'


const Dashboard = ({ setAuth }) => {
  const [name, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [options, setOptions] = useState([]);
  const [classes, setClasses] = useState([]);
  const navigate = useNavigate();
  const { classId, setClassId } = useContext(ClassContext);
  const { className, setClassName } = useContext(ClassContext);
  const { classCode, setClassCode } = useContext(ClassContext);


  //When a class is selected, the context must be updated for all pages to be able to access
  const handleSelect = (selectedOption) =>{
    setClassId(selectedOption.value);
    const courseCode = selectedOption.label.split(":")[0].trim();
    setClassCode(courseCode);
    const className = selectedOption.label.split(":")[1].trim();
    setClassName(className);
  }


  //Function to get all classes from database
  const getOptions = async () => {
    try {
        const response = await fetch("http://localhost:5000/dashboard/courses", {
            method: "GET",
            headers: { token: localStorage.token },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch course options");
        }

        const formattedOptions = await response.json();
        setOptions(formattedOptions);
    } catch (err) {
        console.error("Error fetching course options:", err.message);
    }
};

//Function to get which classes a user is in
const fetchUserClasses = async () => {

  try {
    //userID must be set first
      if (!userId) {
          console.error("User ID is invalid. Cannot fetch user classes.");
          return;
      }

      const response = await fetch(`http://localhost:5000/dashboard/user-classes?userID=${userId}`, {
          method: "GET",
          headers: { token: localStorage.token },
      });

      if (!response.ok) {
          throw new Error("Failed to fetch user classes");
      }

      const classesWithNames = await response.json();
      setClasses(classesWithNames);
  } catch (err) {
      console.error("Error fetching user classes:", err.message);
  }
};


  //Function to see whether a user has already posted to a selected class
  const checkIsPosted = async (userID, classId) => {
    try {
        const response = await fetch(`http://localhost:5000/dashboard/check-is-posted?userID=${userID}&classID=${classId}`, {
            method: "GET",
            headers: { token: localStorage.token },
        });

        if (!response.ok) {
            throw new Error("Failed to check post status");
        }

        const { isPosted } = await response.json();
        return isPosted;
    } catch (err) {
        console.error("Error checking post status:", err.message);
        return 2;
    }
};

  //Function to get the user's userID
  const getUserId = async () => {
    if (name == "") {
      console.error("User name is not set. Cannot fetch user ID.");
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('users') 
        .select('user_id') 
        .eq('username', name) 
        .single(); 
  
      if (error) {
        console.error("Error fetching user ID:", error.message);
        return null;
      }
  
      setUserId(data.user_id);
      return data.user_id;
    } catch (err) {
      console.error("Unexpected error querying user ID:", err.message);
      return null;
    }
  };


  
  //Function to get user's username
  const getName = async () => {
    console.log("getName called");
    try {
      const response = await fetch("http://localhost:5000/dashboard/", 
        {
        method: "GET",
        headers: {token: localStorage.token }
        });

      const parseData = await response.json();
      console.log("Fetched name:", parseData.username);
      setUsername(parseData.username);
    } catch (err) {
      console.error(err.message);
    }
  };
  
  //Function to logout by removing the locally stored JWT token and setting auth to false
  const logout = async e => {
    e.preventDefault();
    try{
        localStorage.removeItem("token");
        setAuth(false);
        toast.success("Logout successful!", {pauseOnHover: false});
    }
    catch(err){
        console.error(err.message);
    }
  };


  const handleNavigation = async () => {

    //Seeing if a user has posted to the class selected
    const hasPosted = await checkIsPosted(userId, classId);

    //Option for if they haven't selected any class
    if (hasPosted === 2){
      toast.error("Select a class!", {pauseOnHover: false});
      return;
    }

    try {  
      //If they have posted, go to view post, otherwise go to class page to be able to post
      if (hasPosted === 1) {
        navigate("/view-posts", { replace: true}); 
      } else {
        navigate("/class", { replace: true}); 
      }
    } catch (err) {
      console.error("Failed to navigate:", err.message);
    }
  };

  //Functionality to make sure useEffect is only called once
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      const initialize = async () => {
        await getName();
        await getOptions();
      };
      initialize();
    }
  }, []);

  //getName and getOptions must be awaited upon because getUserID 
  //and fetchUserClasses rely on them.

  useEffect(() => {
    if (name) {
      getUserId()
    }
  }, [name]);

  useEffect(() => {
    if (userId) {
      fetchUserClasses();
    }
  }, [userId]);


  return (
    <div>

        <div className="dark-overlay"></div>
        <div className="dashboard-logo"><img src={hivemindLogo} alt="Hivemind Logo" className="dashboard-logo" /> </div>

        <div className="dashboard-container">
        <Menu>
          <div className="bm-item-list">
            <a onClick={logout} style={{ display: 'flex', alignItems: 'center' }}>
              <img src={logoutIcon} alt="Logout Icon" style={{ marginRight: '5px', verticalAlign: 'middle', width: '24px', height: '24px' }} /> Logout
            </a>
          </div>
        </Menu>
          <header>
            <h1 className="dashboard-header-left font-tiny5 font-bold text-left text-white text-7xl heading-shadow">Dashboard</h1>
          </header>

          

          <h2 className="dashboard-header-right font-tiny5 font-bold text-left text-white text-3xl heading-shadow">
            <Link to="/profile" className="text-white">{name}</Link>
          </h2>
        </div>

        <div className="your-classes-container">
          <h1 className="font-tiny5 font-bold text-left text-white text-7xl heading-shadow">
            Your Classes
          </h1>
          {classes.length === 0 ? ( // Check if the classes array is empty
            <div className="no-classes-message">
              <h2 className="font-bold text-left text-white text-3xl heading-shadow">
                You have yet to contribute to a hive. Do so below.
              </h2>
            </div>
          ) : ( // If not empty, display them
            <div className="classes-grid">
              {classes.map((classItem) => (
                <div key={classItem.courseId} className="class-box">
                  <h2 className="class-name">{classItem.courseName}</h2>
                  <button 
                    className="view-class-button" 
                    onClick={() => { 
                      setClassId(classItem.courseId); // Update context with class being accessed
                      const courseName = classItem.courseName;
                      setClassName(courseName);
                      navigate("/view-posts", { replace: true });
                    }}
                  >
                    View Posts
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>




    <div className="add-classes-wrapper">
      <h1 className="add-class-heading font-tiny5 font-bold text-left text-white text-7xl heading-shadow">Add a Class</h1>
        <Select
          className="add-class-select"
          options={options}
          value={options.find(option => option.value === classId)}
          onChange={handleSelect}/>
        <button
          onClick={handleNavigation}
          className="add-class-button">
          Join Class
        </button>
      </div>
    </div>
  );
};

export default Dashboard;