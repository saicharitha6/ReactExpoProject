import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DoctorProfileDetails from './components/Doctor/doctorProfile';
import DoctorSearch from './components/Doctor/Doctor';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
       <Stack.Navigator initialRouteName="DoctorProfile">
        <Stack.Screen name="Doctor Search" component={DoctorSearch} options={{ headerShown: false }} />
        <Stack.Screen name="DoctorProfileDetails" component={DoctorProfileDetails} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
