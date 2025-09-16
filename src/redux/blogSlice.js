import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import axios from 'axios';

const initialState = {
  blogs: [],
};

export const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    addBlogPost: (state, action) => {
      const blogPost = action.payload;
      state.blogs.push(blogPost);
      toast.success('Blog post added successfully!', {
        position: 'top-right',
        duration: 2000,
      });
    },
    updateBlogPost: (state, action) => {
      const blogPost = action.payload;
      const index = state.blogs.findIndex(b => b._id === blogPost._id);

      if (index >= 0) {
        state.blogs[index] = blogPost;
        toast.success('Blog post updated successfully!', {
          position: 'top-right',
          duration: 2000,
        });
      }
    },
    removeBlogPost: (state, action) => {
      const blogId = action.payload;
      const index = state.blogs.findIndex(b => b._id === blogId);
      if (index >= 0) {
        state.blogs.splice(index, 1);
        toast.success('Blog post removed successfully!', {
          position: 'top-right',
          duration: 2000,
        });
      }
    },
    resetAllBlogPosts: (state) => {
      state.blogs = [];
    },
    setBlogs: (state, action) => {
      state.blogs = action.payload;
    },
  },
});

export const { addBlogPost, updateBlogPost, removeBlogPost, resetAllBlogPosts, setBlogs } 
= blogSlice.actions;

export default blogSlice.reducer;

export const fetchBlogs = () => async (dispatch) => {
  const response = await axios.get('http://localhost:5000/api/blogs');
  dispatch(setBlogs(response.data));
};

export const addBlog = (blog) => async (dispatch) => {
  const response = await axios.post('http://localhost:5000/api/blogs', blog);
  dispatch(addBlogPost(response.data));
};

export const updateBlog = (blog) => async (dispatch) => {
  const response = await axios.put(`http://localhost:5000/api/blogs/${blog._id}`, blog);
  dispatch(updateBlogPost(response.data));
};

export const deleteBlog = (blogId) => async (dispatch) => {
  await axios.delete(`http://localhost:5000/api/blogs/${blogId}`);
  dispatch(removeBlogPost(blogId));
};