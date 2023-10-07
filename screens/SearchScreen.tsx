import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EvilIcons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import {
  followUser,
  getAllUsers,
  unfollowUser,
} from '../redux/actions/userActions';
import { Ionicons } from '@expo/vector-icons';
import Loader from '../components/Loader';

type Props = {
  navigation: any;
};

const SearchScreen = ({ navigation }: Props) => {
  const { users, user, loading } = useSelector((state: any) => state.user);
  const [data, setData] = useState([
    {
      name: '',
      username: '',
      avatar: { url: '' },
      followers: [],
    },
  ]);
  const dispatch = useDispatch();

  useEffect(() => {
    getAllUsers()(dispatch);
  }, [dispatch]);

  useEffect(() => {
    if (users) {
      setData(users);
    }
  }, [users]);

  const handleSearch = (text: string) => {
    const term = text;

    const filteredUsers = users.filter((user: any) =>
      user.name.toLowerCase().includes(term.toLocaleLowerCase())
    );
    setData(filteredUsers);
  };

  return (
    <>
      {loading ? (
          <Loader />
        ) : (
        <SafeAreaView>
          <Text
            style={{
              fontSize: 28,
              fontWeight: 'bold',
              marginTop: 15,
              marginHorizontal: 15,
            }}
          >
            Search
          </Text>
          <View
            style={{
              backgroundColor: 'gray',
              borderRadius: 7,
              paddingHorizontal: 7,
              paddingVertical: 5,
              flexDirection: 'row',
              gap: 7,
              alignItems: 'center',
              width: '94%',
              marginLeft: 'auto',
              marginRight: 'auto',
              marginTop: 4,
              marginBottom: 15,
            }}
          >
            <EvilIcons name="search" size={26} color="black" />
            <TextInput
              placeholder="Search"
              style={{ width: '100%' }}
              onChangeText={(text) => handleSearch(text)}
            />
          </View>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={data}
            // keyExtractor={(item, index) => item._id}
            renderItem={({ item }) => {
              const handleFollowUnfollow = async (i: any) => {
                try {
                  if (
                    i.followers.find(
                      (follower: any) => follower.userId === user._id
                    )
                  ) {
                    await unfollowUser({
                      users,
                      userToFollowId: i._id,
                      userId: user._id,
                    })(dispatch);
                  } else {
                    await followUser({
                      users,
                      userToFollowId: i._id,
                      userId: user._id,
                    })(dispatch);
                  }
                } catch (error) {
                  console.log(error);
                }
              };

              return (
                <>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '94%',
                      marginLeft: 'auto',
                      marginRight: 'auto',
                    }}
                  >
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('UserProfile', { item: item })
                      }
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 7,
                      }}
                    >
                      {item.avatar ? (
                        <Image source={{ uri: item.avatar?.url }} />
                      ) : (
                        <Ionicons
                          name="person-circle-outline"
                          size={45}
                          color="black"
                        />
                      )}

                      <View style={{ flexDirection: 'column' }}>
                        <Text>{item.username}</Text>
                        <Text style={{ color: 'gray' }}>{item.name}</Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleFollowUnfollow(item)}
                      style={{
                        paddingVertical: 3,
                        paddingHorizontal: 18,
                        borderWidth: 1,
                        borderRadius: 7,
                        borderColor: 'gray',
                      }}
                    >
                      <Text>
                        {item.followers.find(
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
                      gap: 7,
                      alignItems: 'center',
                      marginHorizontal: 60,
                      marginBottom: 10,
                    }}
                  >
                    {item.avatar ? (
                      <Image source={{ uri: item.avatar?.url }} />
                    ) : (
                      <Ionicons
                        name="person-circle-outline"
                        size={20}
                        color="black"
                      />
                    )}

                    <Text>
                      {item.followers.length}{' '}
                      {item.followers.length > 1 ? 'followers' : 'follower'}
                    </Text>
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
              );
            }}
          />
        </SafeAreaView>
      )}
    </>
  );
};

export default SearchScreen;
