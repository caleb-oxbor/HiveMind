import React, { Fragment, useEffect, useState } from "react";
import { slide as Menu } from "react-burger-menu";
import { toast } from "react-toastify";
import { Link, useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient'
import logoutIcon from '../images/logout.png'; 
import '@react-pdf-viewer/core/lib/styles/index.css';

const ViewPosts = ({ setAuth }) => {
    const [name, setUsername] = useState("");
    const [media, setMedia] = useState([[]]);
    // const classID = 2;

    const fetchPosts = async () => {
        try {
            const response = await fetch(`http://localhost:5000/view-posts/?classID=2`, {
                method: "GET",
                headers: { token: localStorage.token },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch posts");
            }

            const data = await response.json();
            setMedia(data);
        } catch (err) {
            console.error("Error fetching posts:", err.message);
        }
    };

    const handleDownload = async (post) => {
        try {
            console.log(post.course_id);
            console.log(post.file_name);
            const response = await fetch(
                `http://localhost:5000/download/${post.course_id}/${post.file_name}`,
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
            a.download = post.post_title || "download";
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Download failed", err);
        }
    };
    
    const logout = () => {
        localStorage.removeItem("token");
        setAuth(false);
        toast.success("Logged out successfully!");
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
    <Fragment>
    <div>
    <div className="dashboard-container">
      <div className="burger-menu-container">
        <Menu >
          <Link to="/dashboard">Home</Link>
          <a onClick={logout} style={{ display: 'flex', alignItems: 'center' }}>
          <img src={logoutIcon} alt="Logout Icon" style={{ marginRight: '5px', verticalAlign: 'middle', width: '24px', height: '24px' }} /> Logout
          </a>
        </Menu>
      </div>

                    <header>
                        <h1 className="font-tiny5 font-bold text-left text-white text-5xl">HiveMind</h1>
                    </header>
                    <h2 className="font-tiny5 font-bold text-right text-white text-2xl heading-shadow">
                        <Link to="/profile" className="text-white">{name}</Link>
                    </h2>
                </div>
                <div className="posts-container">
                    <Link to="/create-post">
                        <button className="font-dotgothic custom-button">Add a Post</button>
                    </Link>
                    <h1 className="font-tiny5 font-bold text-left text-white text-7xl heading-shadow">
                        Class Example
                    </h1>
                    {media.length === 0 ? (
                        <p>No posts available</p>
                    ) : (
                        <ul className="posts-list">
                            {media.map((item, index) => {
                                return (
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
                                );
                            })}
                        </ul>
                    )}
                </div>
            </div>
        </Fragment>
    );
};

export default ViewPosts;