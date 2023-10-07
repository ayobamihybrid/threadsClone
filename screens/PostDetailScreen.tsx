import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Post from '../components/Post';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import getTimeDuration from '../components/TimeGenerator';
import {
  getAllPosts,
  likePost,
  likePostReply,
  unlikePost,
  unlikePostReply,
} from '../redux/actions/postActions';
import { AntDesign } from '@expo/vector-icons';

type Props = {
  navigation: any;
  route: any;
};

const PostDetailScreen = ({ navigation, route }: Props) => {
  let item = route.params.item;
  const { posts } = useSelector((state: any) => state.post);
  const [data, setData] = useState(item);

  const dispatch = useDispatch();

  const time = item?.threads?.createdAt;
  const formattedTime = getTimeDuration(time);

  useEffect(() => {
    if (posts) {
      const d = posts.find((post: any) => post._id === item._id);
      setData(d);
    }
  }, [posts]);

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
      <ScrollView>
        <Post item={item} navigation={navigation} />

        <View style={{ marginTop: 10 }}>
          {data.threads.map((thread: any, index: number) => (
            <Post
              item={thread}
              navigation={navigation}
              key={index}
              postId={item._id}
              isThread={true}
            />
          ))}
        </View>
      </ScrollView>

      <KeyboardAvoidingView
        style={{
          width: '95%',
          backgroundColor: 'gray',
          padding: 10,
          borderRadius: 18,
          marginVertical: 25,
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('CreateReplies', {
              item: item,
            })
          }
        >
          <Text
            style={{ color: 'white' }}
          >{`Reply to ${item.user.username}`}</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PostDetailScreen;
