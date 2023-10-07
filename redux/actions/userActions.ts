import axios from 'axios';
import { Dispatch } from 'react';
import { URI } from '../URI';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const registerUser =
  (name: String, email: String, password: String, avatar: String) =>
  async (dispatch: Dispatch<any>) => {
    try {
      dispatch({
        type: 'userRegisterRequest',
      });

      const config = { headers: { 'content-Type': 'application/json' } };

      const { data } = await axios.post(
        `${URI}/register`,
        { name, email, password, avatar },
        config
      );

      dispatch({
        type: 'userRegisterSuccess',
        payload: data.user,
      });

      await AsyncStorage.setItem('token', data.token);
    } catch (error: any) {
      dispatch({
        type: 'userRegisterFailed',
        payload: error.res.data.message,
      });
    }
  };

export const loginUser =
  (email: String, password: String) => async (dispatch: Dispatch<any>) => {
    try {
      dispatch({
        type: 'userLoginRequest',
      });

      const config = { headers: { 'Content-Type': 'application/json' } };

      const { data } = await axios.post(
        `${URI}/login`,
        { email, password },
        config
      );

      dispatch({
        type: 'userLoginSuccess',
        payload: data.user,
      });

      if (data.token) {
        await AsyncStorage.setItem('token', data.token);
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        dispatch({
          type: 'userLoginFailed',
          payload: error.response.data.message,
        });
      } else {
        // Handle other types of errors (e.g., network issues)
        dispatch({
          type: 'userLoginFailed',
          payload: 'An error occurred during login.',
        });
      }
    }
  };

export const loadUser = () => async (dispatch: Dispatch<any>) => {
  try {
    dispatch({
      type: 'loadUserRequest',
    });

    const token = await AsyncStorage.getItem('token');

    const { data } = await axios.get(`${URI}/load-user`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    dispatch({
      type: 'loadUserSuccess',
      payload: {
        user: data.user,
        token,
      },
    });
  } catch (error: any) {
    dispatch({
      type: 'loadUserFailed',
      payload: error.response.data.message,
    });
  }
};

export const logOutUser = () => async (dispatch: Dispatch<any>) => {
  try {
    dispatch({
      type: 'userLogoutRequest',
    });

    await AsyncStorage.setItem('token', '');

    dispatch({
      type: 'userLogoutSuccess',
      payload: {},
    });
  } catch (error) {
    dispatch({
      type: 'userLogoutFailed',
    });
  }
};

export const getAllUsers = () => async (dispatch: Dispatch<any>) => {
  try {
    dispatch({
      type: 'getAllUsersRequest',
    });

    const token = await AsyncStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const { data } = await axios.get(`${URI}/all-users`, config);

    dispatch({
      type: 'getAllUsersSuccess',
      payload: data.users,
    });
  } catch (error: any) {
    dispatch({
      type: 'getAllUsersFailed',
      payload: error.message,
    });
  }
};

interface followUnfollowParams {
  users: any;
  userToFollowId: string;
  userId: string;
}

export const followUser =
  ({ users, userToFollowId, userId }: followUnfollowParams) =>
  async (dispatch: Dispatch<any>) => {
    try {
      const updatedUsers = users.map((user: any) =>
        user._id === userToFollowId
          ? { ...user, followers: [...user.followers, { userId }] }
          : user
      );

      dispatch({
        type: 'getAllUsersSuccess',
        payload: updatedUsers,
      });

      const token = await AsyncStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.put(`${URI}/follow-unfollow`, { userToFollowId }, config);
    } catch (error) {
      console.log('error following user', error);
    }
  };

export const unfollowUser =
  ({ users, userToFollowId, userId }: followUnfollowParams) =>
  async (dispatch: Dispatch<any>) => {
    try {
      const updatedUser = users.map((user: any) =>
        user._id === userToFollowId
          ? {
              ...user,
              followers: [
                user.followers.filter(
                  (follower: any) => follower.userId !== userId
                ),
              ],
            }
          : user
      );

      dispatch({
        type: 'getAllUsersSuccess',
        payload: updatedUser,
      });

      const token = await AsyncStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.put(`${URI}/follow-unfollow`, { userToFollowId }, config);
    } catch (error) {
      console.log('Error unfollowing user', error);
    }
  };
