import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DoctorList from './component/doctorlist/doctorlist';
import DoctorProfile from './component/doctorlist/doctorProfile';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
       <Stack.Navigator initialRouteName="DoctorList">
        <Stack.Screen name="Doctor Search" component={DoctorList} options={{ headerShown: false }} />
        <Stack.Screen name="DoctorProfileDetails" component={DoctorProfile} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;