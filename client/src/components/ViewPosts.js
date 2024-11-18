import React, { useEffect, useState} from "react";
import { slide as Menu } from "react-burger-menu";
import { toast } from "react-toastify";
import { Link, useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient'
import logoutIcon from '../images/logout.png'; 

const ViewPosts = ({ setAuth }) => {
    const [name, setUsername] = useState("");
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();

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

      useEffect(() => {
        getName();
      }, []);
    
      
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
        const fetchPosts = async () => {
            try {
                const response = await fetch("http://localhost:5000/dashboard/posts", {
                    headers: { token: localStorage.token },
                });

                if (response.ok) {
                    const data = await response.json();
                    setPosts(data); // Store posts in state
                } else {
                    console.error("Failed to fetch posts");
                }
            } catch (err) {
                console.error(err.message);
            }
        };

        fetchPosts();
    }, []);

    const getFileUrl = (filePath) => `http://localhost:5000/${filePath}`;

    const renderFile = (post) => {
        const fileUrl = getFileUrl(post.post_content);

        if (post.post_type.startsWith("image/")) {
            return <img src={fileUrl} alt={post.post_title} className="post-image" />;
        } 
        else if (post.post_type === "application/pdf") {
            return (
                <iframe
                    src={fileUrl}
                    title={post.post_title}
                    className="post-pdf"
                />
            );
        } 
        else if (post.post_type.startsWith("video/")) {
            return (
                <video controls className="post-video">
                    <source src={fileUrl} type={post.post_type} />
                    Your browser does not support the video tag.
                </video>
            );
        } 
        else if (post.post_type.startsWith("audio/")) {
            return (
                <audio controls className="post-audio">
                    <source src={fileUrl} type={post.post_type} />
                    Your browser does not support the audio element.
                </audio>
            );
        } 
        else if (post.post_type === "application/msword" || post.post_type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            // Word document
            return (
                <iframe
                    src={`https://docs.google.com/gview?url=${fileUrl}&embedded=true`}
                    title={post.post_title}
                    className="post-doc"
                />
            );
        } 
        else if (post.post_type === "application/vnd.ms-excel" || post.post_type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
            // Excel document
            return (
                <iframe
                    src={`https://docs.google.com/gview?url=${fileUrl}&embedded=true`}
                    title={post.post_title}
                    className="post-doc"
                />
            );
        } 
        else if (post.post_type === "application/vnd.ms-powerpoint" || post.post_type === "application/vnd.openxmlformats-officedocument.presentationml.presentation") {
            // PowerPoint presentation
            return (
                <iframe
                    src={`https://docs.google.com/gview?url=${fileUrl}&embedded=true`}
                    title={post.post_title}
                    className="post-doc"
                />
            );
        } 
        else if (post.post_type === "text/html") {
            // HTML file
            return (
                <iframe
                    src={fileUrl}
                    title={post.post_title}
                    className="post-html"
                />
            );
        } 
        else {
            return (
                <p>
                    Unsupported file type. <a href={fileUrl} download>Download the file</a> to view it.
                </p>
            );
        }
    };

    const handleDownload = async (post) => {
        try {
            const response = await fetch(getFileUrl(post.post_content), {
                headers: { token: localStorage.token },
            });
    
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = post.post_title || 'download';
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Download failed', err);
        }
    };
    

    return (
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
            {posts.length === 0 ? (
                <p>No posts available</p>
            ) : (
                <ul className="posts-list">
                    {posts.map((post) => (
                        <li key={post.post_id} className="post-item">
                            <h2 className="font-dotgothic text-white text-2xl">
                                {post.post_title}
                            </h2>
                            <p className="font-dotgothic">
                                {new Date(post.created_at).toLocaleString()}
                            </p>

                            {/* Render the file based on type */}
                            {renderFile(post)}

                            {/* Download button for all files */}
                            <a
                            onClick={() => handleDownload(post)}
                            className="download-button"
                            style={{ cursor: 'pointer' }}
                            >
                            Download
                            </a>
                        </li>
                    ))}
                </ul>
            )}
        </div>
        </div>
    );
};

export default ViewPosts;