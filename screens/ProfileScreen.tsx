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
import { logOutUser } from '../redux/actions/userActions';
import Post from '../components/Post';

type Props = {
  navigation: any;
};

const ProfileScreen = ({ navigation }: Props) => {
  const { user } = useSelector((state: any) => state.user);
  const { posts } = useSelector((state: any) => state.post);

  const [data, setData] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [userRepliesData, setUserRepliesData] = useState([]);

  const [active, setActive] = useState(1);
  const dispatch = useDispatch();

  const logOut = () => {
    logOutUser()(dispatch);
  };

  useEffect(() => {
    if (posts) {
      const userPost: any = posts.filter(
        (post: any) => post.user._id === user._id
      );
      setUserPosts(userPost);
    }
  }, [posts]);

  useEffect(() => {
    if (posts) {
      const userReplies = posts.filter((post: any) => {
        const userReplied = post.threads.some(
          (thread: any) => thread.user._id === user._id
        );
        return userReplied;
      });

      setUserRepliesData(userReplies);
    }
  }, [posts]);

  return (
    <SafeAreaView>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginHorizontal: 10,
          marginVertical: 18,
        }}
      >
        <AntDesign name="earth" size={24} color="black" />

        <View style={{ flexDirection: 'row', gap: 17, alignItems: 'center' }}>
          <AntDesign name="instagram" size={27} color="black" />
          <Ionicons name="ios-menu-outline" size={24} color="black" />
        </View>
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
            {user.name.split(' ')[1]
              ? user.name.split(' ')[0] + ' ' + user.name.split(' ')[1]
              : user.name.split(' ')[0] + ' '}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
              marginVertical: 3,
            }}
          >
            <Text>{user.username}</Text>
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
          {user.avatar ? (
            <Image
              source={{ uri: user?.avatar.url }}
              style={{ height: 70, width: 70, borderRadius: 100 }}
            />
          ) : (
            <Ionicons name="person-circle-outline" size={65} color="black" />
          )}
        </View>
      </View>

      <Text style={{ margin: 10 }}>{user.bio}</Text>

      <View
        style={{
          flexDirection: 'row',
          gap: 2,
          alignItems: 'center',
          marginHorizontal: 10,
        }}
      >
        {/* 
        const userFirstThreeFollowers = user.followers.slice(0, 3)
        userFirstThreeFollowers.map((follower:any) => (
          <View style={{size: small, marginLeft: -10}}>
          <Image/>
          </View>
        ))
        */}

        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Followers', {
              followers: user.followers,
              following: user.following,
            })
          }
        >
          <Text style={{ color: 'gray' }}>
            {user.followers.length}{' '}
            {user.followers.length < 1 ? 'follower' : 'followers'}
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          flexDirection: 'row',
          gap: 20,
          alignItems: 'center',
          margin: 10,
          justifyContent: 'center',
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate('EditProfile')}
          style={{
            borderWidth: 1,
            borderRadius: 10,
            borderColor: 'gray',
            width: 170,
            paddingVertical: 5,
          }}
        >
          <Text
            style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}
          >
            Edit Profile
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            borderWidth: 1,
            borderRadius: 10,
            borderColor: 'gray',
            width: 150,
            paddingVertical: 5,
          }}
        >
          <Text
            onPress={logOut}
            style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}
          >
            Log out
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
        </View>
      </View>

      {active === 1 && userPosts ? (
        <FlatList
          data={userPosts}
          keyExtractor={(item, index) => item._id}
          renderItem={({ item }) => (
            <Post item={item} navigation={navigation} />
          )}
        />
      ) : null}

      {active === 2 && userRepliesData ? (
        <FlatList
          data={userRepliesData}
          keyExtractor={(item, index) => item._id}
          renderItem={({ item }) => (
            <Post item={item} navigation={navigation} />
          )}
        />
      ) : null}
    </SafeAreaView>
  );
};

export default ProfileScreen;
