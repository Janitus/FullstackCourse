import { useState, useEffect } from 'react';
import Blog from './models/Blog';
import { Login, Logout } from './models/Login';
import './App.css';
import axios from 'axios';

function App() {
  const [blogs, setBlogs] = useState([])
  const [token, setToken] = useState(localStorage.getItem('loginToken') || null);
  const [newBlog, setNewBlog] = useState({
    title: 'Testblog',
    author: '',
    url: 'google.com',
    likes: 0
  });

  const handlePost = async () => {
    try {
      const authToken = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('loginToken')}`
        }
      };
      const response = await axios.post("http://localhost:3001/api/blogs", newBlog, authToken);
      if (response.status === 200) {
        console.log("Blog post created: ", response.data," token ",authToken);
        fetchBlogs();
        setNewBlog({
          title: 'Testblogtest',
          author: '',
          url: 'google.com',
          likes: 0
        });
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const fetchBlogs = () => {
    fetch('http://localhost:3001/api/blogs')
      .then(response => response.json())
      .then(data => {
        console.log("Fetched blogs appjsx:", data);
        setBlogs(data);
      })
      .catch(error => {
        console.error("ERROR! Can't fetch blogs appjsx:", error);
      });
  };

  const fetchToken = () => {
    const userToken = localStorage.getItem('loggedBlogAppUser');
    if (userToken) setToken(userToken);
  }

  useEffect(() => {
    fetchToken();
    fetchBlogs();
  }, []);

  //{!token && <Login setToken={setToken} />}
  return (
    <div>
      <div>
        {!token && <Login setToken={setToken} />}
        {token && <Logout setToken={setToken} />}
        {token && <button onClick={handlePost}>Test Post</button>}
      </div>
      <div>Blogs</div>
      <div>
        {blogs.map(blog => (
          <BlogPost key={blog._id} blog={blog} fetchBlogs={fetchBlogs} />
        ))}
      </div>
    </div>
  );
}

const BlogPost = ({ blog, fetchBlogs }) => {
  return (
    //<Blog blog={blog} />
    <div className="blog">
      <Blog blog={blog} fetchBlogs={fetchBlogs} />
    </div>
  );
}


export default App;