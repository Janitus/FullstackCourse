import axios from 'axios';
import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import Blog from '../components/Blog';
import BlogForm from '../components/BlogForm';

jest.mock('axios');

test('displays only title and author', () => {
    const blog = {
        id: 'test-id',
        title: 'Title',
        author: 'Author',
        url: 'http://test.com',
        likes: 5
    };
  
    const mockFetchBlogs = jest.fn();
    const mockNotify = jest.fn();
  
    render(
        <Blog blog={blog} fetchBlogs={mockFetchBlogs} notify={mockNotify} />
    );
  
    expect(screen.getByText('Title')).toBeDefined();
    expect(screen.getByText(/Author/)).toBeDefined();
    expect(screen.queryByText('http://test.com')).toBeNull();
    expect(screen.queryByText('5')).toBeNull();
});
  
test('display all information when clicked', async () => {
    const blog = {
        id: 'test-id',
        title: 'Title',
        author: 'Author',
        url: 'http://test.com',
        likes: 5,
    };

    const mockFetchBlogs = jest.fn();
    const mockNotify = jest.fn();

    render(
        <Blog blog={blog} fetchBlogs={mockFetchBlogs} notify={mockNotify} />
    );

    const user = userEvent.setup();
    const viewButton = screen.getByText('view');
    await user.click(viewButton)

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('http://test.com')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText(/Author/)).toBeInTheDocument();
});


test('like twice', async () => {
    const blog = {
        id: 'test-id',
        title: 'Title',
        author: 'Author',
        url: 'http://test.com',
        likes: 5,
        user: { username: 'testuser' }
    };

    axios.put = jest.fn().mockResolvedValue({ data: { ...blog, likes: blog.likes + 1 } });
  
    const mockFetchBlogs = jest.fn();
    const mockNotify = jest.fn();
    const mockHandleLike = jest.fn();
  
    render(
        <Blog blog={blog} fetchBlogs={mockFetchBlogs} notify={mockNotify}/>
    );
  
    const user = userEvent.setup();
    const viewButton = screen.getByText('view');
    await user.click(viewButton);
  
    const likeButton = screen.getByText(/like/i);
    await user.click(likeButton);
    await user.click(likeButton);
  
    expect(axios.put).toHaveBeenCalledTimes(2);
    //expect(screen.getByText(`${blog.likes + 2}`)).toBeInTheDocument();
    //expect(mockHandleLike.mock.calls).toHaveLength(1)
    //expect(mockHandleLike.mock.calls).toHaveBeenCalledTimes(2)
    //await expect(mockHandleLike).toHaveBeenCalledTimes(2); PERKELE
});

test('blogform recalls the function with right info', async () => {
    const user = userEvent.setup();
    const mockResponse = {
        data: { title: 'Blog',
        author: 'Author',
        url: 'http://test.com' }
    };
    axios.post.mockResolvedValue(mockResponse);

    render(
        <BlogForm fetchBlogs={() => {}} notify={() => {}} setShowCreateForm={() => {}} />
    );

    const title = screen.getByPlaceholderText('Title');
    const author = screen.getByPlaceholderText('Author');
    const url = screen.getByPlaceholderText('URL');

    await user.type(title, 'Blog');
    await user.type(author, 'Author');
    await user.type(url, 'http://test.com');

    const submitButton = screen.getByText('Create new blogpost');
    await user.click(submitButton);

    expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:3001/api/blogs",
        {
            title: 'Blog',
            author: 'Author',
            url: 'http://test.com',
            likes: 0
        },
        expect.anything()
    );
});
