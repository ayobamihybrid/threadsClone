import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import getTimeDuration from './TimeGenerator';
import {
  getAllPosts,
  likePost,
  likePostReply,
  unlikePost,
  unlikePostReply,
} from '../redux/actions/postActions';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ThreadDetails from './ThreadDetails';
import { URI } from '../redux/URI';

type Props = {
  item: any;
  navigation: any;
  postId: string | null;
  isThread: boolean;
  userReplied: boolean;
  userRepliedData: any;
};
const Post = ({
  item,
  navigation,
  postId,
  isThread,
  userReplied,
  userRepliedData,
}: Props) => {
  const { user } = useSelector((state: any) => state.user);
  const { posts } = useSelector((state: any) => state.post);

  const [active, setActive] = useState(false);
  const dispatch = useDispatch();

  const time = item?.createdAt;
  const formattedTime = getTimeDuration(time);

  const [modalOpen, setModalOpen] = useState(false);

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
            console.log(res.data.user, 'res.data.user');
          } else {
            navigation.navigate('Profile');
          }
        });
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

  const handleLikeAndUnlike = async (e: any) => {
    try {
      if (item.likes.length !== 0) {
        const isLikedAlready = item.likes.find(
          (like: any) => like.userId === user._id
        );

        if (isLikedAlready) {
          // await unlikePost({ postId: e._id, posts, user })(dispatch);
          unlikePost({ postId: postId ? postId : e._id, posts, user })(
            dispatch
          );
        } else {
          // await likePost({ postId: e._id, posts, user })(dispatch);
          likePost({ postId: postId ? postId : e._id, posts, user })(dispatch);
        }
      } else {
        // await likePost({ postId: e._id, posts, user })(dispatch);
        likePost({ postId: postId ? postId : e._id, posts, user })(dispatch);
      }
    } catch (error: any) {
      console.log(error.message, 'error message');
    }
  };

  const handleLikeAndUnlikeReply = async (e: any) => {
    try {
      if (e.likes.length !== 0) {
        const isLikedAlready = e.likes.find(
          (like: any) => like.userId === user._id
        );

        if (isLikedAlready) {
          await unlikePostReply({
            posts,
            user,
            postId: postId ? postId : e._id,
            threadId: e._id,
          })(dispatch);
        } else {
          await likePostReply({
            posts,
            user,
            postId: postId ? postId : e._id,
            threadId: e._id,
          })(dispatch);
        }
      } else {
        await likePostReply({
          posts,
          user,
          postId: postId ? postId : e._id,
          threadId: e._id,
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

  const handlePress = async (e: any) => {
    setActive(!active);
    await AsyncStorage.setItem('threadId', e._id);
  };

  const handleDeletePost = async (e: any) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      if (item.user._id === user._id) {
        await axios.delete(`${URI}/delete-post/${e}`, config);
        getAllPosts()(dispatch);
      }
    } catch (error: any) {
      console.log(error.message, 'error message');
    }
  };

  return (
    <>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
        <TouchableOpacity onPress={() => handleProfileNavigation(item.user)}>
          {item.user?.avatar ? (
            <Image source={{ uri: item.user.avatar?.url }} />
          ) : (
            <Ionicons name="person-circle-outline" size={60} color="#7e9cd6" />
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

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <Text>{formattedTime}</Text>
            <Text
              onPress={() => setModalOpen(true)}
              style={{ fontSize: 22, marginBottom: 13, fontWeight: 'bold' }}
            >
              ...
            </Text>
          </View>
        </View>
      </View>

      <View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={{
              left: 30,
              height: '100%',
              width: 1.5,
              backgroundColor: 'gray',
              marginVertical: 5,
            }}
          />

          <View>
            <Pressable>
              <Text style={{ marginLeft: 66, top: -20, marginRight: 50 }}>
                {item.title ? item.title : ''}
              </Text>

              <View style={{ marginTop: 8, marginLeft: 66 }}>
                {item.image && (
                  <Image
                    source={{ uri: item.image.source_url }}
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

            <View style={{ flexDirection: 'column' }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 13,
                  left: 65,
                  marginTop: -10,
                }}
              >
                <TouchableOpacity
                  onPress={() =>
                    isThread
                      ? handleLikeAndUnlikeReply(item)
                      : handleLikeAndUnlike(item)
                  }
                >
                  {item.likes?.length > 0 &&
                  item.likes.find(
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
                      item: item,
                      postId: postId,
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
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 9,
                  marginVertical: 5,
                }}
              >
                <Text
                  onPress={() =>
                    navigation.navigate('PostDetail', {
                      item: item,
                    })
                  }
                  style={{ left: 66, color: 'gray' }}
                >
                  {!isThread && !userReplied
                    ? item.threads && item.threads?.length
                    : ''}{' '}
                  {!isThread && !userReplied
                    ? item.threads && item.threads?.length > 1
                      ? 'replies'
                      : 'reply'
                    : ''}
                </Text>

                <Text
                  style={{ left: 66, color: 'gray' }}
                  onPress={() =>
                    item.likes?.length !== 0 &&
                    navigation.navigate('LikedBy', {
                      item: item.likes,
                    })
                  }
                >
                  {!isThread && !userReplied ? item.likes?.length : ''}{' '}
                  {!isThread && !userReplied
                    ? item.likes?.length > 1
                      ? 'likes'
                      : 'like'
                    : ''}
                </Text>
              </View>

              {userReplied &&
                item.threads.map((reply: any) =>
                  reply.user._id === userRepliedData._id ? (
                    <ThreadDetails
                      active={false}
                      reply={reply}
                      navigation={navigation}
                      postId={postId}
                      key={reply._id}
                      replyId={reply._id}
                      isThreadReply={true}
                    />
                  ) : null
                )}

              {item.reply && (
                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      gap: 10,
                      alignItems: 'center',
                      marginLeft: 66,
                      marginTop: -15,
                    }}
                  >
                    <TouchableOpacity onPress={() => handlePress(item)}>
                      <Text style={{ color: 'gray' }}>
                        {active ? 'Hide replies' : 'Show replies'}
                      </Text>
                    </TouchableOpacity>

                    <Text style={{ color: 'gray' }}>
                      {!active && item.reply?.length}{' '}
                      {active
                        ? ''
                        : item.reply?.length > 1
                        ? 'replies'
                        : 'reply'}
                    </Text>

                    <Text style={{ color: 'gray' }}>
                      {item.likes?.length}{' '}
                      {item.likes?.length > 1 ? 'likes' : 'like'}
                    </Text>
                  </View>

                  {active &&
                    item.reply.map((reply: any) => (
                      <ThreadDetails
                        active={false}
                        reply={reply}
                        navigation={navigation}
                        postId={postId}
                        key={reply._id}
                        replyId={reply._id}
                        isThreadReply={true}
                      />
                    ))}
                </View>
              )}
            </View>
          </View>
        </View>
      </View>

      {modalOpen && item.user._id === user._id && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalOpen}
          onRequestClose={() => setModalOpen(!modalOpen)}
        >
          <TouchableWithoutFeedback onPress={() => setModalOpen(false)}>
            <View
              style={{
                flex: 1,
                justifyContent: 'flex-end',
                backgroundColor: '#00000059',
              }}
            >
              <TouchableWithoutFeedback onPress={() => setModalOpen(true)}>
                <View
                  style={{
                    backgroundColor: '#fff',
                    width: '100%',
                    height: 120,
                    borderRadius: 20,
                    padding: 20,
                    alignItems: 'center',
                  }}
                >
                  <View
                    style={{
                      width: '90%',
                      backgroundColor: '#00000010',
                      padding: 10,
                      borderRadius: 10,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => handleDeletePost(item._id)}
                    >
                      <Text
                        style={{
                          color: 'red',
                          fontWeight: '600',
                          fontSize: 18,
                        }}
                      >
                        Delete
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </>
  );
};

export default Post;
