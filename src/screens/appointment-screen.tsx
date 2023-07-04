import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { url,newUrl } from '../services/api';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import { useFocusEffect } from '@react-navigation/native';
import { API_TOKEN } from '@env';
import crashlytics from '@react-native-firebase/crashlytics';

interface Appointment {
  practitionerName: string;
  clinicName: string;
  date: string;
  reportingTime: string;
  status: string;
  consultationType: string;
  apptId: number;
}

const AppointmentDetails: React.FC = () => {
  const [status, setStatus] = useState<string>('Confirmed');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<Appointment[]>([]);
  const [cancel, setCancel] = useState<Appointment[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  useEffect(() => {
    fetchData();
  }, [status]);

  const onBackPress = (apptId: number): boolean => {
    Alert.alert(
      'Cancel Appointment',
      'Are you sure want to cancel the appointment?',
      [
        {
          text: 'No',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'Yes', onPress: () => cancelAppointment(apptId) },
      ],
      { cancelable: false }
    );
    return true;
  };

  const cancelAppointment = async (apptNo: number): Promise<void> => {
    await AsyncStorage.getItem('phoneNumber').then((phoneNumber) => {
      setIsLoading(true);
      const url = newUrl + 'api/v1/appointment/+' + apptNo + '/cancel';
      const headers = {
        accept: 'application/json',
        'x-schedula-auth-token': API_TOKEN,
        'Content-Type': 'application/json',
      };
      fetch(url, {
        method: 'GET',
        headers: headers,
      })
        .then((response) => response.json())
        .then((data) => {
          setIsLoading(false);
          fetchData();
          if (data?.message) {
            Alert.alert(data?.message);
          }
          if (data?.error) {
            Alert.alert(data?.error);
          }
        })
        .catch((error) => {
          console.log('Error:', error);
          Alert.alert(error);
          setIsLoading(false);
        });
    });
  };

  const fetchData = async (): Promise<void> => {
    setIsLoading(true);
    const token = await AsyncStorage.getItem('token');
    await axios
      .get(url + 'user/appointments', {
        headers: {
          Authorization: ' Bearer ' + token,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Toceken: tocken,
        }),
      })
      .then((response) => {
        const confirmed = response?.data?.data?.filter((val: Appointment) => {
          return val?.status === 'Confirmed';
        });
        setData(confirmed);
        const cancel = response?.data?.data?.filter((val: Appointment) => {
          return val?.status === 'Cancelled';
        });
        setCancel(cancel);
        setIsLoading(false);
        // alert(response)
      })
      .catch((error) => {
        crashlytics().recordError(error);
        alert(error.toString());
        setIsLoading(false);
      });
  };

  const renderItem = ({ item }: { item: Appointment }): JSX.Element => {
    return (
      <View style={styles.appointmentContainer}>
        <View style={styles.appointmentDetails}>
          <Text style={styles.practitionerName}>Dr.{item.practitionerName}</Text>
          <Text style={styles.clinicName}>{item.clinicName}</Text>
          <View style={styles.infoRow}>
            <FontAwesome name="calendar" color="#333333" size={18} />
            <Text style={styles.dateText}>{item.date}</Text>
            <FontAwesome name="clock" color="#333333" size={18} style={styles.icon} />
            <Text style={styles.reportingTimeText}>{item.reportingTime}</Text>
            <FontAwesome name="check" color="#333333" size={18} style={styles.icon} />
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
          <Text style={styles.consultationTypeText}>Type- {item.consultationType}</Text>
        </View>
        <View style={styles.cancelButtonContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => onBackPress(item.apptId)}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderCancelItem = ({ item }: { item: Appointment }): JSX.Element => {
    return (
      <View style={styles.appointmentContainer}>
        <View style={styles.appointmentDetails}>
          <Text style={styles.practitionerName}>Dr.{item.practitionerName}</Text>
          <Text style={styles.clinicName}>{item.clinicName}</Text>
          <View style={styles.infoRow}>
            <FontAwesome name="calendar" color="#333333" size={18} />
            <Text style={styles.dateText}>{item.date}</Text>
            <FontAwesome name="clock" color="#333333" size={18} style={styles.icon} />
            <Text style={styles.reportingTimeText}>{item.reportingTime}</Text>
            <FontAwesome name="times" color="#333333" size={18} style={styles.icon} />
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
          <Text style={styles.consultationTypeText}>Type- {item.consultationType}</Text>
        </View>
      </View>
    );
  };

  const itemSeparator = (): JSX.Element => {
    return (
      <View style={styles.separator} />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* Header content */}
      </View>
      {isLoading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <View style={styles.body}>
          <TouchableOpacity
            style={[
              styles.tabs,
              status === 'Confirmed' ? styles.activeTab : null,
            ]}
            onPress={(): void => setStatus('Confirmed')}
          >
            <Text style={styles.tabText}>Confirmed</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabs,
              status === 'Cancelled' ? styles.activeTab : null,
            ]}
            onPress={(): void => setStatus('Cancelled')}
          >
            <Text style={styles.tabText}>Cancelled</Text>
          </TouchableOpacity>
          {status === 'Confirmed' ? (
            <FlatList
              data={data}
              renderItem={renderItem}
              keyExtractor={(item) => item.apptId.toString()}
              ItemSeparatorComponent={itemSeparator}
            />
          ) : (
            <FlatList
              data={cancel}
              renderItem={renderCancelItem}
              keyExtractor={(item) => item.apptId.toString()}
              ItemSeparatorComponent={itemSeparator}
            />
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    // Header styles
  },
  body: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
  },
  tabs: {
    // Tab styles
  },
  activeTab: {
    // Active tab styles
  },
  tabText: {
    // Tab text styles
  },
  appointmentContainer: {
    backgroundColor: '#fff',
    borderColor: '#08a29e',
    borderWidth: 1,
    width: 320,
    height: 150,
    marginRight: 5,
    borderRadius: 5,
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
    padding: 10,
  },
  appointmentDetails: {
    height: '70%',
  },
  practitionerName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333333',
  },
  clinicName: {
    fontSize: 15,
    color: '#333333',
  },
  infoRow: {
    flexDirection: 'row',
    top: 5,
    justifyContent: 'space-around',
  },
  dateText: {
    fontSize: 15,
    color: '#333333',
    left: 2,
  },
  reportingTimeText: {
    fontSize: 15,
    color: '#333333',
    left: 2,
  },
  statusText: {
    fontSize: 15,
    color: '#333333',
    left: 2,
  },
  consultationTypeText: {
    fontSize: 15,
    color: '#333333',
    top: 5,
  },
  cancelButtonContainer: {
    height: '30%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    height: 40,
    width: 130,
    backgroundColor: '#08a29e',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  cancelButtonText: {
    fontSize: 18,
    color: '#fff',
  },
  separator: {
    height: 1.5,
    marginBottom: 12,
    width: '100%',
    // backgroundColor: '#f2d184',
  },
  icon:{
    left:2
  }
});

export default AppointmentDetails;
