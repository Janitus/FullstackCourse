import { useState } from 'react';
import Blog from './models/Blog';
import './App.css';

function App() {
  const [blogs, setBlogs] = useState([
    {
      id: 1,
      title: "Blog1",
      author: "Kalle Kaali",
      url: "http://example.com/first-blog",
      likes: 5
    },
    {
      id: 2,
      title: "Blog2",
      author: "Pekka Peruna",
      url: "http://example.com/second-blog",
      likes: 10
    }
  ]);

  return (
    <div>
      <div>Blogs</div>
      <div>
        {blogs.map(blog => (
          <BlogPost key={blog.id} blog={blog} />
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