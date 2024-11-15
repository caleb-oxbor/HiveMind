import React, { Fragment, useEffect, useState} from "react";
import { slide as Menu } from "react-burger-menu";
import { toast } from "react-toastify";
import { Link, useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient'

const ViewPosts = ({ setAuth }) => {
    const [name, setUsername] = useState("");
    const navigate = useNavigate();
    const [media, setMedia] = useState([[]]);
    const classID = 2;

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
            // await supabase.auth.signOut(); if we want to use supabase auth, but session doesnt exist
            localStorage.removeItem("token");
            setAuth(false);
            toast.success("Logout successfully");
        }
        catch(err){
            console.error(err.message);
        }
      };

    const getMedia = async () => {
    try {
        const { data: metadata, error: metadataError } = await supabase
        .from("posts")
        .select("user_id, username, post_title, created_at, upvotes, downvotes, file_name")
        .eq("course_id", classID);

        console.log("Metadata:", metadata);
    
        if (metadataError) {
        console.error("Error fetching metadata:", metadataError);
        return;
        }
    
        const { data: mediaFiles, error: bucketError } = await supabase
        .storage
        .from("classPosts")
        .list(`${classID}/`, {
            limit: 10,
            offset: 0,
            sortBy: { column: "name", order: "asc" },
        });
    
        if (bucketError) {
        console.error("Error fetching media files:", bucketError);
        return;
        }
    
        // Combine metadata and media files based on the `file_name` field
        const combinedData = metadata.map((metaItem) => {
            const file_url = supabase.storage
              .from("classPosts")
              .getPublicUrl(`${classID}/${metaItem.file_name}`).data.publicUrl;
      
            return {
              ...metaItem,
              file_url, // Attach the generated file URL
            };
        });
      
    
        setMedia(combinedData);
    } catch (error) {
        console.error("Error in getMedia:", error);
    }
    };
    

const getFileUrl = (file_name) =>
    supabase.storage
        .from("classPosts")
        .getPublicUrl(`${classID}/${file_name}`).data.publicUrl;


const handleDownload = async (file_URL) => {
    try {    
        const url = window.URL.createObjectURL(file_URL);
        const a = document.createElement("a");
        a.href = url;
        a.download = file_URL || "download";
    
        document.body.appendChild(a);
        a.click();
        a.remove();
    
        window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Download failed:", err.message);
    }
};

    
    useEffect(() => {
        getName();
        if (classID) { //ensure that classID and name are available before attempting to get media
          getMedia();
        }
    }, [classID]);
    

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
                            <p className="text-gray-400">Posted by User {item.username}</p>
                            <p className="text-gray-400">Posted on {new Date(item.created_at).toLocaleString()}</p>
                            <p className="text-green-500">Upvotes: {item.upvotes}</p>
                            <p className="text-red-500">Downvotes: {item.downvotes}</p>
                            {item.file_url ? (
                            <div>
                                <iframe
                                src={item.file_url}
                                title={item.post_title}
                                className="post-frame"
                                />
                                <button
                                onClick={() => handleDownload(item.file_url)}
                                className="download-button font-dotgothic"
                                >
                                Download
                                </button>
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