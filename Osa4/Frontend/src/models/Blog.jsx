import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Blog = ({ blog, fetchBlogs }) => {
  //const [blogs, setBlogs] = useState([]);
  const [likes, setLikes] = useState(blog.likes);
  const [newBlog, setNewBlog] = useState({
    title: 'Testblog',
    author: '',
    url: 'google.com',
    likes: 0
  });

  const handleLike = async () => {
    try {
      const response = await axios.put("http://localhost:3001/api/blogs/"+blog.id+"/like");
      const updatedBlog = response.data;
      setLikes(updatedBlog.likes);
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  const handleDelete = async (blogId) => {
    console.log("handleDelete: "+blogId)
    try {
      const response = await fetch("http://localhost:3001/api/blogs/"+blogId, {
        method: 'DELETE',
      });
      
      if (response.status === 204) {
        console.log("Deleted blog post");
        fetchBlogs();
      }
      else console.error("Failed to delete blog post");
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handlePost = async () => {
    try {
      const authToken = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('loginToken')}`
        }
      };
      const response = await axios.post("http://localhost:3001/api/blogs", newBlog, authToken);
      if (response.status === 200) {
        console.log("Blog post created:", response.data);
        fetchBlogs();
        setNewBlog({
          title: 'Testblog',
          author: '',
          url: 'google.com',
          likes: 0
        });
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };
  
  
  return (
    <div>
      <h2>{blog.title}<span> by {blog.author}</span></h2>
      <p>{blog.url}</p>
      <p>{likes} <button onClick={handleLike}>Like</button></p>
      <p><button onClick={() => {
          handleDelete(blog.id);
          console.log(blog);
        }}>Delete</button></p>
    </div>
  );
}

export default Blog;