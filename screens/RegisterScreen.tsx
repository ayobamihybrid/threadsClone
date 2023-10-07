import axios from 'axios';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ToastAndroid,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { registerUser } from '../redux/actions/userActions';
import { useDispatch, useSelector } from 'react-redux';
// import ImagePicker, { ImageOrVideo } from 'react-native-image-crop-picker';

type Props = { navigation: any };

const RegisterScreen = ({ navigation }: Props) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState('');

  const dispatch = useDispatch();

  const { user, error } = useSelector((state: any) => state.user);

  // const uploadImage = () => {
  //   ImagePicker.openPicker({
  //     width: 300,
  //     height: 300,
  //     cropping: true,
  //     compressImageQuality: 0.8,
  //     includeBase64: true,
  //   }).then((image: ImageOrVideo | null) => {
  //     if (image) {
  //       setAvatar('data:image/jpeg;base64,' + image.data);
  //     }
  //   });
  // };

  const handleRegister = () => {
    if (name === '' || email === '' || password === '') {
      if (Platform.OS === 'android') {
        ToastAndroid.show('Please fill all fields', ToastAndroid.LONG);
      } else {
        Alert.alert('Please fill all fields');
      }
    } else {
      registerUser(name, email, password, avatar)(dispatch);
      
      ToastAndroid.show('Registration successful!', ToastAndroid.LONG);
    }
  };

  useEffect(() => {
    if (error) {
      Alert.alert(error);
    }
  }, [error]);

  return (
    <SafeAreaView
      style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
    >
      <View style={{ width: '75%' }}>
        <Text style={{ fontWeight: 'bold', fontSize: 18, textAlign: 'center' }}>
          Sign Up
        </Text>

        <View style={{ borderWidth: 1, borderColor: 'gray', marginTop: 8 }}>
          <TextInput
            placeholder="Enter your name"
            style={{ width: '100%', paddingVertical: 4, paddingHorizontal: 5 }}
            value={name}
            onChangeText={(text) => setName(text)}
          />
        </View>

        <View style={{ borderWidth: 1, borderColor: 'gray', marginTop: 10 }}>
          <TextInput
            placeholder="Enter your email"
            style={{ width: '100%', paddingVertical: 4, paddingHorizontal: 5 }}
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
        </View>

        <View style={{ borderWidth: 1, borderColor: 'gray', marginTop: 10 }}>
          <TextInput
            placeholder="Enter your password"
            style={{ width: '100%', paddingVertical: 4, paddingHorizontal: 5 }}
            secureTextEntry={true}
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
        </View>

        <TouchableOpacity
          // onPress={uploadImage}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 5,
            marginVertical: 7,
          }}
        >
          <Image
            source={{
              uri: avatar
                ? avatar
                : 'https://cdn-icons-png.flaticon.com/128/568/568717.png',
            }}
            style={{ width: 30, height: 30, borderRadius: 30 }}
          />

          <Text>Upload image</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ backgroundColor: 'black', marginTop: 8 }}
          onPress={handleRegister}
        >
          <Text
            style={{
              color: 'white',
              padding: 8,
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: 15,
            }}
          >
            Sign Up
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={{ marginTop: 7 }}>Already have an account? Sign in</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default RegisterScreen;
