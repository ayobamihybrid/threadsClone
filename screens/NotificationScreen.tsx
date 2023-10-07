import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import { getNotifications } from '../redux/actions/notifications';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { followUser, unfollowUser } from '../redux/actions/userActions';
import getTimeDuration from '../components/TimeGenerator';
import Loader from '../components/Loader';
import axios from 'axios';
import { URI } from '../redux/URI';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = {
  navigation: any;
};

const NotificationScreen = ({ navigation }: Props) => {
  const { user, users, loading } = useSelector((state: any) => state.user);
  const dispatch = useDispatch();

  const { notifications } = useSelector((state: any) => state.notification);

  // console.log(notifications);

  const labels = ['All', 'Replies', 'Mentions', 'Verified'];

  const [active, setActive] = useState(0);

  useEffect(() => {
    getNotifications()(dispatch);
  }, []);

  return (
    <SafeAreaView>
      <Text
        style={{
          fontSize: 24,
          fontWeight: 'bold',
          marginTop: 12,
          marginHorizontal: 10,
        }}
      >
        Activity
      </Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {labels.map((label, index) => (
          <TouchableOpacity
            onPress={() => setActive(index)}
            key={index}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginVertical: 6,
              marginLeft: 10,
              backgroundColor: index === active ? 'black' : 'white',
              borderRadius: 9,
              paddingVertical: 7,
              width: 100,
            }}
          >
            <Text
              style={{
                fontSize: 17,
                fontWeight: 'bold',
                color: index === active ? 'white' : 'black',
              }}
            >
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {active === 0 && notifications.length !== 0 ? (
        <FlatList
          data={notifications}
          keyExtractor={(item, index) => item._id}
          renderItem={({ item }) => {
            const handleFollowUnfollow = async () => {
              try {
                if (
                  item.creator.followers.find(
                    (follower: any) => follower.userId === item.userId
                  )
                ) {
                  await unfollowUser({
                    users,
                    userToFollowId: item.userId,
                    userId: item.creator._id,
                  })(dispatch);
                } else {
                  await followUser({
                    users,
                    userToFollowId: item.userId,
                    userId: item.creator._id,
                  })(dispatch);
                }
              } catch (error) {
                console.log(error);
              }
            };

            const time = item.createdAt;
            const formattedDuration = getTimeDuration(time);

            const handleNavigation = async () => {
              const token = await AsyncStorage.getItem('token');
              const { data } = await axios.get(
                `${URI}/single-user/${item.creator._id}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );

              navigation.navigate('UserProfile', {
                item: data.user,
              });
            };

            return (
              <>
                {loading ? (
                  <Loader />
                ) : (
                  <>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginHorizontal: 10,
                      }}
                    >
                      <TouchableOpacity
                        onPress={handleNavigation}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 7,
                          marginBottom: 12,
                          marginTop: 6,
                        }}
                      >
                        {item.creator.avatar ? (
                          <Image
                            source={{ uri: item?.avatar.url }}
                            style={{ height: 70, width: 70, borderRadius: 100 }}
                          />
                        ) : (
                          <Ionicons
                            name="person-circle-outline"
                            size={45}
                            color="black"
                          />
                        )}

                        <View>
                          <Text style={{ fontWeight: 'bold' }}>
                            {item.creator.username}{' '}
                          </Text>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              gap: 5,
                            }}
                          >
                            <Text style={{ color: 'gray' }}>{item.title} </Text>
                            <Text style={{ color: 'gray' }}>
                              {formattedDuration}{' '}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={handleFollowUnfollow}
                        style={{
                          borderWidth: 1,
                          borderColor: 'gray',
                          paddingVertical: 3,
                          paddingHorizontal: 9,
                          borderRadius: 8,
                        }}
                      >
                        <Text>
                          {item.creator.following.find(
                            (follower: any) =>
                              follower.userId === item.userId &&
                              !user.following.find(
                                (following: any) =>
                                  following.userId === item.creator._id
                              )
                          )
                            ? 'Follow Back'
                            : item.creator.followers.find(
                                (follower: any) =>
                                  follower.userId === item.userId
                              )
                            ? 'Following'
                            : 'Follow'}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View
                      style={{
                        height: 1,
                        width: '82%',
                        backgroundColor: '#ccd4e0',
                        marginLeft: 'auto',
                      }}
                    />
                  </>
                )}
              </>
            );
          }}
        />
      ) : (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text style={{ textAlign: 'center' }}>You have no activity yet!</Text>
        </View>
      )}

      {active === 1 && (
        // replies.length
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text style={{ textAlign: 'center' }}>You have no replies yet!</Text>
        </View>
      )}
      {/* //  : ( */}
      {/* //   <View style={{ flex: 1, justifyContent: 'center' }}>
      //     <Text style={{ textAlign: 'center' }}>You have no replies yet!</Text>
      //   </View> */}
      {/* // )} */}

      {active === 2 && (
        // replies.length
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text style={{ textAlign: 'center' }}>You have no mention yet!</Text>
        </View>
      )}
      {/* //  : ( */}
      {/* //   <View style={{ flex: 1, justifyContent: 'center' }}>
      //     <Text style={{ textAlign: 'center' }}>You have no replies yet!</Text>
      //   </View> */}
      {/* // )} */}

      {active === 3 && (
        // replies.length
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text style={{ textAlign: 'center' }}>You have no replies yet!</Text>
        </View>
      )}
      {/* //  : ( */}
      {/* //   <View style={{ flex: 1, justifyContent: 'center' }}>
      //     <Text style={{ textAlign: 'center' }}>You have no replies yet!</Text>
      //   </View> */}
      {/* // )} */}
    </SafeAreaView>
  );
};

export default NotificationScreen;
