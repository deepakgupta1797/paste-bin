import { configureStore } from '@reduxjs/toolkit'
import pasteReducer from '../redux/pasteSlice'
import authReducer from '../redux/authSlice'
import blogReducer from '../redux/blogSlice' 

export const store = configureStore({
  reducer: {
    paste: pasteReducer,
    auth: authReducer,
    blog: blogReducer, 
  },
})