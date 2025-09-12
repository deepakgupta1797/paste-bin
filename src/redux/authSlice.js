import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast'; 

const initialState = {
  currentUser: null, 
  isAuthenticated: false,
  registeredUsers: localStorage.getItem('registeredUsers')
    ? JSON.parse(localStorage.getItem('registeredUsers'))
    : [], 
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginUser: (state, action) => {
      
      const { username, selectedRole } = action.payload; 
      
      
      const mockUserId = username.replace(/\s+/g, '').toLowerCase() + 
            Date.now().toString(36);
      
      state.currentUser = { id: mockUserId, role: selectedRole, name: username };
      state.isAuthenticated = true;
      toast.success(`Logged in as ${username} (${selectedRole})`);
    },
    logoutUser: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
    },
    registerUser: (state, action) => {
      const { username, password, role, name } = action.payload;
      const existingUser = state.registeredUsers.find(u => u.username === username);
      if (existingUser) {
        toast.error(`Username "${username}" already exists.`);
        return;
      }
      const newUser = { id: Date.now().toString(), username, password, role, name };
      state.registeredUsers.push(newUser);
      localStorage.setItem('registeredUsers', JSON.stringify(state.registeredUsers));
      toast.success(`User "${username}" registered successfully as ${role}! Please login.`);
     
    }
  },
});

export const { loginUser, logoutUser, registerUser } = authSlice.actions;

export const selectCurrentUser = (state) => state.auth.currentUser;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

export default authSlice.reducer;