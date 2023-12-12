import React, { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const BlogForm = ({ fetchBlogs, notify, setShowCreateForm }) => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [url, setUrl] = useState('');

    const handlePost = async () => {
        try {
            const blogData = {
                title,
                author,
                url,
                likes: 0
            };
            const authToken = {
                headers: {
                Authorization: `Bearer ${localStorage.getItem('loginToken')}`
            }
        };
        const response = await axios.post("http://localhost:3001/api/blogs", blogData, authToken);
        if (response.status === 200) {
            console.log("Blog post created:", response.data);
            fetchBlogs();
            notify("Successfully posted a new blog "+title, false);
            setShowCreateForm(false);
        }
        } catch (error) {
        console.error("Error creating post:", error);
        notify("Failed to post blog", true);
        }
    };

    return (
        <div>
        <input id="new-title" input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
        <input id="new-author" input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Author" />
        <input id="new-url" input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="URL" />
        <button id="submit-blog" button onClick={handlePost}>Create new blogpost</button>
        <button onClick={() => setShowCreateForm(false)}>Cancel</button>
        </div>
    );
};

BlogForm.propTypes = {
    fetchBlogs: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
    setShowCreateForm: PropTypes.func.isRequired
};

export default BlogForm;
