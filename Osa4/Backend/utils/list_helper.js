const lodash = require('lodash')

const dummy = (blogs) => {
    return 1;
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0);
}
  
const favoriteBlog = (blogs) => {
    if (!blogs.length) return null;
    const favorite = blogs.reduce((max, blog) => (blog.likes > max.likes ? blog : max), blogs[0]);

    return {
        title: favorite.title,
        author: favorite.author,
        likes: favorite.likes
    };
}

const mostBlogs = (blogs) => {
    if (!blogs.length) return null;

    const groupedByAuthor = lodash.groupBy(blogs, 'author');
    const authorsWithCounts = lodash.map(groupedByAuthor, (blogs, author) => ({
        author,
        blogs: blogs.length
    }));
    return lodash.maxBy(authorsWithCounts, 'blogs');
}

const mostLikes = (blogs) => {
    const authorsLikes = {};

    blogs.forEach(blog => {
        //authorsLikes[blog.author] += blog.likes;
        if (authorsLikes[blog.author]) {
            authorsLikes[blog.author] += blog.likes;
        } else {
            authorsLikes[blog.author] = blog.likes;
        }
    });

    let maxLikes = 0;
    let favoriteAuthor = null;

    for (const [author, likes] of Object.entries(authorsLikes)) {
        if (likes > maxLikes) {
            maxLikes = likes;
            favoriteAuthor = author;
        }
    }

    if (favoriteAuthor) {
        return {
            author: favoriteAuthor,
            likes: maxLikes
        };
    } else {
        return {};
    }
}

module.exports = {
    mostLikes,
    mostBlogs,
    favoriteBlog,
    dummy,
    totalLikes
}