import React from 'react';
import { useState, useEffect } from 'react';

const Blog = ({ blog }) => {
  const [blogs, setBlogs] = useState([]);
  const [likes, setLikes] = useState(blog.likes);

  const handleLike = () => {
    //setLikes(likes + 1);
  };

  useEffect(() => {
    fetch('http://localhost:3001/api/blogs')
      .then(response => response.json())
      .then(data => {
        setBlogs(data);
      })
      .catch(error => {
        console.error("ERROR! Can't fetch blogs:", error);
      });
  }, []);

  // Hakee nyt blogipostit backendistä mutta homma ei tahdo toimia ihan vielä koska tulee miljoonaa samaa postia esille. Ei ihan näillä eväillä vielä jatkoon. Jatka huomenna täältä!
  return (
    <div>
      {blogs.map(blog => (
        <div key={blog}>
          <h2>{blog.title}<span> by {blog.author}</span></h2>
          <p>{blog.url}</p>
          <p>{likes} <button onClick={handleLike}>Like</button></p>
        </div>
      ))}
    </div>
  );
}

export default Blog;