/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { Login,InitialScreen ,OtpScreen} from '../screens';

export type AuthStackParamList = {
  Login: undefined;
  InitialScreen: undefined;
  OtpScreen: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();
export const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        gestureEnabled: true,
       headerShadowVisible:false,
        headerTintColor: 'grey',
      }}>
      <Stack.Screen name="InitialScreen" component={InitialScreen} options={{headerShown:false}}/>
      <Stack.Screen name="Login" component={Login} options={{title:""}}/>
      <Stack.Screen name="OtpScreen" component={OtpScreen} options={{title:""}}/>
    </Stack.Navigator>
);
};
