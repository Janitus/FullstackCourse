import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import { Login, Logout } from './components/Login';
import axios from 'axios';
import './css/App.css';
import Notification from './components/Notification';
import BlogForm from './components/BlogForm';

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [token, setToken] = useState(localStorage.getItem('loginToken') || null);
  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [notification, setNotification] = useState({ message: null, isError: false });
  const [showCreateForm, setShowCreateForm] = useState(false);

  const fetchBlogs = async () => {
    if(!token) return;
    try {
      const response = await axios.get("http://localhost:3001/api/blogs", {
        headers: {
          'Authorization': `Bearer`+token
        }
      });

      //const allUsers = response.data;
      //const usernameToGet = localStorage.getItem("loginUsername");
      //const user = await allUsers.find(user => user.username === usernameToGet);

      //console.log(response.data);

      const usernameToGet = localStorage.getItem("loginUsername");
      //const filteredBlogs = response.data.filter(blog => blog.user && blog.user.username === usernameToGet);  Don't remember if I had to filter them out like in part 4.
      const sortedBlogs = response.data.sort((a, b) => b.likes - a.likes);

      setBlogs(sortedBlogs);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleSetToken = (newToken) => {
    if (!newToken) setBlogs([]);
    setToken(newToken);
  };

  const notify = (message, isError = false) => {
    setNotification({ message, isError });
    setTimeout(() => {
      setNotification({ message: null, isError: false });
    }, 6000);
  };

  return (
    <div>
      <div>
        <Notification message={notification.message} isError={notification.isError} />
        {!token && <Login setToken={handleSetToken} notify={notify} />}
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
          <button id="new-blog" button onClick={() => setShowCreateForm(true)} style={{ display: showCreateForm ? 'none' : 'block' }}>
            Create new post
          </button>
          {showCreateForm && (
            <BlogForm
              fetchBlogs={fetchBlogs}
              notify={notify}
              setShowCreateForm={setShowCreateForm}
            />
          )}
        </div>
      )}

      {blogs.map(blog => (
        <Blog key={blog.id} blog={blog} fetchBlogs={fetchBlogs} notify={notify} />
      ))}
    </div>
  )
}


export default App