import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';


const Blog = ({ blog, fetchBlogs, notify }) => {
  //console.log(blog)
  const [likes, setLikes] = useState(blog.likes);
  const [viewInfo, setViewInfo] = useState(false);

  const handleLike = async () => {
    try {
      const updatedBlog = {
        ...blog,
        likes: blog.likes + 1
      };

      console.log("handle like",updatedBlog)

      const response = await axios.put(`http://localhost:3001/api/blogs/${blog.id}`, updatedBlog);
      setLikes(response.data.likes);
      fetchBlogs();
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  const handleDelete = async (blogId) => {
    if (!window.confirm(`Are you sure you want to delete the blog "${blog.title}"?`)) return;
    console.log("handleDelete: "+blogId)
    try {
      const response = await fetch("http://localhost:3001/api/blogs/"+blogId, {
        method: 'DELETE',
      });
      
      if (response.status === 204) {
        console.log("Deleted blog post");
        fetchBlogs();
        notify(`Blog post deleted successfully`, false);
      }
      else {
        console.error("Failed to delete blog post");
        notify("Failed to delete blog post", true);
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      notify("Failed to delete blog post", true);
    }
  };
  
  return (
    <div className="blog">
      <h2>
        {blog.title}<span> by {blog.author}</span>
        <button id="view" button onClick={() => setViewInfo(!viewInfo)}>
          {viewInfo ? 'hide' : 'view'}
        </button>
  
        {viewInfo && (
          <div>
            <p>{blog.url}</p>
            <label id="likes">{likes}</label>
            <button id="like" button onClick={() => handleLike(blog)}>Like</button>

            {blog.user && blog.user.username === localStorage.getItem("loginUsername") && (
              <button id="delete" button onClick={() => handleDelete(blog.id)}>Delete</button>
            )}
          </div>
        )}
      </h2>
    </div>
  );  
}

Blog.propTypes = {
  blog: PropTypes.shape({
    id: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    user: PropTypes.shape({
      username: PropTypes.string.isRequired
    })
  }).isRequired,
  fetchBlogs: PropTypes.func.isRequired,
  notify: PropTypes.func.isRequired
};

export default Blog