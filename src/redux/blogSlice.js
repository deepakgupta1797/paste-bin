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

const API_URL = import.meta.env.VITE_API_URL;

export const fetchBlogs = () => async (dispatch) => {
  try {
    const response = await axios.get(`${API_URL}/api/blogs`);
    dispatch(setBlogs(response.data));
  } catch (error) {
    console.error('Failed to fetch blogs:', error);
    // Optionally dispatch an error action or show a toast
  }
};

export const addBlog = (blog) => async (dispatch) => {
  try {
    const response = await axios.post(`${API_URL}/api/blogs`, blog);
    dispatch(addBlogPost(response.data));
  } catch (error) {
    console.error('Failed to add blog:', error);
    // Optionally dispatch an error action or show a toast
  }
};

export const updateBlog = (blog) => async (dispatch) => {
  try {
    const response = await axios.put(`${API_URL}/api/blogs/${blog._id}`, blog);
    dispatch(updateBlogPost(response.data));
  } catch (error) {
    console.error('Failed to update blog:', error);
    // Optionally dispatch an error action or show a toast
  }
};

export const deleteBlog = (blogId) => async (dispatch) => {
  try {
    await axios.delete(`${API_URL}/api/blogs/${blogId}`);
    dispatch(removeBlogPost(blogId));
  } catch (error) {
    console.error('Failed to delete blog:', error);
    // Optionally dispatch an error action or show a toast
  }
};