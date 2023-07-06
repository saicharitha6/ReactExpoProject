import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from "@react-navigation/drawer";
import { HomeScreen,DoctorClinic,AppointmentScreen} from '../screens';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomSidebarMenu from '../components/constants/customside-menu';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const DrawerNavigator: React.FC = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        activeTintColor: '#e91e63',
        itemStyle: { marginVertical: 5 },
      }}
      drawerContent={props => <CustomSidebarMenu {...props} />}
    >
      <Drawer.Screen
        name="HomeDrawer"
        component={HomeScreen}
        options={{
          title: "Find your doctors",
          drawerLabel: "Home",
          drawerIcon: ({ tintColor }) => (
            <FontAwesome name="home" size={22} color='#000'/>
          ),
          drawerLabelStyle: {
            fontSize: 18,
            right: 20,
            color: '#000'
          }
        }}
      />
      <Drawer.Screen
        name="AppointmentScreen"
        component={AppointmentScreen}
        options={{
          title: "Appointments",
          drawerLabel: "My Appointments",
          drawerIcon: ({ tintColor }) => (
            <FontAwesome name="book" size={22} color='#000'/>
          ),
          drawerLabelStyle: {
            fontSize: 16,
            right: 20,
            color: '#000'
          }
        }}
      />
    </Drawer.Navigator>
  );
}

const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name == 'Home') {
            iconName = 'ios-home';
          } else if (route.name == 'Appointment') {
            iconName = 'ios-calendar';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarStyle: {
          backgroundColor: '#fff',
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#08a29e',
        tabBarItemStyle: {
          marginBottom: 6
        }
      })}
    >
      <Tab.Screen name='Home' component={DrawerNavigator} options={{ headerShown: false }} />
      <Tab.Screen name='Appointment' component={AppointmentStackNavigator} options={{ headerShown: false }} />
    </Tab.Navigator>
  )
}
const AppointmentStackNavigator: React.FC = () => {
  return (
      <Stack.Navigator
        screenOptions={{
          gestureEnabled: true,
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20,
          },
          headerStyle: {
            backgroundColor: '#08a29e'
          },
          headerTintColor: '#333333',
        }}
        initialRouteName="AppointmentScreen"
      >
        <Stack.Screen name="AppointmentScreen" component={AppointmentScreen} options={{ headerShown: false }} />
        <Stack.Screen name="DoctorClinic" component={DoctorClinic} options={{ title: "" }} />
      </Stack.Navigator>
  );
}
const MainStackNavigator: React.FC = () => {
  return (
      <Stack.Navigator
        screenOptions={{
          gestureEnabled: true,
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20,
          },
          headerStyle: {
            backgroundColor: '#08a29e'
          },
          headerTintColor: '#333333',
        }}
        initialRouteName="HomeScreen"
      >
        <Stack.Screen name="HomeScreen" component={MainTabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="DoctorClinic" component={DoctorClinic} options={{ title: "" }} />
      </Stack.Navigator>
  );
}

export default MainStackNavigator;
