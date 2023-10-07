import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Platform,
  ToastAndroid,
  Alert,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { URI } from '../redux/URI';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadUser } from '../redux/actions/userActions';

type Props = {
  navigation: any;
};

const EditProfileScreen = ({ navigation }: Props) => {
  const { user } = useSelector((state: any) => state.user);

  const [name, setName] = useState('');
  const [userName, setUserName] = useState('');
  const [bio, setBio] = useState('');

  const dispatch = useDispatch();

  const handleUpdateProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (name !== '' || userName !== '' || bio !== '') {
        await axios.put(`${URI}/edit-profile`, { name, userName, bio }, config);
        ToastAndroid.show('Success', ToastAndroid.LONG);

        loadUser()(dispatch);
      }
    } catch (error: any) {
      console.log(error.message, 'error meesage');
      ToastAndroid.show('Error', ToastAndroid.LONG);
    }
  };

  //   const ImageUpload = () => {
  //     ImagePicker.openPicker({
  //       width: 300,
  //       height: 300,
  //       cropping: true,
  //       compressImageQuality: 0.8,
  //       includeBase64: true,
  //     }).then((image: ImageOrVideo | null) => {
  //       if (image) {
  //         // setImage('data:image/jpeg;base64,' + image.data);
  //         axios
  //           .put(
  //             `${URI}/update-avatar`,
  //             {
  //               avatar: 'data:image/jpeg;base64,' + image?.data,
  //             },
  //             {
  //               headers: {
  //                 Authorization: `Bearer ${token}`,
  //               },
  //             },
  //           )
  //           .then((res: any) => {
  //             loadUser()(dispatch);
  //           });
  //       }
  //     });
  //   };

  return (
    <SafeAreaView>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          margin: 10,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="x" size={24} color="black" />
          </TouchableOpacity>
          <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Edit Profile</Text>
        </View>

        <TouchableOpacity onPress={handleUpdateProfile}>
          <Text style={{ fontWeight: 'bold', fontSize: 18, color: 'green' }}>
            Done
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          height: '90%',
        }}
      >
        <View
          style={{
            borderWidth: 1.5,
            borderColor: 'black',
            padding: 7,
            width: '90%',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <View
              style={{
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: 5,
              }}
            >
              <View>
                <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Name</Text>

                <TextInput
                  placeholder={user.name}
                  value={name}
                  onChangeText={(text) => setName(text)}
                />
              </View>

              <View>
                <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
                  Username
                </Text>
                <TextInput
                  placeholder={user.username}
                  value={userName}
                  onChangeText={(text) => setUserName(text)}
                />
              </View>

              <View>
                <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Bio</Text>
                <View style={{ width: '70%' }}>
                  <TextInput
                    placeholder={user.bio}
                    value={bio}
                    onChangeText={(text) => setBio(text)}
                  />
                </View>
              </View>
            </View>

            {user.avatar ? (
              <Image source={{ uri: user.avatar?.url }} />
            ) : (
              <Ionicons name="person-circle-outline" size={65} color="green" />
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default EditProfileScreen;
