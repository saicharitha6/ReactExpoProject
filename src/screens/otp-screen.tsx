/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import OTPInputView from '@twotalltotems/react-native-otp-input';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import { ActivityIndicator, HelperText } from 'react-native-paper';
import axios from 'axios';
import { url } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../store/auth-store/auth-provider';
import crashlytics from '@react-native-firebase/crashlytics';

const OtpScreen: React.FC = () => {
    const { setUser } = useContext(AuthContext);
    const [otp, setOtp] = useState<string>('');
    const [mobilenumber, setMobileNumber] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isloading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    AsyncStorage.getItem('phoneNumber').then((val) => {
      setMobileNumber(val);
    });
  }, []);

  const verify = async (code: string) => {
    setIsLoading(true);
    axios
      .post(
        url + 'user/verify-otp',
        {
          phone: mobilenumber,
          otp: code,
        },
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      )
      .then((response) => {
        setIsLoading(false);
        if (response.data.status) {
          setError('');
          setUser(response.data.accessToken);
          AsyncStorage.setItem('token', response.data.accessToken);
        } else {
          setError(response.data.message);
        }
      })
      .catch((error) => {
        setIsLoading(false);
        crashlytics().recordError(error);
      });
  };
  if (isloading) {
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center', height: '100%', backgroundColor: '#fff' }}>
        <ActivityIndicator color="#08a29e" size={40} />
      </View>
    );
  } else {
    return (
      <View style={{ backgroundColor: '#fff', height: '100%', alignItems: 'center' }}>
        <Text style={[styles.introTextStyle, { marginRight: 0 }]}>
          Enter the 4-digit OTP sent to +91 {mobilenumber}
        </Text>
        <OTPInputView
          style={{ width: '80%', height: 100 }}
          pinCount={4}
          onCodeChanged={(code) => setOtp(code)}
          autoFocusOnLoad={false}
          codeInputFieldStyle={styles.underlineStyleBase}
          codeInputHighlightStyle={styles.underlineStyleHighLighted}
          onCodeFilled={(code) => {
            verify(code);
          }}
        />
        {error !== '' && (
          <HelperText type="error" visible={true} style={{ fontSize: 20 }}>
            {error} !
          </HelperText>
        )}
        <TouchableOpacity
          style={[styles.btnContainer, otp.length < 10 ? { backgroundColor: '#C0C0C0' } : { backgroundColor: '#08a29e' }]}
          onPress={() => showToast()}
        >
          <Text style={[styles.introTextStyle, { color: '#fff' }]}>Continue</Text>
        </TouchableOpacity>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  borderStyleBase: {
    width: 30,
    height: 45,
  },
  borderStyleHighLighted: {
    borderColor: '#03DAC6',
  },
  underlineStyleBase: {
    width: 40,
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 1,
    color: '#08a29e',
    borderColor: '#08a29e',
  },
  underlineStyleHighLighted: {
    borderColor: '#08a29e',
  },
  introTextStyle: {
    fontSize: 20,
    color: 'black',
    textAlign: 'center',
    paddingHorizontal: 20,
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
  error: {
    backgroundColor: '#cc0011',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default OtpScreen;
