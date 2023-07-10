import React, { useContext } from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Image,
  Text,
  Linking,
  Alert,
} from 'react-native';

import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../store/auth-store/auth-provider';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const CustomSidebarMenu: React.FC<any> = (props) => {
  const { user, setUser } = useContext(AuthContext);

  const onBackPress = () => {
    Alert.alert(
      'Logout',
      'Are you sure want to logout?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'Logout', onPress: () => logout() },
      ],
      { cancelable: false }
    );
    return true;
  };

  const logout = async () => {
    var a;
    try {
      a = await AsyncStorage.removeItem('token');
    } catch (e) {
      // remove error
    }
    if ((await AsyncStorage.getItem('token')) == null) {
      setUser('');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/*Top Large Image */}
      <Image
        source={require('../../theme/assets/images/logo.png')}
        style={styles.sideMenuProfileIcon}
      />
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <View style={{ flex: 1 }}>

          <DrawerItem
            icon={({ focused, color, size }) => (
              <MaterialCommunityIcons
                name="logout"
                color="#000"
                size={22}
              />
            )}
            labelStyle={{
              fontSize: 18,
              right: 20,
              color: '#000',
            }}
            label="Log out"
            onPress={onBackPress}
          />
        </View>
      </DrawerContentScrollView>
      {/* <Text
        style={{
          fontSize: 16,
          textAlign: 'center',
          color: 'grey'
        }}>
        www.schedula.in
      </Text> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sideMenuProfileIcon: {
    resizeMode: 'center',
    width: 100,
    height: 100,
    // borderRadius: 100 / 2,
    alignSelf: 'center',
  },
  iconStyle: {
    width: 15,
    height: 15,
    marginHorizontal: 5,
  },
  customItem: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default CustomSidebarMenu;
