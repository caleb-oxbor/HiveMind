import React, { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { slide as Menu } from "react-burger-menu";
import { useNavigate, Link } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

import './Dashboard.css'
import logoutIcon from '../images/logout.png'; 
import hivemindLogo from '../images/spacebee.png'; 
import supabase from '../supabaseClient'

import { useContext } from "react";
import { ClassContext } from "../contexts/ClassContext";


//removed setcreate parameter 
const CreatePost = ({ setAuth }) => {
  const [name, setUsername] = useState("");
  const [newPost, setNewPost] = useState(null);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [fileType, setFileType] = useState("");
  const navigate = useNavigate();
  const post_id = uuidv4();

  const { classId } = useContext(ClassContext);

  console.log("Class ID in Post:", classId);

  const getName = async () => {
    try {
      // console.log(localStorage.token);
      const response = await fetch("http://localhost:5000/dashboard/",
        {
          method: "GET",
          headers: { token: localStorage.token }
        });

      const parseData = await response.json();
      setUsername(parseData.username);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getName();
  }, []);


  const logout = async e => {
    e.preventDefault();
    try {
      localStorage.removeItem("token");
      setAuth(false);
      toast.success("Logout successfully", {pauseOnHover: false});
    }
    catch (err) {
      console.error(err.message);
    }
  };


  const allowedFileTypes = [
    "image/jpeg", "image/png", "image/jpg",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "text/html",
    "text/plain"
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && allowedFileTypes.includes(file.type)) {
      setNewPost(file);
      setFileType(file.type);
      setError("");
    } else {
      setNewPost(null);
      setFileType("");
      setError("Unsupported file type. Please upload a valid file.");
    }
  };

  const uploadFile = async () => {
    try {
      const formData = new FormData();
      formData.append("file", newPost);
      formData.append("post_title", title);
      formData.append("post_id", post_id);
      formData.append("classID", classId);
      formData.append("file_type", fileType);

      const response = await fetch("http://localhost:5000/create-post/", {
        method: "POST",
        headers: { token: localStorage.token },
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Post created successfully!", {pauseOnHover: false});
        // navigate("/dashboard", { replace: true, state: {classId} });
        console.log("PRE CHECK ID = ", classId);
        navigate("/view-posts", { replace: true, state: {classId} });
      } else {
        setError(result.error || "File upload failed.");
      }
    } catch (error) {
      console.error("Unexpected error:", error.message);
      setError("An unexpected error occurred.");
    }
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();
    if (!newPost) {
      setError("Please select a valid file before submitting.");
      return;
    }

    uploadFile();
  };

  return (
    <Fragment>
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
            <h1 className="dashboard-header-left font-tiny5 font-bold text-left text-white text-7xl heading-shadow">HiveMind</h1>
        </header>  

        <img src={hivemindLogo} alt="Hivemind Logo" className="dashboard-logo" /> 

        <h2 className="dashboard-header-right font-tiny5 font-bold text-left text-white text-3xl heading-shadow">
        <Link to="/profile" className="text-white">{name}</Link>
      </h2>
        </div>
        <h1 className="font-tiny5 font-bold text-center text-white text-8xl mt-10 mb-3 heading-shadow">Create Post</h1>
        <form onSubmit={onSubmitForm}>
            <input type="text" 
                placeholder="Add a Title" 
                className="form-control font-dotgothic mb-3"
                value={title}
                onChange={e => setTitle(e.target.value)}/>
            <input type="file" 
                className="form-control font-dotgothic"
                onChange={handleFileChange} />
            {error && (
                <div className="alert alert-danger mt-3">
                    Error: <strong>{error}</strong>
                </div>
            )}
            <button className="mt-10 font-dotgothic custom-button">Submit</button>
        </form>

    </Fragment>
  );
};


export default CreatePost;