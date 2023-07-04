/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { useContext, useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, StyleSheet, Image } from 'react-native';
// import MainStackNavigator from './MainStackNavigator';
// import AuthStackNavigator from './AuthStackNavigator';
// import { AuthProvider, AuthContext } from '../Services/AuthProvider';
import { AuthNavigator } from './auth-navigator';
import MainStackNavigator from './main-navigator';
import { AuthContext} from '../store/auth-store/auth-provider';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Routes() {
  const { user, setUser } = useContext(AuthContext);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [token, setToken] = useState<string>('');

  useEffect(() => {
    AsyncStorage.getItem('token').then((val) => {
      setToken(val || '');
    });
    setTimeout(() => {
      setIsVisible(false);
    }, 1000);
  }, []);


  return (
    <View style={styles.MainContainer}>
      {isVisible === true ? (
        <View style={{ backgroundColor: '#08a29e', alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
          <Image
            source={require('../theme/assets/images/logo.png')}
            resizeMode="contain"
            style={{
              width: '90%',
              height: '100%',
            }}
          />
        </View>
      ) : (
        <NavigationContainer>
                    { token || user  ? <MainStackNavigator /> : <AuthNavigator />}
        </NavigationContainer>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
