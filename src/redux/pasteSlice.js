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

export const fetchPastes = () => async (dispatch) => {
  const response = await axios.get('http://localhost:5000/api/pastes');
  dispatch(setPastes(response.data));
};

export const addPaste = (paste) => async (dispatch) => {
  const response = await axios.post('http://localhost:5000/api/pastes', paste);
  dispatch(addToPastes(response.data));
};

export const updatePaste = (paste) => async (dispatch) => {
  const response = await axios.put(`http://localhost:5000/api/pastes/${paste._id}`, paste);
  dispatch(updateToPastes(response.data));
};

export const deletePaste = (pasteId) => async (dispatch) => {
  await axios.delete(`http://localhost:5000/api/pastes/${pasteId}`);
  dispatch(removeFromPastes(pasteId));
};