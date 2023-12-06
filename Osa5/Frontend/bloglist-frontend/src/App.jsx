import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import { Login, Logout } from './components/Login';
import axios from 'axios';
import './css/App.css';

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [token, setToken] = useState(localStorage.getItem('loginToken') || null);
  const [username, setUsername] = useState('')
  const [name, setName] = useState('')

  // New Blog
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const handleTitleChange = (event) => setTitle(event.target.value);
  const handleAuthorChange = (event) => setAuthor(event.target.value);
  const handleUrlChange = (event) => setUrl(event.target.value);


  const [newBlog, setNewBlog] = useState({
    title: '',
    author: '',
    url: '',
    likes: 0
  });

  const fetchBlogs = async () => {
    if(!token) return;
    try {
      const response = await axios.get("http://localhost:3001/api/users", {
        headers: {
          'Authorization': `Bearer`+token
        }
      });

      const allUsers = response.data;
      const usernameToGet = localStorage.getItem("loginUsername");
      const user = await allUsers.find(user => user.username === usernameToGet);

      setUsername(user.username)
      setName(user.name)
      setBlogs(user.blogs)

    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchToken = () => {
    const userToken = localStorage.getItem('loginToken');
    if (userToken) {
      handleSetToken(userToken);
      console.log("Login token: ", localStorage.getItem('loginToken'))
    } else console.log("No login token")
  }

  useEffect(() => {
    fetchToken();
    fetchBlogs();
  }, [token]);

  const handleSetToken = (newToken) => {
    if (!newToken) setBlogs([]);
    setToken(newToken);
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
        console.log("Blog post created: ", response.data," token ",authToken);
        fetchBlogs();
        setNewBlog({
          title: title,
          author: author,
          url: url,
          likes: 0
        });
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <div>
      <div>
        {!token && <Login setToken={handleSetToken} />}
        {token && <Logout setToken={handleSetToken} />}

      </div>
      <h3>Blogs</h3>
      {token &&
        <h4>
          Logged in as {name}
        </h4>
      }
      {token && (
        <div>
          <input type="text" value={title} onChange={handleTitleChange} placeholder="Title" />
          <input type="text" value={author} onChange={handleAuthorChange} placeholder="Author" />
          <input type="text" value={url} onChange={handleUrlChange} placeholder="URL" />
          <button onClick={handlePost}>Create new blogpost</button>
        </div>
      )}

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}


export default App