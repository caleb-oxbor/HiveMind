import React, { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { slide as Menu } from "react-burger-menu";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import supabase from '../supabaseClient'

const CreatePost = ({setCreated, setAuth}) => {
  const [name, setUsername] = useState("");
  const [newPost, setNewPost] = useState(null);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const post_id = uuidv4();
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
      "text/html",
      "text/plain"
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
    const userFilePath = `${name}/${post_id}`;
    const classFilePath = `${classID}/${post_id}`;

    const { data: { user } } = await supabase.auth.getUser();
    console.log("User:", user);

    const { data, error } = await supabase
      .storage
      .from('userPosts')
      .upload(userFilePath, newPost);

    if (error) {
      console.error("Supabase upload error:", error);
      setError("File upload failed.");
      return null;
    }

    if(data){
      console.log("got media");
    }else{
      console.log(error);
    }

    const {data2, error2 } = await supabase
      .storage
      .from('classPosts')
      .upload(classFilePath, newPost);
    
    if (error2) {
      console.error("Supabase upload error:", error);
      setError("File upload failed.");
      return null;
    }

      return classFilePath; 
  };
  

  const onSubmitForm = async (e) => {
      e.preventDefault();
      if (!newPost) {
        setError("Please select a valid file before submitting.");
        return;
      }

      const id = await fetchUserId();
      console.log("Retrieved user:", id);
      console.log("Error:", error);
  
      //not sure if necessary can use later maybe, just want to get working
      // const filePath = await uploadFileToSupabase();
      // console.log('Filepath', filePath);
      // if (!filePath) {
      //     setError("Please select a valid file before submitting. Meow.");
      //     return;
      // }
      
      const { data : insertedPost, error : insertedPostError } = await supabase
      .from('posts')
        .insert([{
          user_id: id,
          course_id: 2, 
          post_title: title, 
          created_at: new Date().toISOString(),
        }])

        uploadFileToSupabase();


    if (insertedPostError) {
      console.error("Failed to save post metadata:", insertedPostError);
      setError("Failed to create post metadata.");
    } else {
      toast.success("Post created successfully!");
      setCreated(true); 
      navigate("/dashboard", { replace: true }); 
      navigate("/view-posts", {replace: true}); 
    }
  };

  const fetchUserId = async () => {
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

      {/* {media.map((media) => {
        return (<>
          <div>
            <iframe src={`https://jbqwoenlfrfgsrkimwyx.supabase.co/storage/v1/object/public/userPosts/${name}/${media.name}`} />
          </div>
        </>
        )
      })} */}

      </Fragment>
  );
};

  
export default CreatePost;