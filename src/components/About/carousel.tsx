/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Image,
} from 'react-native';

import AppIntroSlider from 'react-native-app-intro-slider';
interface Slide {
  backgroundColor: string;
  image: any;
  title: string;
  text: string;
}
const slides: Slide[] =  [
    {
      key: 's1',
      title: 'IVR Preferred Scheduling',
      text: 'Patients can choose their preferred time slot with IVR preferred scheduling and through Android APP.',
      image: require('../../theme/assets/images/carousel1.png'),
      backgroundColor: '#08a29e',
    },
   {
      key: 's2',
      title: 'Appointment Tracking',
      text: 'Patients can know their appointment status with live appointment tracking feature.',
      image: require('../../theme/assets/images/carousel2.png'),
      backgroundColor: '#08a29e',
    },
    {
      key: 's3',
      text: 'Doctors can know their schedule better with pre-booked appointments. ',
      title: 'Pre-booked Appointments',
      image: require('../../theme/assets/images/carousel3.png'),
      backgroundColor: '#08a29e',
    },
    {
      key: 's4',
      title: 'Future Day Appointments',
      text: ' Doctors can schedule follow-up appointments for patients with future day appointments.',
      image: require('../../theme/assets/images/carousel4.png'),
      backgroundColor: '#08a29e',
    },
  ];

const Carousel: React.FC = () => {
  const RenderItem: React.FC<{ item: Slide }> = ({ item }) => {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: item.backgroundColor,
          alignItems: 'center',
          justifyContent: 'space-around',
          paddingBottom: 100,
        }}
      >
        <Image
          style={{ alignSelf: 'center', width: '60%', height: 53, top: 10 }}
          source={require('../../theme/assets/images/logo.png')}
        />
        <Image style={styles.introImageStyle} source={item.image} />
        <Text style={styles.titleStyle}>{item.title}</Text>
        <Text style={styles.introTextStyle}>{item.text}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeareacontainer}>
      <AppIntroSlider
        data={slides}
        renderItem={RenderItem}
        showSkipButton={true}
        showNextButton={false}
      />
    </SafeAreaView>
  );
};

export default Carousel;

const styles = StyleSheet.create({
  safeareacontainer: {
    flex: 1,
    backgroundColor: '#08a29e',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 10,
    justifyContent: 'center',
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
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  introTitleStyle: {
    fontSize: 25,
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
