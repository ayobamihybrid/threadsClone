import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Platform,
  ToastAndroid,
  Alert,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import {
  followUser,
  getAllUsers,
  unfollowUser,
} from '../redux/actions/userActions';

type Props = {
  navigation: any;
  route: any;
};

const LikedByScreen = ({ navigation, route }: Props) => {
  const data = route.params.item;

  const { users, user } = useSelector((state: any) => state.user);

  useEffect(() => {
    getAllUsers()(dispatch);
  }, []);

  const dispatch = useDispatch();

  return (
    <SafeAreaView>
      <View
        style={{
          flexDirection: 'row',
          gap: 10,
          alignItems: 'center',
          marginHorizontal: 10,
          marginVertical: 15,
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Likes</Text>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => {
          const handleFollowUnfollow = async (i: any) => {
            try {
              if (
                i.followers.find(
                  (follower: any) => follower.userId === user._id
                )
              ) {
                await unfollowUser({
                  users,
                  userToFollowId: i._id,
                  userId: user._id,
                })(dispatch);
              } else {
                await followUser({
                  users,
                  userToFollowId: i._id,
                  userId: user._id,
                })(dispatch);
              }
            } catch (error: any) {
              console.log('error message:', error.message);
              if (error.response) {
                console.log('Response data:', error.response.data);
                console.log('Response status:', error.response.status);
                console.log('Response headers:', error.response.headers);
              } else if (error.request) {
                console.log('Request:', error.request);
              }
            }
          };

          return (
            <>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginHorizontal: 10,
                  marginVertical: 5,
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    gap: 8,
                    alignItems: 'center',
                  }}
                >
                  <TouchableOpacity
                    onPress={() =>
                      item.userId === user._id
                        ? navigation.navigate('Profile')
                        : navigation.navigate('UserProfile', {
                            item: users.find((user: any) =>
                              user._id === item.userId ? user : null
                            ),
                          })
                    }
                  >
                    {item.userAvatar ? (
                      <Image source={{ uri: item.userAvatar }} />
                    ) : (
                      <Ionicons
                        name="person-circle-outline"
                        size={45}
                        color="black"
                      />
                    )}
                  </TouchableOpacity>

                  <View>
                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                      {item.name}{' '}
                    </Text>
                    <Text style={{ color: 'gray' }}>{item.userName} </Text>
                  </View>
                </View>

                {item.userId !== user._id && (
                  <TouchableOpacity
                    onPress={() =>
                      handleFollowUnfollow(
                        users.find((user: any) =>
                          user._id === item.userId ? user : null
                        )
                      )
                    }
                  >
                    <Text
                      style={{
                        borderWidth: 1,
                        paddingHorizontal: 12,
                        paddingVertical: 5,
                        borderRadius: 7,
                      }}
                    >
                      {user.following.find(
                        (follower: any) => follower.userId === item.userId
                      )
                        ? 'Following'
                        : 'Follow'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </>
          );
        }}
      />
    </SafeAreaView>
  );
};

export default LikedByScreen;
