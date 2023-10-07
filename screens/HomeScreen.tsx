import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  Animated,
  Easing,
  RefreshControl,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAllPosts } from '../redux/actions/postActions';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import Post from '../components/Post';
import Lottie from 'lottie-react-native';
import loader from '../assets/animation_lkbqh8co.json';
import { getAllUsers } from '../redux/actions/userActions';

type Props = {
  navigation: any;
};

const HomeScreen = ({ navigation }: Props) => {
  const dispatch = useDispatch();

  const { user } = useSelector((state: any) => state.user);
  const { posts, loading } = useSelector((state: any) => state.post);
  const [offsetY, setOffsetY] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [extraPaddingTop] = useState(new Animated.Value(0));
  const refreshingHeight = 100;
  const lottieViewRef = useRef<Lottie>(null);

  let progress = 0;
  if (offsetY < 0 && !isRefreshing) {
    const maxOffsetY = -refreshingHeight;
    progress = Math.min(offsetY / maxOffsetY, 1);
  }

  function onScroll(event: any) {
    const { nativeEvent } = event;
    const { contentOffset } = nativeEvent;
    const { y } = contentOffset;
    setOffsetY(y);
  }

  function onRelease() {
    if (offsetY <= -refreshingHeight && !isRefreshing) {
      setIsRefreshing(true);
      setTimeout(() => {
        getAllPosts()(dispatch);
        setIsRefreshing(false);
      }, 3000);
    }
  }

  function onScrollEndDrag(event: any) {
    const { nativeEvent } = event;
    const { contentOffset } = nativeEvent;
    const { y } = contentOffset;
    setOffsetY(y);

    if (y <= -refreshingHeight && !isRefreshing) {
      setIsRefreshing(true);
      setTimeout(() => {
        getAllPosts()(dispatch);
        setIsRefreshing(false);
      }, 3000);
    }
  }

  useEffect(() => {
    getAllPosts()(dispatch);
  }, []);

  useEffect(() => {
    if (isRefreshing) {
      Animated.timing(extraPaddingTop, {
        toValue: refreshingHeight,
        duration: 0,
        useNativeDriver: false,
      }).start();
      lottieViewRef.current?.play();
    } else {
      Animated.timing(extraPaddingTop, {
        toValue: 0,
        duration: 400,
        easing: Easing.elastic(1.3),
        useNativeDriver: false,
      }).start();
    }
  }, [isRefreshing]);

  return (
    <View>
      {loading ? (
        <Loader />
      ) : (
        <SafeAreaView>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: -30,
              marginBottom: -20,
            }}
          >
            <Image
              source={{
                uri: 'https://vectorlogo4u.com/wp-content/uploads/2023/07/Threads-logo-vector.png',
                height: 120,
                width: 50,
              }}
            />
          </View>

          <Lottie
            ref={lottieViewRef}
            style={{
              height: refreshingHeight,
              display: isRefreshing ? 'flex' : 'none',
              position: 'absolute',
              top: 15,
              left: 0,
              right: 0,
            }}
            loop={false}
            source={loader}
            progress={progress}
          />

          {Platform.OS === 'ios' ? (
            <FlatList
              data={posts}
              keyExtractor={(item, index) => item._id}
              renderItem={({ item }) => (
                <Post item={item} navigation={navigation} />
              )}
              onScroll={onScroll}
              onScrollEndDrag={onScrollEndDrag}
              onResponderRelease={onRelease}
              ListHeaderComponent={
                <Animated.View
                  style={{
                    paddingTop: extraPaddingTop,
                  }}
                />
              }
            />
          ) : (
            <FlatList
              data={posts}
              keyExtractor={(item, index) => item._id}
              renderItem={({ item }) => (
                <Post item={item} navigation={navigation} />
              )}
              onScroll={onScroll}
              onScrollEndDrag={onScrollEndDrag}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={() => {
                    setRefreshing(true);
                    getAllPosts()(dispatch);
                    getAllUsers()(dispatch).then(() => {
                      setRefreshing(false);
                    });
                  }}
                  progressViewOffset={refreshingHeight}
                />
              }
              onResponderRelease={onRelease}
              ListHeaderComponent={
                <Animated.View
                  style={{
                    paddingTop: extraPaddingTop,
                  }}
                />
              }
            />
          )}
        </SafeAreaView>
      )}
    </View>
  );
};

export default HomeScreen;
