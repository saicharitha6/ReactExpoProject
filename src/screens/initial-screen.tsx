/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import React from 'react';
import Carousel from '../components/About/carousel';

const InitialScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={{ height: '70%' }}>
        <Carousel />
      </View>
      <View style={{ height: '30%' }}>
        <View style={{ marginTop: 30, alignItems: 'center' }}>
          <Text style={styles.introTextStyle}>Let's get started! Enter your mobile number</Text>
          <TouchableOpacity
            style={{
              width: '80%',
              backgroundColor: '#fff',
              padding: 15,
              marginTop: 10,
              borderRadius: 15,
              color: '#000',
              borderColor: 'black',
              borderWidth: 1,
              height: 60,
              justifyContent: 'center',
              alignItems: 'flex-start',
            }}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.introTextStyle}>+91 | Mobile Number</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    height: '100%',
  },
  titleStyle: {
    padding: 10,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  paragraphStyle: {
    padding: 20,
    textAlign: 'center',
    fontSize: 16,
  },
  introImageStyle: {
    width: 200,
    height: 200,
  },
  introTextStyle: {
    fontSize: 18,
    color: 'black',
    textAlign: 'center',
  },
  introTitleStyle: {
    fontSize: 25,
    color: 'white',
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: 'bold',
  },
});

export default InitialScreen;
