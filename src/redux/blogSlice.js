import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';

const initialState = {
  blogs: localStorage.getItem('blogs')
    ? JSON.parse(localStorage.getItem('blogs'))
    : [],
};

export const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    addBlogPost: (state, action) => {
      const blogPost = action.payload;
      state.blogs.push(blogPost);
      localStorage.setItem('blogs', JSON.stringify(state.blogs));
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
        localStorage.setItem('blogs', JSON.stringify(state.blogs));
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
        localStorage.setItem('blogs', JSON.stringify(state.blogs));
        toast.success('Blog post removed successfully!', {
          position: 'top-right',
          duration: 2000,
        });
      }
    },
    resetAllBlogPosts: (state) => {
      state.blogs = [];
      localStorage.removeItem('blogs');
    },
  },
});

export const { addBlogPost, updateBlogPost, removeBlogPost, resetAllBlogPosts } 
= blogSlice.actions;

export default blogSlice.reducer;