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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { loadUser, loginUser } from '../redux/actions/userActions';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = { navigation: any };

const LoginScreen = ({ navigation }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { isAuthenticated, error } = useSelector((state: any) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      if (Platform.OS === 'android') {
        ToastAndroid.show('Incorrect credentials! ' + error, ToastAndroid.LONG);
      } else {
        Alert.alert('Incorrect credentials!', error);
      }
    } else if (isAuthenticated) {
      loadUser()(dispatch);
      if (Platform.OS === 'android') {
        ToastAndroid.show('Login Succesful!', ToastAndroid.LONG);
        loadUser()(dispatch);
      } else {
        Alert.alert('Login Successful!');
        loadUser()(dispatch);
      }
    }
  }, [isAuthenticated, error]);

  const handleSignIn = () => {
    if (email === '' || password === '') {
      if (Platform.OS === 'android') {
        ToastAndroid.show('Please fill all fields', ToastAndroid.LONG);
      } else {
        Alert.alert('Please fill all fields');
      }
    }

    loginUser(email, password)(dispatch);
  };

  return (
    <SafeAreaView
      style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
    >
      <View style={{ width: '75%' }}>
        <Text style={{ fontWeight: 'bold', fontSize: 18, textAlign: 'center' }}>
          Login
        </Text>

        <View style={{ borderWidth: 1, borderColor: 'gray', marginTop: 10 }}>
          <TextInput
            placeholder="Enter your email"
            style={{ width: '100%', paddingVertical: 4, paddingHorizontal: 5 }}
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
        </View>

        <View style={{ borderWidth: 1, borderColor: 'gray', marginTop: 12 }}>
          <TextInput
            placeholder="Enter your password"
            style={{ width: '100%', paddingVertical: 4, paddingHorizontal: 5 }}
            secureTextEntry={true}
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
        </View>

        <TouchableOpacity
          style={{ backgroundColor: 'black', marginTop: 18 }}
          onPress={handleSignIn}
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
            Sign In
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={{ marginTop: 7 }}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
