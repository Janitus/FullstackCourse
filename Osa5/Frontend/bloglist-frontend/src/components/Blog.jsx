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

      /* console output, should match task 5.9?
        handle like 
        {title: 'asd', author: 'testdude', url: 'asd', likes: 19, user: {…}, …}
        author
        : 
        "testdude"
        id
        : 
        "6570e3aac97977108316d32f"
        likes
        : 
        19
        title
        : 
        "asd"
        url
        : 
        "asd"
        user
        : 
        {username: 'test', name: 'testdude', id: '6536921232568058a747a2d9'}
        [[Prototype]]
        : 
        Object
      */

      const response = await axios.put(`http://localhost:3001/api/blogs/${blog.id}`, updatedBlog);
      setLikes(response.data.likes);
      //const response = await axios.put("http://localhost:3001/api/blogs/"+blog.id+"/like");
      //const updatedBlog = response.data;
      //setLikes(updatedBlog.likes);
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
        //setBlogs(updatedBlogs);
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
        <button onClick={() => setViewInfo(!viewInfo)}>
          {viewInfo ? 'hide' : 'view'}
        </button>

        {viewInfo && (
          <div>
            <p>{blog.url}</p>
            <p>{likes} <button onClick={handleLike}>Like</button></p>
            {blog.user && blog.user.username === localStorage.getItem("loginUsername") && (
              <button onClick={() => handleDelete(blog.id)}>Delete</button>
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

//const Blog = ({ blog }) => (
//  <div>
//    {blog.title} {blog.author}
//  </div>  
//)

export default Blog