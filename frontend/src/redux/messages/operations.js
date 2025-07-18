import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from "../index.js"
import { selectToken } from '../auth/selectors.js';

// export const addComment = createAsyncThunk(
//   'comments/addComment',
//   async (commentData, thunkAPI) => {
//     try {
//       const {userName, text, messageId, homepage, email, captchaText, captchaToken} = commentData;
//       const state = thunkAPI.getState();
//       const token = selectToken(state);
//       console.log(commentData, token)
//       // const response = await api.post('/api/message', commentData);
//     const response = await api.post('/api/message', 
//       { name: userName, text, homepage, email, captchaCode: captchaText, captchaToken}, 
//       {headers: {
//             Authorization: `Bearer ${token}`,
//           },} );
//       return response.data;
//     } catch (error) {
//       return thunkAPI.rejectWithValue({
//         status: error.response?.status || 500,
//         message: error.response?.data?.message || error.message || 'Unknown error',
//       });
//     }
//   }
// );
export const addComment = createAsyncThunk(
  'comments/addComment',
  async (commentData, thunkAPI) => {
    try {
      const {
        parentId,
        userName,
        text,
        messageId,
        homepage,
        email,
        captchaText,
        captchaToken,
        file,
      } = commentData;

      const state = thunkAPI.getState();
      const token = selectToken(state);

      const formData = new FormData();
      if (typeof parentId === 'number') {
        formData.append('parentId', parentId.toString());
      }
      formData.append('name', userName);
      formData.append('text', text);
      formData.append('email', email);
      formData.append('captchaCode', captchaText);
      formData.append('captchaToken', captchaToken);

      if (messageId) {
        formData.append('messageId', messageId);
      }
      if (homepage?.trim()) {
        formData.append('homepage', homepage.trim());
      }
      if (file) {
        formData.append('file', file);
      }

      const response = await api.post('/api/message', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        status: error.response?.status || 500,
        message:
          error.response?.data?.message ||
          error.message ||
          'Unknown error',
      });
    }
  }
);




export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('/api/message');
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);