import React, { Fragment, useEffect, useState, useRef, useContext } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from 'react-router-dom';
import { slide as Menu } from "react-burger-menu";
import './Dashboard.css'
import logoutIcon from '../images/logout.png'; 
import hivemindLogo from '../images/spacebee.png'; 
import supabase from '../supabaseClient'
import Select from "react-select";
import { ClassContext } from "../contexts/ClassContext";


const Dashboard = ({ setAuth }) => {
  const [name, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [options, setOptions] = useState([]);
  const [classes, setClasses] = useState([]);
  const navigate = useNavigate();
  const { classId, setClassId } = useContext(ClassContext);

  const handleSelect = (selectedOption) =>{
    setClassId(selectedOption.value);
  }

  const getOptions = async () => {
    console.log("getOptions called");

    try {
      const { data, error } = await supabase
        .from("courses")
        .select("course_name, course_code, course_id") 
  
      if (error) throw error;

      const formattedOptions = data.map((course) => ({
        value: `${course.course_id}`, 
        label: `${course.course_code}: ${course.course_name}` 
      }));
     
      console.log("Options: ", formattedOptions);
      setOptions(formattedOptions);

    } catch (err) {
      console.error("Error checking if user has posted:", err.message);
    }
  }

  const fetchUserClasses = async () => {


    console.log("getClasses called");
    try {

      if (!userId) {
        console.error("User ID is invalid. Cannot fetch user classes.");
        return;
      }

      const { data: posts, error: postsError } = await supabase
        .from("posts")
        .select("course_id") 
        .eq("user_id", userId);
  
      if (postsError) throw postsError;
  
      const uniqueClassIds = [...new Set(posts.map(post => post.course_id))];
  
      console.log("Class IDs: ", uniqueClassIds);

      const { data: courses, error: coursesError } = await supabase
        .from("courses")
        .select("course_id, course_name")
        .in("course_id", uniqueClassIds);
  
      if (coursesError) throw coursesError;
  
      const classesWithNames = uniqueClassIds.map(classId => {
        const course = courses.find(course => course.course_id === classId);
        return {
          courseId: classId,
          courseName: course ? course.course_name : "Unknown Course",
        };
      });
  
      console.log("Classes with names: ", classesWithNames);
      setClasses(classesWithNames); 
    } catch (err) {
      console.error("Error fetching user classes:", err.message);
    }
  };

  //have to check if user posts has given classes ID
  const checkIsPosted = async (userID, classId) => {
    try {
      const { data, error } = await supabase
        .from("posts") // Replace "posts" with your actual table name
        .select("user_id, course_id") // Adjust columns if needed (e.g., 'id' or specific fields)
        .eq("user_id", userID) // Filter by user ID
        .eq("course_id", classId); // Filter by class ID
  
      if (error) throw error;

        console.log("POSTING DATA: ", data);

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
    if (name == "") {
      console.error("User name is not set. Cannot fetch user ID.");
      return null;
    }

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
  
      setUserId(data.user_id);
      return data.user_id;
    } catch (err) {
      console.error("Unexpected error querying user ID:", err.message);
      return null;
    }
  };
  

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

    console.log("Dashboard Class ID:", classId);

    const hasPosted = await checkIsPosted(userId, classId);

    if (hasPosted === 2){
      toast.error("Select a class!");
      return;
    }

    try {  
      if (hasPosted === 1) {
        navigate("/view-posts", { replace: true}); 
      } else {
        navigate("/class", { replace: true}); 
      }
    } catch (err) {
      console.error("Failed to navigate:", err.message);
    }
  };

  const initialized = useRef(false);


  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      const initialize = async () => {
        console.log("Initializing...");
        await getName();
        await getOptions();
      };
      initialize();
    }
  }, []);

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
        <h1 className="font-tiny5 font-bold text-left text-white text-7xl heading-shadow">
          Your Classes
        </h1>
        <div className="classes-grid">
          {classes.map(classItem => (
            <div key={classItem.courseId} className="class-box">
              <h2 className="class-name">{classItem.courseName}</h2>
              <button 
                className="view-class-button" 
                onClick={() => {
                  setClassId(classItem.courseId)
                  navigate("/view-posts", {replace: true})
                }
                }>
                View Posts
              </button>
            </div>
          ))}
        </div>
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
          className="mt-10 font-dotgothic custom-button"> Join Class
          </button>
    </div>
  );
};

export default Dashboard;