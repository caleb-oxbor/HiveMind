import React, { Fragment, useEffect, useState} from "react";
import { slide as Menu } from "react-burger-menu";
import { toast } from "react-toastify";
import { Link, useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient'

const ViewPosts = ({ setAuth, classID }) => {
    const [name, setUsername] = useState("");
    const navigate = useNavigate();
    const [media, setMedia] = useState([[]]);


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
            // await supabase.auth.signOut(); if we want to use supabase auth
            localStorage.removeItem("token");
            setAuth(false);
            toast.success("Logout successfully");
        }
        catch(err){
            console.error(err.message);
        }
      };

    const getMedia = async () => {
        const{data, error} = await supabase
          .storage
          .from('classPosts')
          .list(`${classID}/`,{
            limit: 10,
            offset: 0,
            sortBy: {column: 'name', order: 'asc'}
          });
        
        if(data){
          setMedia(data);
        }else{
          console.log('meow: ',error);
        }
    };

    //const getFileUrl = (filePath) => `http://localhost:5000/${filePath}`;

    const getFileUrl = (file_name) =>
        supabase.storage
          .from("classPosts")
          .getPublicUrl(`${classID}/${file_name}`).data.publicUrl;


    const handleDownload = async (file_path, file_name) => {
        try {
            const { data, error } = await supabase.storage
            .from("classPosts")
            .download(file_path);
      
          if (error) throw error;
      
          const url = window.URL.createObjectURL(data);
          const a = document.createElement("a");
          a.href = url;
          a.download = file_name || "download";
      
          document.body.appendChild(a);
          a.click();
          a.remove();
      
          window.URL.revokeObjectURL(url);
        } catch (err) {
          console.error("Download failed:", err.message);
        }
      };
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
                        {media.map((item) => (
                        <li key={item.id} className="post-item">
                            <h2 className="font-dotgothic text-white text-2xl">{item.name}</h2>
                            <div>
                            <iframe
                                src={getFileUrl(item.name)}
                                title={item.name}
                                className="post-frame"
                            />
                            </div>
                            <button
                            onClick={() => handleDownload(`${name}/${item.name}`, item.post_title)}
                            className="download-button"
                            >
                            Download
                            </button>
                        </li>
                        ))}
                    </ul>
                )}
            </div>
            </div>
            </Fragment>
    );

export default ViewPosts;