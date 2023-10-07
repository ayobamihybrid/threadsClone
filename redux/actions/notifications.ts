import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dispatch } from 'react';
import { URI } from '../URI';
import axios from 'axios';

export const getNotifications = () => async (dispatch: Dispatch<any>) => {
  try {
    dispatch({
      type: 'getNotificationrequest',
    });
    const token = await AsyncStorage.getItem('token');

    const config = { headers: { Authorization: `Bearer ${token}` } };

    const { data } = await axios.get(`${URI}/notifications`, config, { token });

    dispatch({
      type: 'getNotificationSuccess',
      payload: data.notifications,
    });
  } catch (error: any) {
    dispatch({
      type: 'getNotificationFailed',
      payload: error.response.data.message,
    });
  }
};
