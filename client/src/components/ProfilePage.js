import React, { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link } from 'react-router-dom';
import { slide as Menu } from "react-burger-menu";
import logoutIcon from '../images/logout.png'; 
import hivemindLogo from '../images/spacebee.png'; 
import "./ProfilePage.css";

const Profile = ({ setAuth }) => {
  const [name, setUsername] = useState("");
  const [userEmail, setEmail] = useState("");
  const [media, setMedia] = useState({});

  const fetchPosts = async () => {
    try {
        const response = await fetch("http://localhost:5000/profile/profile-posts", {
            method: "GET",
            headers: { token: localStorage.token },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch posts");
        }

        const data = await response.json();

        const groupedMetadata = data.reduce((acc, metaItem) => {
          const courseName = metaItem.course_name;
          if (!acc[courseName]) {
            acc[courseName] = [];
          }
          acc[courseName].push(metaItem);
          return acc;
        }, {});

        setMedia(groupedMetadata);
    } catch (err) {
        console.error("Error fetching posts:", err.message);
    }
  };

  const handleDownload = async (metaItem) => {
      try {
          console.log(metaItem.course_id);
          console.log(metaItem.file_name);
          const response = await fetch(
              `http://localhost:5000/download/${metaItem.course_id}/${metaItem.file_name}`,
              {
                  method: "GET",
                  headers: { token: localStorage.token }, // Include auth token if needed
              }
          );

          if (!response.ok) {
              throw new Error("Failed to download file");
          }

          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = metaItem.post_title || "download";
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.URL.revokeObjectURL(url);
      } catch (err) {
          console.error("Download failed", err);
      }
  };

  const getName = async () => {
    try {
      const response = await fetch("http://localhost:5000/profile", 
        {
        method: "GET",
        headers: {token: localStorage.token }
        });

      const parseData = await response.json();
      // console.log(parseData);

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
    fetchPosts();
  }, []);

  return (
    <div className="full-bg">

        <div className="dark-overlay"></div>

        <div className="dashboard-container">
        <Menu>
          <Link to="/dashboard">Home</Link>
          <a onClick={logout} style={{ display: 'flex', alignItems: 'center' }}>
            <img src={logoutIcon} alt="Logout Icon" style={{ marginRight: '5px', verticalAlign: 'middle', width: '24px', height: '24px' }} /> Logout
          </a>
        </Menu>

          <header>
            <h1 className="dashboard-header-left font-tiny5 font-bold text-left text-white text-7xl heading-shadow">Profile</h1>
          </header>

          <div className="dashboard-logo">
            <img src={hivemindLogo} alt="Hivemind Logo" style={{ width: '70px', height: '70px' }} /> 
          </div>

          <h2 className="dashboard-header-right font-tiny5 font-bold text-left text-white text-3xl heading-shadow">
            <Link to="/profile" className="text-white">{name}</Link>
          </h2>

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

        <div className="posts-container">
          {Object.keys(media).length === 0 ? (
            <p>No posts available</p>
          ) : (
            Object.keys(media).map((course) => (
              <div key={course}>
                <h2 className="font-tiny5 font-bold text-left text-white text-5xl heading-shadow">{course}</h2>
                <ul className="posts-list">
                  {media[course].map((item, index) => (
                    <li key={index} className="post-item">
                      <h2 className="font-dotgothic text-white text-2xl">{item.post_title}</h2>
                      <p className="text-gray-400">Posted by {item.username}</p>
                      <p className="text-gray-400">Posted on {new Date(item.created_at).toLocaleString()}</p>
                      <p className="text-green-500">Votes: {item.votes}</p>
                      {item.file_url && (
                        <div>
                          {item.file_type.startsWith("image/") && (
                            <img
                              src={item.file_url}
                              alt={item.post_title}
                              className="post-image"
                            />
                          )}
                          {item.file_type === "application/pdf" && (
                            <iframe
                              src={item.file_url}
                              title={item.post_title}
                              className="post-pdf"
                            />
                          )}
                          <a
                            onClick={() => handleDownload(item)}
                            className="download-button"
                            style={{ cursor: "pointer", marginTop: "10px", display: "block" }}
                          >
                            Download
                          </a>
                        </div>
                      )}
                      {!item.file_url && (
                        <p className="text-red-500">Media file not found</p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>


  </div>
  );
};

export default Profile;