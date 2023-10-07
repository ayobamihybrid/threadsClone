import { createReducer } from '@reduxjs/toolkit';

const initialState = {
  user: {},
  users: [],
  loading: false,
  isLoading: false,
  isAuthenticated: false,
  error: null,
  token: '',
};

export const userReducer = createReducer(initialState, {
  userRegisterRequest: (state) => {
    state.loading = true;
    state.isAuthenticated = false;
  },
  userRegisterSuccess: (state, action) => {
    state.loading = false;
    state.isAuthenticated = true;
    state.user = action.payload;
  },
  userRegisterFail: (state, action) => {
    state.loading = false;
    state.isAuthenticated = false;
    state.error = action.payload;
  },

  userLoginRequest: (state) => {
    state.loading = true;
    state.isAuthenticated = false;
  },
  userLoginSuccess: (state, action) => {
    state.loading = false;
    state.isAuthenticated = true;
    state.user = action.payload;
  },
  userLoginFailed: (state, action) => {
    state.loading = false;
    state.isAuthenticated = false;
    state.error = action.payload;
  },

  loadUserRequest: (state) => {
    state.loading = true;
    state.isAuthenticated = false;
  },
  loadUserSuccess: (state, action) => {
    state.loading = false;
    state.isAuthenticated = true;
    state.user = action.payload.user;
    state.token = action.payload.token;
  },
  loadUserFailed: (state, action) => {
    state.loading = false;
    state.isAuthenticated = false;
    state.error = action.payload;
    state.user = {};
  },
  userLogoutRequest: (state) => {
    state.loading = true;
  },
  userLogoutSuccess: (state, action) => {
    state.loading = false;
    state.isAuthenticated = false;
    state.user = {};
  },
  userLogoutFailed: (state, action) => {
    state.loading = false;
    state.error = action.payload;
  },
  getAllUsersRequest: (state) => {
    state.isLoading = true;
  },
  getAllUsersSuccess: (state, action) => {
    state.isLoading = false;
    state.users = action.payload;
  },
  getAllUsersFailed: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },
});
