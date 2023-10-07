import { createReducer } from '@reduxjs/toolkit';

const initialState = {
  notifications: [],
  loading: false,
  error: null,
};

export const notificationReducer = createReducer(initialState, {
  getNotificationrequest: (state) => {
    state.loading = true;
  },
  getNotificationSuccess: (state, action) => {
    state.loading = false;
    state.notifications = action.payload;
  },
  getNotificationFailed: (state, action) => {
    state.loading = false;
    state.error = action.payload;
  },
});
