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
import { Feather } from '@expo/vector-icons';

type Props = {
  navigation: any;
  route: any;
};

const FollowersScreen = ({ navigation, route }: Props) => {
  const followers = route.params.followers;
  const following = route.params.following;
  const item = route.params.item;

  const { users, user } = useSelector((state: any) => state.user);
  const dispatch = useDispatch();

  const [followersData, setFollowersData] = useState(followers);
  const [followingData, setFollowingData] = useState(following);
  const [active, setActive] = useState(1);

  useEffect(() => {
    getAllUsers()(dispatch);
  }, []);

  useEffect(() => {
    if (users) {
      if (followers) {
        const followersD = users.filter((user: any) =>
          followers.some((follower: any) => follower.userId === user._id)
        );
        setFollowersData(followersD);
      }

      if (following) {
        const followingD = users.filter((user: any) =>
          following.some((follow: any) => follow.userId === user._id)
        );
        setFollowingData(followingD);
      }
    }
  }, [followers, following, users]);

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
          <Feather name="x" size={24} color="black" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
          {item?.name ? item?.name : user.name}
        </Text>
      </View>

      <View
        style={{
          marginVertical: 10,
          marginRight: 'auto',
          marginLeft: 'auto',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '70%',
        }}
      >
        <View>
          <Text
            onPress={() => setActive(1)}
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: active === 1 ? 'black' : 'gray',
            }}
          >
            Followers
          </Text>
          <View
            style={{
              width: 72,
              height: active === 1 ? 1.5 : 0,
              backgroundColor: 'red',
              marginTop: 5,
            }}
          />
        </View>

        <View>
          <Text
            onPress={() => setActive(2)}
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: active === 2 ? 'black' : 'gray',
            }}
          >
            Following
          </Text>
          <View
            style={{
              width: 72,
              height: active === 2 ? 1.5 : 0,
              backgroundColor: 'red',
              marginTop: 5,
            }}
          />
        </View>
      </View>

      <View style={{ marginVertical: 5 }}>
        {active === 1 ? (
          <Text style={{ textAlign: 'center' }}>
            {followersData?.length}{' '}
            {followersData?.length > 1 ? 'Followers' : 'Follower'}
          </Text>
        ) : (
          <Text style={{ textAlign: 'center' }}>
            {followingData?.length} Following
          </Text>
        )}
      </View>

      <FlatList
        data={active === 1 ? followersData : followingData}
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
                      item._id === user._id
                        ? navigation.navigate('Profile')
                        : navigation.navigate('UserProfile', {
                            item: item,
                          })
                    }
                  >
                    {item.avatar ? (
                      <Image source={{ uri: item.avatar.url }} />
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
                      {item.name?.length > 20
                        ? item.name.slice(0, 20) + '...'
                        : item.name}{' '}
                    </Text>
                    <Text style={{ color: 'gray' }}>{item.userName} </Text>
                  </View>
                </View>

                {item._id !== user._id && (
                  <TouchableOpacity onPress={() => handleFollowUnfollow(item)}>
                    <Text
                      style={{
                        borderWidth: 1,
                        paddingHorizontal: 12,
                        paddingVertical: 5,
                        borderRadius: 7,
                      }}
                    >
                      {user.following.find(
                        (follower: any) => follower.userId === item._id
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

export default FollowersScreen;
