import { createSlice } from '@reduxjs/toolkit';
import { addComment, fetchComments } from './operations';

const initialState = {
  items: [],
  isLoading: false,
  error: null,
};

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {  
    addCommentFromWS: (state, action) => {
    state.items.push(action.payload);
  },},
  extraReducers: builder => {
    builder
        .addCase(fetchComments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch comments';
      })
      .addCase(addComment.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.isLoading = false;
        // state.items.push(action.payload);
      })
      .addCase(addComment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to add comment';
      });
  },
});

export default commentsSlice.reducer;
export const { addCommentFromWS } = commentsSlice.actions;