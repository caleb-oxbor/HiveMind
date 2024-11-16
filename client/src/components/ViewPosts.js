import React, { Fragment, useEffect, useState } from "react";
import { slide as Menu } from "react-burger-menu";
import { toast } from "react-toastify";
import { Link } from 'react-router-dom';

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
                            <a onClick={logout}>Logout</a>
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
                            {media.map((item, index) => (
                                <li key={index} className="post-item">
                                    <h2 className="font-dotgothic text-white text-2xl">{item.post_title}</h2>
                                    <p className="text-gray-400">Posted by {item.username}</p>
                                    <p className="text-gray-400">Posted on {new Date(item.created_at).toLocaleString()}</p>
                                    <p className="text-green-500">Upvotes: {item.upvotes}</p>
                                    <p className="text-red-500">Downvotes: {item.downvotes}</p>
                                    {item.file_url ? (
                                        <div>
                                            {item.file_type.startsWith("image/") ? (
                                                <img
                                                    src={item.file_url}
                                                    alt={item.post_title}
                                                    className="post-image"
                                                />
                                            ) : item.file_type.startsWith("application/") ? (
                                                <iframe
                                                    src={item.file_url}
                                                    title={item.post_title}
                                                    className="post-pdf"
                                                />
                                            ) : (
                                                <a href={item.file_url} target="_blank" rel="noopener noreferrer">
                                                    Download File
                                                </a>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-red-500">Media file not found</p>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </Fragment>
    );
};

//need to query from post table to get metadata, and from bucket for viewing post

export default ViewPosts;