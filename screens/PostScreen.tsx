import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import ImagePicker, { ImageOrVideo } from 'react-native-image-crop-picker';
import { createPost, getAllPosts } from '../redux/actions/postActions';

type Props = { navigation: any };

const PostScreen = ({ navigation }: Props) => {
  const { user } = useSelector((state: any) => state.user);
  const { isPostSuccessful, isLoading } = useSelector(
    (state: any) => state.post
  );
  const dispatch = useDispatch();

  const [title, setTitle] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const [threads, setThreads] = useState([
    {
      title: '',
      image: '',
      user,
    },
  ]);

  const [image, setImage] = useState('');

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

  useEffect(() => {
    if (
      threads.length === 1 &&
      threads[0].title === '' &&
      threads[0].image === ''
    ) {
      setThreads([]);
    }

    if (isPostSuccessful) {
      navigation.navigate('Home2');
      getAllPosts()(dispatch);

      setThreads([]);
      setTitle('');
      setImage('');
    }
  }, [isPostSuccessful]);

  // useEffect(() => {
  //   console.log('activeIndex:', activeIndex);
  //   console.log('threads length:', threads.length);
  // }, [activeIndex, threads]);

  const handleTextChange = (text: string, index: number) => {
    setThreads((prevState) => {
      const updateThread = [...prevState];
      updateThread[index] = { ...updateThread[index], title: text };
      return updateThread;
    });
  };

  const addToThread = () => {
    if (title !== '' || image !== '') {
      setThreads((prevState) => [...prevState, { title: '', image: '', user }]);
      setActiveIndex(threads.length);
    }
  };

  const addMoreThread = () => {
    if (
      threads[activeIndex].title !== '' ||
      threads[activeIndex].image !== ''
    ) {
      setThreads((prevState) => [...prevState, { title: '', image: '', user }]);

      setActiveIndex(threads.length);
    }
  };

  const removeThread = (index: number) => {
    if (threads.length > 0 && index === activeIndex) {
      const updateThread = [...threads];
      updateThread.splice(index, 1);
      setThreads(updateThread);
      setActiveIndex(threads.length - 2);
      return updateThread;
    }
  };

  const handlePost = () => {
    if (title !== '' || (image !== '' && !isLoading)) {
      createPost(title, image, user, threads)(dispatch);
      
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          marginVertical: 14,
          marginHorizontal: 17,
        }}
      >
        <Ionicons
          name="md-close-sharp"
          size={26}
          color="black"
          onPress={() => navigation.goBack()}
        />

        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>New Thread</Text>
      </View>

      <View style={{ height: 1, width: '100%', backgroundColor: 'gray' }} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
              marginLeft: 7,
              marginTop: 5,
            }}
          >
            {user.avatar ? (
              <Image
                source={{ uri: user?.avatar.url }}
                style={{ height: 30, width: 30, borderRadius: 30 }}
              />
            ) : (
              <Ionicons name="person-circle-outline" size={48} color="black" />
            )}

            <View style={{ flex: 1, justifyContent: 'center' }}>
              <Text style={{ paddingTop: 12 }}>@{user?.username}</Text>
              <TextInput
                style={{ marginTop: -3 }}
                placeholder="Start a thread..."
                value={title}
                onChangeText={(text) => setTitle(text)}
              />
            </View>

            {title !== '' && (
              <Ionicons
                onPress={() => setTitle('')}
                name="md-close-sharp"
                size={22}
                color="gray"
                style={{ marginRight: 10 }}
              />
            )}
          </View>

          <View
            style={{
              marginHorizontal: 31,
              flexDirection: 'row',
              gap: 30,
              alignItems: 'center',
            }}
          >
            <View
              style={{
                height: '100%',
                backgroundColor: 'gray',
                width: 1.5,
              }}
            />

            {image === '' ? (
              <TouchableOpacity onPress={UploadImage}>
                <Image
                  source={{
                    uri: 'https://cdn-icons-png.flaticon.com/512/10857/10857463.png',
                  }}
                  style={{
                    width: 20,
                    height: 20,
                  }}
                  tintColor={'#000'}
                />
              </TouchableOpacity>
            ) : (
              <Image
                source={{ uri: image }}
                height={200}
                width={200}
                resizeMethod="auto"
              />
            )}
          </View>
        </>

        {threads.length === 0 && (
          <View
            style={{
              flexDirection: 'row',
              gap: 15,
              alignItems: 'center',
              marginLeft: 19,
              marginTop: 4,
            }}
          >
            {user.avatar ? (
              <Image
                source={{ uri: user?.avatar.url }}
                style={{ height: 10, width: 10, borderRadius: 30 }}
              />
            ) : (
              <Ionicons name="person-circle-outline" size={26} color="black" />
            )}

            <Text style={{ color: 'gray' }} onPress={addToThread}>
              Add to thread
            </Text>
          </View>
        )}

        <View style={{ flex: 1 }}>
          {threads.map((thread, index) => (
            <View key={index}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                  marginLeft: 7,
                  marginTop: 5,
                }}
              >
                {user.avatar ? (
                  <Image
                    source={{ uri: user?.avatar.url }}
                    style={{ height: 30, width: 30, borderRadius: 30 }}
                  />
                ) : (
                  <Ionicons
                    name="person-circle-outline"
                    size={48}
                    color="black"
                  />
                )}

                <View style={{ flex: 1, justifyContent: 'center' }}>
                  <Text style={{ paddingTop: 12 }}>@{user?.username}</Text>
                  <TextInput
                    style={{ marginTop: -3 }}
                    placeholder="Start a thread..."
                    value={thread.title}
                    onChangeText={(text) => handleTextChange(text, index)}
                  />
                </View>

                {thread.title !== '' && (
                  <Ionicons
                    onPress={() => removeThread(index)}
                    name="md-close-sharp"
                    size={22}
                    color="gray"
                    style={{ marginRight: 10 }}
                  />
                )}
              </View>

              <View
                style={{
                  marginHorizontal: 31,
                  flexDirection: 'row',
                  gap: 30,
                  alignItems: 'center',
                }}
              >
                <View
                  style={{
                    height: image ? 250 : 50,
                    backgroundColor: 'gray',
                    width: 1.5,
                  }}
                />

                {thread.image === '' ? (
                  // <TouchableOpacity onPress={UploadRepliesImage(index)}>
                  <Image
                    source={{
                      uri: 'https://cdn-icons-png.flaticon.com/512/10857/10857463.png',
                    }}
                    style={{
                      width: 20,
                      height: 20,
                    }}
                    tintColor={'#000'}
                  />
                ) : (
                  // </TouchableOpacity>
                  <Image
                    source={{ uri: thread.image }}
                    height={300}
                    width={200}
                    resizeMethod="auto"
                  />
                )}
              </View>

              {activeIndex === index && (
                <View
                  style={{
                    flexDirection: 'row',
                    gap: 15,
                    alignItems: 'center',
                    marginLeft: 20,
                    marginTop: 5,
                  }}
                >
                  {user.avatar ? (
                    <Image
                      source={{ uri: user?.avatar.url }}
                      style={{ height: 10, width: 10, borderRadius: 30 }}
                    />
                  ) : (
                    <Ionicons
                      name="person-circle-outline"
                      size={26}
                      color="black"
                    />
                  )}

                  <Text
                    style={{ color: 'gray' }}
                    onPress={() => {
                      console.log(index, 'indexx');

                      addMoreThread();
                    }}
                  >
                    Add to thread
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>
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

        <TouchableOpacity onPress={handlePost}>
          <Text style={{ fontSize: 19, fontWeight: 'bold', color: 'indigo' }}>
            Post
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PostScreen;
