import React, { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link } from 'react-router-dom';

const CreatePost = () => {
    const [newPost, setNewPost] = useState(null);
    const [title, setTitle] = useState("");
    
    const onSubmitForm = async e => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("newPost", newPost);
            formData.append("title", title);

            const token = localStorage.getItem("token");
            
            const response = await fetch("http://localhost:5000/dashboard/create-post", {
                method: "POST",
                headers: {
                    "token": token, 
                },
                body: formData,
            });

            if (response.ok) {
                console.log("Post created successfully!");
            } else {
                console.error("Failed to create post.");
            }

        }catch (err){
            console.error(err.message);
        }
    }

    return (
    <Fragment>
        <h1 className="font-tiny5 font-bold text-center text-white text-8xl mt-10 mb-1 heading-shadow">Create Post</h1>
        <form onSubmit={onSubmitForm}>
            <input type="text" 
                placeholder="Add a Title" 
                className="form-control font-dotgothic"
                value={title}
                onChange={e => setTitle(e.target.value)}/>
            <input type="file" 
                className="form-control font-dotgothic"
                onChange={(e) => setNewPost(e.target.files[0])} />
            <button className="mt-10 font-dotgothic custom-button">Submit</button>
        </form>
        </Fragment>
    );
};

  
export default CreatePost;