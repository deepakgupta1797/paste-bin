import { createSlice } from '@reduxjs/toolkit';

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
    deleteChat: (state, action) => {
      state.chats = state.chats.filter(chat => chat.id !== action.payload);
    },
    setChats: (state, action) => {
      state.chats = action.payload;
    },
  },
});

export const { addChat, deleteChat, setChats } = chatSlice.actions;
export default chatSlice.reducer;
