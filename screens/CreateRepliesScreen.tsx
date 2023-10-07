import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { URI } from '../redux/URI';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getTimeDuration from '../components/TimeGenerator';
import { getAllPosts } from '../redux/actions/postActions';

type Props = {
  navigation: any;
  route: any;
  postId: string;
};

const CreateRepliesScreen = ({ navigation, route }: Props) => {
  const { user } = useSelector((state: any) => state.user);
  const { posts } = useSelector((state: any) => state.post);
  const item = route.params.item;
  const postId = route.params.postId;
  const isThreadReply = route.params.isThreadReply;
  const replyId = route.params.replyId;

  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const dispatch = useDispatch();

  const time = item?.createdAt;
  const formattedTime = getTimeDuration(time);

  const handleProfileNavigation = async (e: any) => {
    try {
      const token = await AsyncStorage.getItem('token');

      await axios
        .get(`${URI}/single-user/${e._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.user._id !== user._id) {
            navigation.navigate('UserProfile', {
              item: res.data.user,
            });
          } else {
            navigation.navigate('Profile');
          }
        });
    } catch (error) {
      console.log('error message:', error);
    }
  };

  const UploadImage = () => {
    // ImagePicker.openPicker({
    //   width: 300,
    //   height: 300,
    //   cropping: true,
    //   compressImageQuality: 0.8,
    //   includeBase64: true,
    // }).then((image: ImageOrVideo | null) => {
    //   if (image) {
    //     setImage('data:image/jpeg;base64,' + image.data);
    //   }
    // });
  };

  const handlePostReply = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (!postId) {
        const { data } = await axios.put(
          `${URI}/post-reply`,
          { title, image, postId: item._id },
          config
        );
        getAllPosts()(dispatch);
        navigation.navigate('PostDetail', {
          item: data.post,
        });

        setTitle('');
        setImage('');
      } else {
        const { data } = await axios.put(
          `${URI}/thread-reply`,
          { title, image, postId, threadId: item._id },
          config
        );
        getAllPosts()(dispatch);
        navigation.navigate('PostDetail', {
          item: data.post,
        });

        setTitle('');
        setImage('');
      }
    } catch (error: any) {
      if (error.response) {
        console.log('Response data:', error.response.data);
        console.log('Response status:', error.response.status);
        console.log('Response headers:', error.response.headers);
      } else if (error.request) {
        console.log('Request:', error.request);
      }
    }
  };

  const handleThreadReply = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const threadId = await AsyncStorage.getItem('threadId');

      const { data } = await axios.put(
        `${URI}/threads-reply-reply`,
        { title, image, postId, threadId, replyId },
        config
      );
      getAllPosts()(dispatch);
      navigation.navigate('PostDetail', {
        item: data.post,
      });

      setTitle('');
      setImage('');
    } catch (error: any) {
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
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: 'row',
          gap: 29,
          alignItems: 'center',
          marginHorizontal: 10,
          marginTop: 10,
          marginBottom: 20,
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="close" size={28} color="black" />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Reply</Text>
      </View>

      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: '#ccd4e0',
          marginTop: -10,
        }}
      />

      <ScrollView>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
          <TouchableOpacity onPress={() => handleProfileNavigation(item.user)}>
            {item.user?.avatar ? (
              <Image source={{ uri: item.user.avatar?.url }} />
            ) : (
              <Ionicons
                name="person-circle-outline"
                size={60}
                color="#7e9cd6"
              />
            )}
          </TouchableOpacity>

          <View
            style={{
              flex: 1,
              marginRight: 10,
              flexDirection: 'row',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
            }}
          >
            <View>
              <TouchableOpacity
                onPress={() => handleProfileNavigation(item.user)}
              >
                <Text>{item.user?.username}</Text>
              </TouchableOpacity>
            </View>

            <View
              style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}
            >
              <Text>{formattedTime}</Text>
              <Text
                style={{ fontSize: 22, marginBottom: 13, fontWeight: 'bold' }}
              >
                ...
              </Text>
            </View>
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={{
              left: 30,
              height: '100%',
              width: 1.5,
              backgroundColor: 'gray',
              marginTop: 10,
            }}
          />

          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <View>
              <Text style={{ maxWidth: 230, left: 66, top: -30 }}>
                {item.title ? item.title : ''}
              </Text>

              <View style={{ marginTop: 8, marginLeft: 66 }}>
                {item.image && (
                  <Image
                    source={{ uri: image }}
                    style={{
                      flex: 1,
                      aspectRatio: 1,
                      borderRadius: 10,
                      zIndex: 1110,
                      resizeMode: 'contain',
                    }}
                  />
                )}
              </View>
            </View>
          </View>
        </View>

        <KeyboardAvoidingView
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 7,
            marginTop: 6,
          }}
        >
          <TouchableOpacity onPress={() => handleProfileNavigation(user)}>
            {user?.avatar ? (
              <Image source={{ uri: user.avatar?.url }} />
            ) : (
              <Ionicons name="person-circle-outline" size={60} color="pink" />
            )}
          </TouchableOpacity>

          <View
            style={{
              flex: 1,
              marginRight: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <View>
              <TouchableOpacity onPress={() => handleProfileNavigation(user)}>
                <Text>{user?.username}</Text>
              </TouchableOpacity>
            </View>

            <View>
              <Text
                style={{ fontSize: 22, marginBottom: 13, fontWeight: 'bold' }}
              >
                ...
              </Text>
            </View>
          </View>
        </KeyboardAvoidingView>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={{
              left: 30,
              height: '100%',
              width: 1.5,
              backgroundColor: 'gray',
              marginTop: 10,
            }}
          />
          <TextInput
            onChangeText={(text) => setTitle(text)}
            placeholder={`Reply to ${item.user.username}...`}
            value={title}
            style={{ left: 66, top: -30, maxWidth: '65%' }}
          />
        </View>

        <TouchableOpacity onPress={UploadImage}>
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/512/10857/10857463.png',
            }}
            style={{
              width: 20,
              height: 20,
              left: 66,
              top: -22,
            }}
            tintColor={'#000'}
          />
        </TouchableOpacity>

        <View style={{ marginTop: 8, marginLeft: 66 }}>
          {item.image && (
            <Image
              source={{ uri: item.image.url }}
              style={{
                aspectRatio: 1,
                borderRadius: 10,
                zIndex: 1110,
                resizeMode: 'contain',
              }}
            />
          )}
        </View>

        <View
          style={{
            height: 1,
            width: '100%',
            backgroundColor: '#ccd4e0',
            marginTop: -10,
          }}
        />
      </ScrollView>

      <KeyboardAvoidingView
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          margin: 15,
        }}
      >
        <TouchableOpacity>
          <Text style={{ color: 'gray' }}>Anyone can reply</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={!isThreadReply ? handlePostReply : handleThreadReply}
        >
          <Text style={{ fontSize: 19, fontWeight: 'bold', color: 'indigo' }}>
            Post
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreateRepliesScreen;
