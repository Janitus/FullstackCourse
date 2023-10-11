import { useState, useEffect } from 'react';
import Blog from './models/Blog';
import './App.css';

function App() {
  const [blogs, setBlogs] = useState([])

  //const [blogs, setBlogs] = useState([
  //  {
  //    id: 1,
  //    title: "Blog1",
  //    author: "Kalle Kaali",
  //    url: "http://example.com/first-blog",
  //    likes: 5
  //  },
  //  {
  //    id: 2,
  //    title: "Blog2",
  //    author: "Pekka Peruna",
  //    url: "http://example.com/second-blog",
  //    likes: 10
  //  }
  //]);

  useEffect(() => {
    fetch('http://localhost:3001/api/blogs')
      .then(response => response.json())
      .then(data => {
        console.log("Fetched blogs appjsx:", data);
        setBlogs(data);
      })
      .catch(error => {
        console.error("ERROR! Can't fetch blogs appjsx:", error);
      });
  }, []);


  return (
    <div>
      <div>Blogs</div>
      <div>
        {blogs.map(blog => (
          <BlogPost key={blog._id} blog={blog} />
        ))}
      </div>
    </div>
  );
}

const BlogPost = ({ blog }) => {
  return (
    <div className="blog">
      <Blog blog={blog} />
    </div>
  );
}


export default App;