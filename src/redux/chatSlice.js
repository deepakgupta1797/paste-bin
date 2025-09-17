// Delete all chats in a room (delete chat room)
export const deleteChatRoomAsync = (roomId) => async (dispatch) => {
  try {
    await axios.delete(`${API_URL}/api/chat-rooms/${roomId}`);
    // Remove all chats from this room in Redux state
    dispatch(setChats((prev) => prev.filter(chat => chat.roomId !== roomId)));
    // Optionally, you can also dispatch a toast here
  } catch (error) {
    console.error('Failed to delete chat room:', error);
    // Optionally dispatch an error action or show a toast
  }
};
import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  chats: [], // { id, userId, username, message, roomId, createdAt }
  currentRoom: 'general', // Current chat room
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addChat: (state, action) => {
      state.chats.push(action.payload);
    },
    updateChat: (state, action) => {
      const chat = action.payload;
      const index = state.chats.findIndex(c => c._id === chat._id);
      if (index >= 0) {
        state.chats[index] = chat;
      }
    },
    deleteChat: (state, action) => {
      state.chats = state.chats.filter(chat => chat._id !== action.payload);
    },
    setChats: (state, action) => {
      state.chats = action.payload;
    },
    setCurrentRoom: (state, action) => {
      state.currentRoom = action.payload;
    },
  },
});

export const { addChat, updateChat, deleteChat, setChats, setCurrentRoom } = chatSlice.actions;
export default chatSlice.reducer;

const API_URL = import.meta.env.VITE_API_URL;

export const fetchChats = () => async (dispatch) => {
  try {
    const response = await axios.get(`${API_URL}/api/chats`);
    dispatch(setChats(response.data));
  } catch (error) {
    console.error('Failed to fetch chats:', error);
    // Optionally dispatch an error action or show a toast
  }
};

export const addChatAsync = (chat) => async (dispatch) => {
  try {
    const response = await axios.post(`${API_URL}/api/chats`, chat);
    dispatch(addChat(response.data));
  } catch (error) {
    console.error('Failed to add chat:', error);
    // Optionally dispatch an error action or show a toast
  }
};

export const updateChatAsync = (chat) => async (dispatch) => {
  try {
    const response = await axios.put(`${API_URL}/api/chats/${chat._id}`, chat);
    dispatch(updateChat(response.data));
  } catch (error) {
    console.error('Failed to update chat:', error);
    // Optionally dispatch an error action or show a toast
  }
};

export const deleteChatAsync = (chatId) => async (dispatch) => {
  try {
    await axios.delete(`${API_URL}/api/chats/${chatId}`);
    dispatch(deleteChat(chatId));
  } catch (error) {
    console.error('Failed to delete chat:', error);
    // Optionally dispatch an error action or show a toast
  }
};