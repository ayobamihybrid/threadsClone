import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { followUser, unfollowUser } from '../redux/actions/userActions';
import Post from '../components/Post';
// import { logOutUser } from '../redux/actions/userActions';

type Props = {
  route: any;
  navigation: any;
};

const UserProfileScreen = ({ route, navigation }: Props) => {
  const { user, users } = useSelector((state: any) => state.user);
  const [active, setActive] = useState(0);
  const d = route.params.item;
  const [data, setData] = useState(d);

  const { posts } = useSelector((state: any) => state.post);

  const dispatch = useDispatch();

  const [userPosts, setUserPosts] = useState([]);
  const [userRepliesData, setUserRepliesData] = useState([]);

  // useEffect(() => {
  //   console.log(data, 'daaata');

  //   if (users) {
  //     const userData = users.find((user: any) => user._id === data?._id);
  //     setData(userData);
  //   }
  // }, [users]);

  // console.log(users, 'useers');
  // console.log(user, 'useerrrr');

  useEffect(() => {
    if (posts) {
      const userPost: any = posts.filter(
        (post: any) => post.user._id === data._id
      );
      setUserPosts(userPost);
    }
  }, [posts]);

  useEffect(() => {
    if (posts) {
      const userReplies = posts.filter((post: any) => {
        const userReplied = post.threads.some(
          (thread: any) => thread.user._id === data._id
        );
        return userReplied;
      });

      setUserRepliesData(userReplies);
    }
  }, [posts]);

  const handleFollowUnfollow = async () => {
    try {
      if (
        data.followers.find((follower: any) => follower.userId === user._id)
      ) {
        await unfollowUser({
          users,
          userToFollowId: data._id,
          userId: user._id,
        })(dispatch);
      } else {
        await followUser({
          users,
          userToFollowId: data._id,
          userId: user._id,
        })(dispatch);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    data && (
      <SafeAreaView>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginHorizontal: 10,
            marginTop: 10,
          }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>

          <Ionicons name="ellipsis-horizontal-circle" size={28} color="black" />
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginHorizontal: 10,
          }}
        >
          <View>
            <Text style={{ fontSize: 25, fontWeight: 'bold' }}>
              {data.name.split(' ')[1]
                ? data.name.split(' ')[0] + ' ' + data.name.split(' ')[1]
                : data.name.split(' ')[0] + ' '}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5,
                marginVertical: 3,
              }}
            >
              <Text>{data.username}</Text>
              <Text
                style={{
                  backgroundColor: 'gray',
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  borderRadius: 12,
                  color: 'cyan',
                }}
              >
                threads.net
              </Text>
            </View>
          </View>

          <View>
            {data.avatar ? (
              <Image
                source={{ uri: data?.avatar.url }}
                style={{ height: 70, width: 70, borderRadius: 100 }}
              />
            ) : (
              <Ionicons name="person-circle-outline" size={80} color="black" />
            )}
          </View>
        </View>

        <Text style={{ margin: 10 }}>
          {/* {data.bio} */}
          Open book
        </Text>

        <View
          style={{
            flexDirection: 'row',
            gap: 2,
            alignItems: 'center',
            marginHorizontal: 10,
          }}
        >
          {/* <Image/> */}

          <Text
            style={{ color: 'gray' }}
            onPress={() =>
              navigation.navigate('Followers', {
                item: data,
                followers: data.followers,
                following: data.following,
              })
            }
          >
            {data.followers.length}{' '}
            {data.followers.length > 1 ? 'followers' : 'follower'}
          </Text>
        </View>

        <View
          style={{
            margin: 10,
          }}
        >
          <TouchableOpacity
            onPress={() => handleFollowUnfollow()}
            style={{
              borderRadius: 10,
              backgroundColor: 'gray',
              width: '100%',
              paddingVertical: 6,
            }}
          >
            <Text
              style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}
            >
              {data.following.find(
                (follower: any) =>
                  follower.userId === user._id &&
                  !user.following.find(
                    (following: any) => following.userId === data?._id
                  )
              )
                ? 'Follow Back'
                : data.followers.find(
                    (follower: any) => follower.userId === user._id
                  )
                ? 'Following'
                : 'Follow'}
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginTop: 20,
          }}
        >
          <View style={{ width: '50%' }}>
            <TouchableOpacity onPress={() => setActive(1)}>
              <Text
                style={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: 16,
                  color: active === 1 ? 'black' : 'gray',
                }}
              >
                Threads
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                width: '100%',
                height: active === 1 ? 2 : 1,
                backgroundColor: active === 1 ? 'black' : 'gray',
                marginTop: 10,
              }}
            />
            <Text />
          </View>
          <View style={{ width: '50%' }}>
            <TouchableOpacity onPress={() => setActive(2)}>
              <Text
                style={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: 16,
                  color: active === 2 ? 'black' : 'gray',
                }}
              >
                Replies
              </Text>
            </TouchableOpacity>

            <Text
              style={{
                width: '100%',
                height: active === 2 ? 2 : 1,
                backgroundColor: active === 2 ? 'black' : 'gray',
                marginTop: 10,
              }}
            />
            <Text />
          </View>
        </View>

        {active === 1 && (
          <View>
            {userPosts.length > 0 ? (
              <FlatList
                data={userPosts}
                keyExtractor={(item, index) => item._id}
                renderItem={({ item }) => (
                  <Post item={item} navigation={navigation} />
                )}
              />
            ) : (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text>No activities yet!</Text>
              </View>
            )}
          </View>
        )}

        {active === 2 && (
          <View>
            {userRepliesData.length > 0 ? (
              <FlatList
                data={userRepliesData}
                keyExtractor={(item, index) => item._id}
                renderItem={({ item }) => (
                  <Post item={item} navigation={navigation} userReplied={true} userRepliedData={data}/>
                )}
              />
            ) : (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text>No activities yet!</Text>
              </View>
            )}
          </View>
        )}
      </SafeAreaView>
    )
  );
};

export default UserProfileScreen;
