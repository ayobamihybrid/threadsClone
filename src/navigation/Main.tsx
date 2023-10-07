import React from 'react';
import { View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Tabs from './Tabs';
import UserProfileScreen from '../../screens/UserProfileScreen';
import CreateRepliesScreen from '../../screens/CreateRepliesScreen';
import PostDetailScreen from '../../screens/PostDetailScreen';
import LikedByScreen from '../../screens/LikedByScreen';
import FollowersScreen from '../../screens/FollowersScreen';
import EditProfileScreen from '../../screens/EditProfileScreen';

type Props = {};

const Main = (props: Props) => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Tabs} />
      <Stack.Screen name="UserProfile" component={UserProfileScreen} />
      <Stack.Screen name="CreateReplies" component={CreateRepliesScreen} />
      <Stack.Screen name="PostDetail" component={PostDetailScreen} />
      <Stack.Screen name="LikedBy" component={LikedByScreen} />
      <Stack.Screen name="Followers" component={FollowersScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
    </Stack.Navigator>
  );
};

export default Main;
