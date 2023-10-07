import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from './reducers/userReducer';
import { postReducer } from './reducers/postReducers';
import { notificationReducer } from './reducers/notificationReducers';

const Store = configureStore({
  reducer: {
    user: userReducer,
    post: postReducer,
    notification: notificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});

export default Store;
