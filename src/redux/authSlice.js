import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast'; 

const initialState = {
  currentUser: localStorage.getItem('currentUser')
    ? JSON.parse(localStorage.getItem('currentUser'))
    : null, 
  isAuthenticated: localStorage.getItem('isAuthenticated') === 'true',
  registeredUsers: localStorage.getItem('registeredUsers')
    ? JSON.parse(localStorage.getItem('registeredUsers'))
    : [], 
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginUser: (state, action) => {
      // Accepts a user object from the backend
      const userData = action.payload;
      state.currentUser = userData;
      state.isAuthenticated = true;
      // Persist to localStorage
      localStorage.setItem('currentUser', JSON.stringify(userData));
      localStorage.setItem('isAuthenticated', 'true');
      toast.success(`Logged in as ${userData.username} (${userData.role})`);
    },
    logoutUser: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      
      // Clear from localStorage
      localStorage.removeItem('currentUser');
      localStorage.removeItem('isAuthenticated');
      
      toast.success('Logged out successfully');
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
     
    },
    updateUserProfile: (state, action) => {
      const { id, name, username, email, profilePic } = action.payload;
      if (state.currentUser && state.currentUser.id === id) {
        // Update current user
        state.currentUser = {
          ...state.currentUser,
          name: name || state.currentUser.name,
          username: username || state.currentUser.username,
          email: email || state.currentUser.email,
          profilePic: profilePic || state.currentUser.profilePic
        };
        
        // Persist to localStorage
        localStorage.setItem('currentUser', JSON.stringify(state.currentUser));
        
        // Update in registered users array if exists
        const userIndex = state.registeredUsers.findIndex(u => u.id === id);
        if (userIndex >= 0) {
          state.registeredUsers[userIndex] = {
            ...state.registeredUsers[userIndex],
            name: name || state.registeredUsers[userIndex].name,
            username: username || state.registeredUsers[userIndex].username,
            email: email || state.registeredUsers[userIndex].email,
            profilePic: profilePic || state.registeredUsers[userIndex].profilePic
          };
          localStorage.setItem('registeredUsers', JSON.stringify(state.registeredUsers));
        }
      }
    }
  },
});

export const { loginUser, logoutUser, registerUser, updateUserProfile } = authSlice.actions;

export const selectCurrentUser = (state) => state.auth.currentUser;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

export default authSlice.reducer;