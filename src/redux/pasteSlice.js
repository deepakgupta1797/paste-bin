import { createSlice } from '@reduxjs/toolkit'
import toast from 'react-hot-toast';
import axios from 'axios';

const initialState = {
  pastes: [],
}

export const pasteSlice = createSlice({
  name: 'paste',
  initialState,
  reducers: {
    addToPastes: (state, action) => {
      const paste = action.payload;
        state.pastes.push(paste);
        toast.success('Paste added successfully!', {
          position: 'top-right',
          duration: 2000,
        });
    },
    updateToPastes: (state, action) => {
      const paste = action.payload;
      const index = state.pastes.findIndex(p => p._id === paste._id);

      if(index >= 0) {
        state.pastes[index] = paste;
        toast.success('Paste updated successfully!', {
          position: 'top-right',
          duration: 2000,
        });
      }
    },
    resetAllPaste: (state, action) => {
        state.pastes = [];
    },
    removeFromPastes: (state, action) => {
      const pasteId = action.payload;
      const index = state.pastes.findIndex(p => p._id === pasteId);
      if(index >= 0) {
        state.pastes.splice(index, 1);
        toast.success('Paste removed successfully!', {
          position: 'top-right',
          duration: 2000,
        });
      }

    },
    setPastes: (state, action) => {
      state.pastes = action.payload;
    }
  },
})


export const { addToPastes, updateToPastes, resetAllPaste, removeFromPastes, setPastes } 
= pasteSlice.actions

export default pasteSlice.reducer

const API_URL = import.meta.env.VITE_API_URL;

export const fetchPastes = () => async (dispatch) => {
  try {
    const response = await axios.get(`${API_URL}/api/pastes`);
    dispatch(setPastes(response.data));
  } catch (error) {
    console.error('Failed to fetch pastes:', error);
    // Optionally dispatch an error action or show a toast
  }
};

export const addPaste = (paste) => async (dispatch) => {
  try {
    const response = await axios.post(`${API_URL}/api/pastes`, paste);
    dispatch(addToPastes(response.data));
  } catch (error) {
    console.error('Failed to add paste:', error);
    // Optionally dispatch an error action or show a toast
  }
};

export const updatePaste = (paste) => async (dispatch) => {
  try {
    const response = await axios.put(`${API_URL}/api/pastes/${paste._id}`, paste);
    dispatch(updateToPastes(response.data));
  } catch (error) {
    console.error('Failed to update paste:', error);
    // Optionally dispatch an error action or show a toast
  }
};

export const deletePaste = (pasteId) => async (dispatch) => {
  try {
    await axios.delete(`${API_URL}/api/pastes/${pasteId}`);
    dispatch(removeFromPastes(pasteId));
  } catch (error) {
    console.error('Failed to delete paste:', error);
    // Optionally dispatch an error action or show a toast
  }
};