import axios from 'axios';
import React, { useState, useEffect, useCallback } from 'react';
import { Searchbar } from 'react-native-paper';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Text,
  StyleSheet,
  View,
  TextInput,
  Image,
  Pressable,
  BackHandler,
} from 'react-native';
import { url } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import crashlytics from '@react-native-firebase/crashlytics';
import ForceUpdatePlayStore from '../components/constants/force-update';

interface Doctor {
  id: number;
  name: string;
  specialisation: string;
  consultingLocations:any;
  item: {
    id: number;
    name: string;
    specialisation: string;
    consultingLocations:any;
  };
}

const HomeScreen: React.FC<any> = ({ navigation }) => {
  const [data, setData] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [phone, setPhone] = useState<string>('');
  const [text, setText] = useState<string>('');
  const [arrayholder, setArrayHolder] = useState<Doctor[]>([]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        Alert.alert(
          'Exit App',
          'Do you want to exit?',
          [
            { text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
            { text: 'Yes', onPress: () => BackHandler.exitApp() },
          ],
          { cancelable: false }
        );
        return true;
      };
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => subscription.remove();
    }, [])
  );

  useEffect(() => {
    AsyncStorage.getItem('phoneNumber').then((value) => {
      setPhone(value);
    });

    axios
      .get(url + 'practitioners')
      .then((response) => {
        setData(response?.data?.data);
        setArrayHolder(response?.data?.data);
        setIsLoading(false);
      })
      .catch((error) => {
        crashlytics().recordError(error);
        alert(error.toString());
        setIsLoading(false);
      });
  }, []);

  const itemSeparator = () => {
    return <View style={styles.separator} />;
  };

  const renderData = ({ item }: { item: Doctor }) => {
    return (
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image style={styles.logo} source={require('../theme/assets/images/doctors.png')} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.row}>Dr. {item.name}</Text>
          <Text style={styles.row}>({item.specialisation})</Text>
          <Text style={styles.row}>{((item.consultingLocations[0].name).length > 15) ?
            (((item.consultingLocations[0].name).substring(0, 15 - 3)) + '...') :
            item.consultingLocations[0].name}
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <Pressable
            onPress={() =>
              navigation.navigate('DoctorClinic', {
                id: item.id,
              })
            }
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: pressed ? '#08a29e' : '#08a29e' },
            ]}
          >
            <Text style={styles.buttonText}>Visit Clinic</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  const renderFooter = () => {
    return isLoading ? (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    ) : null;
  };

  const searchData = (texts: string) => {
    const newData = arrayholder.filter((item) => {
      const itemData = item.name.toLowerCase();
      const textData = texts.toLowerCase();
      return itemData.indexOf(textData) > -1;
    });

    setData(newData);
    setText(texts);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#08a29e" />
      </View>
    );
  } else {
    return (
      <View style={{ height: '100%', backgroundColor: '#fff' }}>
        <ForceUpdatePlayStore />
        <Searchbar
          style={styles.searchbar}
          onChangeText={(text) => searchData(text)}
          value={text}
          underlineColorAndroid="transparent"
          placeholder="Search Your Doctor Here"
          placeholderTextColor="#fff"
        />
        {data.length !== 0 ? (
          <View style={styles.listContainer}>
            <FlatList
              numColumns={2}
              data={data}
              keyExtractor={(item, index) => index.toString()}
              ItemSeparatorComponent={itemSeparator}
              renderItem={renderData}
              ListFooterComponent={renderFooter}
              style={styles.list}
            />
          </View>
        ) : (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>No Doctor Found!</Text>
          </View>
        )}
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderColor: '#08a29e',
    width: 150,
    height: 225,
    margin: 12,
  },
  separator: {
    height: 2.5,
    width: '100%',
  },
  imageContainer: {
    height: '50%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: '70%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    top: 1,
  },
  textContainer: {
    height: '30%',
    top: 30,
  },
  buttonContainer: {
    height: '20%',
  },
  button: {
    backgroundColor: '#08a29e',
    borderRadius: 5,
    width: 110,
    height: 30,
    textAlign: 'center',
    justifyContent: 'center',
  },
  row: {
    fontSize: 13,
    fontWeight: 'bold',
    bottom: 30,
    color: '#7D0552',
    textAlign: 'center'
  },
  buttonText: {
    fontSize: 10,
    color: 'white',
    textAlign: 'center',
  },
  searchbar: {
    textAlign: 'center',
    width: '90%',
    marginLeft: '5%',
    marginTop: '3%',
    borderColor: '#009688',
    borderRadius: 8,
    backgroundColor: '#46C7C7',
  },
  listContainer: {
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  list: {
    marginTop: 10,
  },
  loader: {
    marginTop: 10,
    alignItems: 'center',
  },
  loadingContainer: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    top: 15,
  },
  noResultsText: {
    fontSize: 17,
    color: '#333333',
  },
});

export default HomeScreen;
