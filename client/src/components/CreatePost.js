import React, { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { slide as Menu } from "react-burger-menu";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import supabase from '../supabaseClient'

console.log('Supabase URL:', process.env.REACT_APP_SUPABASE_URL);
console.log('Supabase Anon Key:', process.env.REACT_APP_SUPABASE_ANON_KEY);

const CreatePost = ({setCreated, setAuth}) => {
    const [name, setUsername] = useState("");
    const [newPost, setNewPost] = useState(null);
    const [title, setTitle] = useState("");
    const [error, setError] = useState("");
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


    const allowedFileTypes = [
        "image/jpeg", "image/png", "image/jpg",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "text/html"
    ];

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && allowedFileTypes.includes(file.type)) {
            setNewPost(file);
            setError("");
        } else {
            setNewPost(null);
            setError("Unsupported file type. Please upload a valid file.");
        }
    };
    
    const uploadFileToSupabase = async () => {
        const filePath = name + "/" + uuidv4();
        const { data, error } = await supabase
          .storage
          .from('posts')
          .upload(filePath, newPost);
    
        if (error) {
          console.error("Supabase upload error:", error);
          setError("File upload failed.");
          return null;
        }
    
        return filePath; 
      };
    
    const onSubmitForm = async (e) => {
        e.preventDefault();
        if (!newPost) {
          setError("Please select a valid file before submitting.");
          return;
        }
    
        const filePath = await uploadFileToSupabase();
        if (!filePath) {
            setError("Please select a valid file before submitting.");
            return;
        }
        
        const { data, error } = await supabase
        .from('posts')
        .insert([
          {
            title,
            file_path: filePath,
            file_type: newPost.type,
            user_id: name,
          }
        ]);
  
      if (error) {
        console.error("Failed to save post metadata:", error);
        setError("Failed to create post metadata.");
      } else {
        toast.success("Post created successfully!");
      }
      };


    // const onSubmitForm = async e => {
    //     e.preventDefault();
    //     if (!newPost) {
    //         setError("Please select a valid file before submitting.");
    //         return;
    //     }

    //     try {
    //         const formData = new FormData();
    //         formData.append("newPost", newPost);
    //         formData.append("title", title);
            
    //         const response = await fetch("http://localhost:5000/dashboard/create-post", {
    //             method: "POST",
    //             headers: {
    //                 "token": localStorage.token, 
    //             },
    //             body: formData,
    //         });

    //         if (response.ok) {
    //             console.log("Post created successfully!");
    //             setCreated(true); 
    //             navigate("/dashboard", { replace: true }); 
    //             navigate("/view-posts", {replace: true}); 
    //         } else {
    //             console.error("Failed to create post.");
    //         }

    //     }catch (err){
    //         console.error(err.message);
    //     }
    // }

    return (
    <Fragment>
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