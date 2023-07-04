/* eslint-disable no-catch-shadow */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import axios from 'axios';
import { url } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ActivityIndicator, HelperText} from 'react-native-paper';
import crashlytics from '@react-native-firebase/crashlytics';

const Login: React.FC<{navigation: any}> = ({navigation}) => {
    const [mobilenumber, setMobileNumber] = useState<string>('');
    const [isloading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

  const handleinputs = (e: string) => {
    if (e.length === 0) {
      setMobileNumber('');
      setError('');
    } else if (e.length < 10) {
      setMobileNumber('');
      setError('Mobile number must be 10 digits.');
    } else {
      setError('');
      setMobileNumber(e);
    }
  };

  const login = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        url + 'user/send-otp',
        {
          phone: mobilenumber,
        },
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phone: mobilenumber,
          }),
        },
      );
      setIsLoading(false);
      if (response.data.status === true) {
        AsyncStorage.setItem('phoneNumber', mobilenumber);
        setMobileNumber('');
        navigation.navigate('OtpScreen');
      }
    } catch (error) {
      crashlytics().recordError(error);
      setMobileNumber('');
      alert(error.toString());
      setIsLoading(false);
    }
  };

  if (isloading) {
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          backgroundColor: '#fff',
        }}>
        <ActivityIndicator color="#08a29e" size={40} />
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <View
          style={{
            marginTop: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={[styles.introTextStyle, {marginRight: 50}]}>
            Enter your mobile number
          </Text>
          <TextInput
            style={{
              width: '80%',
              backgroundColor: '#fff',
              padding: 15,
              marginTop: 10,
              borderRadius: 5,
              color: '#000',
              borderColor: 'black',
              borderWidth: 1,
              height: 60,
              justifyContent: 'center',
              alignItems: 'flex-start',
              fontSize: 20,
              top: 10,
            }}
            maxLength={10}
            placeholderTextColor="#000"
            keyboardType="numeric"
            placeholder="Mobile Number"
            onChangeText={phone => handleinputs(phone)}
          />
          {error !== '' && (
            <HelperText
              type="error"
              visible={true}
              style={{fontSize: 18, top: 15}}>
              {error}
            </HelperText>
          )}

          <TouchableOpacity
            style={[
              styles.btnContainer,
              mobilenumber.length < 10
                ? {backgroundColor: '#C0C0C0'}
                : {backgroundColor: '#08a29e'},
            ]}
            onPress={() => (mobilenumber.length > 9 ? login() : null)}>
            <Text style={[styles.introTextStyle, {color: '#fff'}]}>
              Continue
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  safeareacontainer: {
    flex: 1,
    backgroundColor: '#08a29e',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  titleStyle: {
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
  },
  paragraphStyle: {
    paddingTop: 10,
    textAlign: 'center',
    fontSize: 30,
  },
  introImageStyle: {
    width: 200,
    height: 200,
    top: 10,
  },
  introTextStyle: {
    fontSize: 20,
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  introTitleStyle: {
    fontSize: 25,
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  btnContainer: {
    width: '85%',
    marginTop: 10,
    borderRadius: 5,
    color: '#000',
    borderColor: '#C0C0C0',
    borderWidth: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    top: 50,
    fontSize: 20,
  },
});
export default Login;
