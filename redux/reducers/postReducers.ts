import { createReducer } from '@reduxjs/toolkit';

const initialState = {
  posts: [],
  post: {},
  loading: false,
  isPostSuccessful: false,
  error: null,
};

export const postReducer = createReducer(initialState, {
  createPostRequest: (state) => {
    state.loading = true;
  },

  createPostSuccess: (state, action) => {
    state.loading = false;
    state.post = action.payload;
    state.isPostSuccessful = true;
  },

  createPostFailed: (state, action) => {
    state.loading = false;
    state.error = action.payload;
    state.isPostSuccessful = false;
  },

  getAllPostsRequest: (state) => {
    state.loading = true;
  },

  getAllPostsSuccess: (state, action) => {
    state.loading = false;
    state.posts = action.payload;
  },

  getAllPostsFailed: (state, action) => {
    state.loading = false;
    state.error = action.payload;
  },
});
