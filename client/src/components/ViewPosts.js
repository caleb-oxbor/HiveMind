import React, { useEffect, useState } from "react";

const ViewPosts = () => {
    const [posts, setPosts] = useState([]);

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

    return (
        <div className="posts-container">
            <h1 className="font-tiny5 font-bold text-left text-white text-7xl heading-shadow">Class Example</h1>
            {posts.length === 0 ? (
                <p>No posts available</p>
            ) : (
                <ul className="posts-list">
                    {posts.map((post) => (
                        <li key={post.post_id} className="post-item">
                            <h2 className="font-dotgothic text-white text-2xl">{post.post_title}</h2>
                            <p className="font-dotgothic">{new Date(post.created_at).toLocaleString()}</p>

                            {/* Render JPEG/PNG as <img> and PDFs as <iframe> */}
                            {post.post_type.startsWith("image/") ? (
                                <img
                                    src={getFileUrl(post.post_content)}
                                    alt={post.post_title}
                                    className="post-image"
                                />
                            ) : post.post_type === "application/pdf" ? (
                                <iframe
                                    src={getFileUrl(post.post_content)}
                                    title={post.post_title}
                                    className="post-pdf"
                                    frameBorder="0"
                                />
                            ) : (
                                <p>Unsupported file type</p>
                            )}

                            {/* Download button for all files */}
                            <a
                                href={getFileUrl(post.post_content)}
                                download
                                className="download-button"
                            >
                                Download
                            </a>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ViewPosts;
