import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  chats: [], // { id, userId, username, message, createdAt }
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
  },
});

export const { addChat, updateChat, deleteChat, setChats } = chatSlice.actions;
export default chatSlice.reducer;

export const fetchChats = () => async (dispatch) => {
  const response = await axios.get('http://localhost:5000/api/chats');
  dispatch(setChats(response.data));
};

export const addChatAsync = (chat) => async (dispatch) => {
  const response = await axios.post('http://localhost:5000/api/chats', chat);
  dispatch(addChat(response.data));
};

export const updateChatAsync = (chat) => async (dispatch) => {
  const response = await axios.put(`http://localhost:5000/api/chats/${chat._id}`, chat);
  dispatch(updateChat(response.data));
};

export const deleteChatAsync = (chatId) => async (dispatch) => {
  await axios.delete(`http://localhost:5000/api/chats/${chatId}`);
  dispatch(deleteChat(chatId));
};