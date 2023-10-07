import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import getTimeDuration from './TimeGenerator';
import {
  likeThreadReply,
  unlikeThreadReply,
} from '../redux/actions/postActions';
import { URI } from '../redux/URI';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = {
  active: boolean;
  reply: any;
  navigation: any;
  postId: string | null;
  replyId: string | null;
  isThreadReply: boolean;
};

const ThreadDetails = ({
  active,
  reply,
  navigation,
  postId,
  replyId,
  isThreadReply,
}: Props) => {
  const { user } = useSelector((state: any) => state.user);
  const { posts } = useSelector((state: any) => state.post);

  const dispatch = useDispatch();

  const time = reply?.createdAt;
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

  const handleLikeAndUnlikeThreadReply = async (e: any) => {
    const threadId = await AsyncStorage.getItem('threadId');
    try {
      if (e.likes.length !== 0) {
        const isLikedAlready = e.likes.find(
          (like: any) => like.userId === user._id
        );

        if (isLikedAlready) {
          await unlikeThreadReply({
            posts,
            user,
            postId,
            threadId,
            replyId,
          })(dispatch);
        } else {
          await likeThreadReply({
            posts,
            user,
            postId,
            threadId,
            replyId,
          })(dispatch);
        }
      } else {
        await likeThreadReply({
          posts,
          user,
          postId,
          threadId,
          replyId: e._id,
        })(dispatch);
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

  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          marginLeft: 60,
          width: '100%',
          marginTop: 10,
        }}
      >
        <TouchableOpacity onPress={() => handleProfileNavigation(reply.user)}>
          {reply.user?.avatar ? (
            <Image source={{ uri: reply.user.avatar?.url }} />
          ) : (
            <Ionicons name="person-circle-outline" size={35} color="pink" />
          )}
        </TouchableOpacity>

        <View
          style={{
            flex: 1,
            marginRight: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <View>
            <TouchableOpacity
              onPress={() => handleProfileNavigation(reply.user)}
            >
              <Text style={{ marginTop: -10 }}>
                {reply.user?.username.length > 15
                  ? reply.user?.username.slice(0, 15) + '...'
                  : reply.user?.username}
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <Text>{formattedTime}</Text>
            <Text
              style={{
                fontSize: 22,
                marginBottom: 13,
                fontWeight: 'bold',
              }}
            >
              ...
            </Text>
          </View>
        </View>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <Pressable>
            <Text
              style={{
                marginLeft: 103,
                top: -10,
              }}
            >
              {reply.title ? reply.title : ''}
            </Text>

            <View style={{ marginTop: 8, marginLeft: 66 }}>
              {reply.image && (
                <Image
                  source={{ uri: reply.image.source_url }}
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
          </Pressable>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 13,
              marginVertical: 10,
              left: 103,
              bottom: -5,
            }}
          >
            <TouchableOpacity
              onPress={() => handleLikeAndUnlikeThreadReply(reply)}
            >
              {reply.likes?.length > 0 &&
              reply.likes.find(
                (likedBy: any) => likedBy.userId === user._id
              ) ? (
                <Image
                  source={{
                    uri: 'https://cdn-icons-png.flaticon.com/512/2589/2589175.png',
                  }}
                  width={28}
                  height={28}
                />
              ) : (
                <Image
                  source={{
                    uri: 'https://cdn-icons-png.flaticon.com/512/2589/2589197.png',
                  }}
                  width={28}
                  height={28}
                />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate('CreateReplies', {
                  item: reply,
                  postId: postId,
                  isThreadReply: true,
                  replyId: replyId,
                })
              }
            >
              <Image
                source={{
                  uri: 'https://cdn-icons-png.flaticon.com/512/5948/5948565.png',
                }}
                width={20}
                height={20}
                className="ml-5"
              />
            </TouchableOpacity>

            <TouchableOpacity>
              <Image
                source={{
                  uri: 'https://cdn-icons-png.flaticon.com/512/3905/3905866.png',
                }}
                width={23}
                height={23}
                className="ml-5"
              />
            </TouchableOpacity>

            <TouchableOpacity>
              <Image
                source={{
                  uri: 'https://cdn-icons-png.flaticon.com/512/10863/10863770.png',
                }}
                width={23}
                height={23}
                className="ml-5"
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
              marginLeft: 103,
              flexDirection: 'row',
              gap: 7,
              alignItems: 'center',
            }}
          >
            <Text>
              {reply.replies?.length}{' '}
              {reply.replies?.length > 1 ? 'replies' : 'reply'}
            </Text>
            <Text>
              {reply.likes?.length} {reply.likes?.length > 1 ? 'likes' : 'like'}
            </Text>
          </View>
        </View>
      </View>

      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: '#ccd4e0',
          marginTop: 10,
          marginLeft: 50,
        }}
      />
    </>
  );
};

export default ThreadDetails;
