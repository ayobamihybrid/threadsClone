import axios from 'axios';
import { Dispatch } from 'react';
import { URI } from '../URI';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const createPost =
  (
    title: string,
    image: string,
    user: Object,
    threads: Array<{ title: string; image: string; user: any }>
  ) =>
  async (dispatch: Dispatch<any>) => {
    try {
      dispatch({
        type: 'createPostRequest',
      });

      const postInfo = {
        title,
        user,
        threads,
        image,
      };

      const token = await AsyncStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const { data } = await axios.post(`${URI}/create-post`, postInfo, config);

      dispatch({
        type: 'createPostSuccess',
        payload: data.post,
      });
    } catch (error: any) {
      dispatch({
        type: 'createPostFailed',
        payload: error.response.data.message,
      });
    }
  };

export const getAllPosts = () => async (dispatch: Dispatch<any>) => {
  try {
    dispatch({
      type: 'getAllPostsRequest',
    });

    const token = await AsyncStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.get(`${URI}/get-all-posts`, config);

    dispatch({
      type: 'getAllPostsSuccess',
      payload: data.posts,
    });
  } catch (error: any) {
    dispatch({
      type: 'getAllPostsFailed',
      payload: error.response.data.message,
    });
  }
};

interface likeAndUnlikeParams {
  postId: string;
  posts: any;
  user: any;
}

export const likePost =
  ({ postId, posts, user }: likeAndUnlikeParams) =>
  async (dispatch: Dispatch<any>) => {
    try {
      const updatedPost = posts.map((post: any) =>
        post._id === postId
          ? {
              ...post,
              likes: [
                ...post.likes,
                {
                  name: user.name,
                  userName: user.username,
                  userAvatar: user.avatar?.url,
                  userId: user._id,
                },
              ],
            }
          : post
      );

      dispatch({
        type: 'getAllPostsSuccess',
        payload: updatedPost,
      });

      const token = await AsyncStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.put(`${URI}/like-unlike`, { postId }, config);
    } catch (error: any) {
      console.log(error.message, 'error message');
    }
  };

export const unlikePost =
  ({ postId, posts, user }: likeAndUnlikeParams) =>
  async (dispatch: Dispatch<any>) => {
    try {
      const updatedPost = posts.map((post: any) =>
        post._id === postId
          ? {
              ...post,
              likes: [
                post.likes.filter((like: any) => like.userId !== user._id),
              ],
            }
          : post
      );

      dispatch({
        type: 'getAllPostsSuccess',
        payload: updatedPost,
      });

      const token = await AsyncStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.put(`${URI}/like-unlike`, { postId }, config);
    } catch (error: any) {
      console.log(error.message, 'error message');
    }
  };

interface likeUnlikeReplyParams {
  posts: any;
  user: any;
  postId?: string | null;
  threadId?: string | null;
}

export const likePostReply =
  ({ posts, user, postId, threadId }: likeUnlikeReplyParams) =>
  async (dispatch: Dispatch<any>) => {
    try {
      const updatedLikeReply = posts.map((post: any) =>
        post._id === postId
          ? {
              ...post,
              threads: post.threads.map((thread: any) =>
                thread._id === threadId
                  ? {
                      ...thread,
                      likes: [
                        ...thread.likes,
                        {
                          name: user.name,
                          userName: user.username,
                          userId: user._id,
                          userAvatar: user.avatar?.url,
                        },
                      ],
                    }
                  : thread
              ),
            }
          : post
      );

      dispatch({
        type: 'getAllPostsSuccess',
        payload: updatedLikeReply,
      });

      const token = await AsyncStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.put(
        `${URI}/like-unlike-replies`,
        { postId, threadId },
        config
      );
    } catch (error: any) {
      console.log(error.message, 'error message');
    }
  };

export const unlikePostReply =
  ({ posts, user, postId, threadId }: likeUnlikeReplyParams) =>
  async (dispatch: Dispatch<any>) => {
    try {
      const updatedunlikePostReply = posts.map((post: any) =>
        post._id === postId
          ? {
              ...post,
              threads: post.threads.map((thread: any) =>
                thread._id === threadId
                  ? {
                      ...thread,
                      likes: thread.likes.filter(
                        (like: any) => like.userId !== user._id
                      ),
                    }
                  : thread
              ),
            }
          : post
      );

      dispatch({
        type: 'getAllPostsSuccess',
        payload: updatedunlikePostReply,
      });

      const token = await AsyncStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.put(
        `${URI}/like-unlike-replies`,
        { postId, threadId },
        config
      );
    } catch (error) {
      console.log(error, 'error message');
    }
  };

interface likeUnlikeThreadReplyParams {
  posts: any;
  user: any;
  postId?: string | null;
  threadId?: string | null;
  replyId: string | null;
}

export const likeThreadReply =
  ({ posts, user, postId, threadId, replyId }: likeUnlikeThreadReplyParams) =>
  async (dispatch: Dispatch<any>) => {
    try {
      const updatedLikeThreadReply = posts.map((post: any) =>
        post._id === postId
          ? {
              ...post,
              threads: post.threads.map((thread: any) =>
                thread._id === threadId
                  ? {
                      ...thread,
                      reply: thread.reply.map((replies: any) =>
                        replies._id === replyId
                          ? {
                              ...replies,
                              likes: [
                                ...replies.likes,
                                {
                                  name: user.name,
                                  userName: user.username,
                                  userId: user._id,
                                  userAvatar: user.avatar?.url,
                                },
                              ],
                            }
                          : replies
                      ),
                    }
                  : thread
              ),
            }
          : post
      );

      dispatch({
        type: 'getAllPostsSuccess',
        payload: updatedLikeThreadReply,
      });

      const token = await AsyncStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.put(
        `${URI}/like-unlike-replies`,
        { postId, threadId, replyId },
        config
      );
    } catch (error: any) {
      console.log(error.message, 'error message');
    }
  };

export const unlikeThreadReply =
  ({ posts, user, postId, threadId, replyId }: likeUnlikeThreadReplyParams) =>
  async (dispatch: Dispatch<any>) => {
    try {
      const updatedunlikeThreadReply = posts.map((post: any) =>
        post._id === postId
          ? {
              ...post,
              threads: post.threads.map((thread: any) =>
                thread._id === threadId
                  ? {
                      ...thread,
                      reply: thread.reply.map((replies: any) =>
                        replies._id === replyId
                          ? {
                              ...replies,
                              likes: replies.likes.filter(
                                (like: any) => like.userId !== user._id
                              ),
                            }
                          : replies
                      ),
                    }
                  : thread
              ),
            }
          : post
      );

      dispatch({
        type: 'getAllPostsSuccess',
        payload: updatedunlikeThreadReply,
      });

      const token = await AsyncStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.put(
        `${URI}/like-unlike-replies`,
        { postId, threadId },
        config
      );
    } catch (error) {
      console.log(error, 'error message');
    }
  };
