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
import { url, newUrl } from '../services/api';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import { useFocusEffect } from '@react-navigation/native';
import { API_TOKEN } from '@env';
import crashlytics from '@react-native-firebase/crashlytics';
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';
interface Appointment {
  practitionerName: string;
  clinicName: string;
  date: string;
  reportingTime: string;
  status: string;
  consultationType: string;
  apptId: number;
  practitionerPartyId: number;
}

const AppointmentDetails: React.FC<any> = ({ navigation }) => {
  const [status, setStatus] = useState<string>('Confirmed');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<Appointment[]>([]);
  const [cancel, setCancel] = useState<Appointment[]>([]);
  const [past,setPast]=useState<Appointment[]>([]);
  // const [visible, setVisible] = useState(false);
  const [menuid, setMenuId] = useState(null)

  const hideMenu = () => setMenuId("");

  // const showMenu = () => setVisible(true);

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
          text: 'Cancel',
          onPress: () => setMenuId(""),
          style: 'cancel',
        },
        { text: 'Confirm Cancel', onPress: () => cancelAppointment(apptId) },
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
        const Past = response?.data?.data?.filter((val: Appointment) => {
          let date1 = val.date
          let date2 = new Date();
          date2.setUTCHours(0)
          date2.setUTCSeconds(0)
          date2.setUTCMinutes(0)
          date2.setUTCMilliseconds(0)
          let [day, month, year] = date1.split("-");
          let parsedDate1 = new Date(`${year}-${month}-${day}`);
          return parsedDate1<date2;
        });
        setPast(Past)
        const confirmed = response?.data?.data?.filter((val: Appointment) => {
          let date1 = val.date
          let date2 = new Date();
          date2.setUTCHours(0)
          date2.setUTCSeconds(0)
          date2.setUTCMinutes(0)
          date2.setUTCMilliseconds(0)
          let [day, month, year] = date1.split("-");
          let parsedDate1 = new Date(`${year}-${month}-${day}`);
          return   parsedDate1>=date2 && val?.status === 'Confirmed';
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
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.practitionerName}>Dr.{item.practitionerName}</Text>
            <Menu
              visible={item.apptId == menuid ? true : false}
              anchor={<FontAwesome onPress={() => setMenuId(item.apptId)} name="ellipsis-v" color='#000' size={22} />}
              onRequestClose={hideMenu}
              style={{ height: 50 }}
            >
              <MenuItem onPress={() => (onBackPress(item.apptId), hideMenu)} textStyle={{ fontSize: 15, color: '#000' }}>Cancel appointment</MenuItem>
            </Menu>
          </View>
          <Text style={styles.clinicName}>{item.clinicName}</Text>
          <View style={styles.infoRow}>
            <Text style={styles.dateText}>Appointment Date - </Text>
            <Text style={styles.dateText}>{item.date}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.dateText}>Reporting Time - </Text>
            <Text style={styles.reportingTimeText}>{item.reportingTime}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.dateText}>Appointment Status - </Text>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.dateText}>Appointment Type - </Text>
            <Text style={styles.statusText}>{item.consultationType == "Regular" ? "In Clinic Consultation" : "Online Consultation"}</Text>
          </View>
        </View>
      </View>
    );
  };
  const renderCancelItem = ({ item }: { item: Appointment }): JSX.Element => {
    return (
      <View style={styles.appointmentContainer}>
        <View style={styles.appointmentDetails}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.practitionerName}>Dr.{item.practitionerName}</Text>
            <Menu
              visible={item.apptId == menuid ? true : false}
              anchor={<FontAwesome onPress={() => setMenuId(item.apptId)} name="ellipsis-v" color='#000' size={22} />}
              onRequestClose={hideMenu}
              style={{ height: 50 }}
            >
              <MenuItem
                onPress={() =>
                (
                  setMenuId(""),
                  navigation.navigate('DoctorClinic', {
                    id: item.practitionerPartyId,
                  })
                )
                }
                textStyle={{ fontSize: 15, color: '#000' }}>Book Again</MenuItem>
            </Menu>
          </View>
          <Text style={styles.clinicName}>{item.clinicName}</Text>
          <View style={styles.infoRow}>
            <Text style={styles.dateText}>Appointment Date - </Text>
            <Text style={styles.dateText}>{item.date}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.dateText}>Reporting Time - </Text>
            <Text style={styles.reportingTimeText}>{item.reportingTime}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.dateText}>Appointment Status - </Text>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.dateText}>Appointment Type - </Text>
            <Text style={styles.statusText}>{item.consultationType == "Regular" ? "In Clinic Consultation" : "Online Consultation"}</Text>
          </View>
        </View>
      </View>
    );
  };

  const itemSeparator = (): JSX.Element => {
    return (
      <View style={styles.separator} />
    );
  };

  if (isLoading) {
    return (
      <View style={{ height: '100%', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size={'large'} color='#08a29e' />
      </View>
    );
  } else {
    return (
      <View style={{ height: '100%', backgroundColor: '#fff' }}>
        <View style={{ height: '8%', padding: 10 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#333333', left: 10 }}>My Appointments</Text>
        </View>
        <View style={{ height: '10%', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
          <View style={{ height: 50, width: "100%", backgroundColor: '#f5fafa', borderRadius: 5, borderWidth: 1, borderColor: '#cccbca', top: 0, justifyContent: 'space-around', alignItems: 'center', flexDirection: 'row' }}>
          <TouchableOpacity style={
              status == "Past" ?
                { height: 40, width: 100, backgroundColor: "#08a29e", justifyContent: 'center', alignItems: 'center', borderRadius: 5 }
                : { height: 40, width: 100, backgroundColor: '#f5fafa', justifyContent: 'center', alignItems: 'center', borderRadius: 5 }
            }
              onPress={() => { setStatus("Past") }}>
              <Text style={status == "Past" ? { fontSize: 15, color: "#fff" } : { fontSize: 15, color: "#000" }}>Past</Text>
            </TouchableOpacity>
            <TouchableOpacity style={
              status == "Confirmed" ?
                { height: 40, width: 100, backgroundColor: "#08a29e", justifyContent: 'center', alignItems: 'center', borderRadius: 5 }
                : { height: 40, width: 100, backgroundColor: '#f5fafa', justifyContent: 'center', alignItems: 'center', borderRadius: 5 }
            }
              onPress={() => { setStatus("Confirmed") }}>
              <Text style={status == "Confirmed" ? { fontSize: 15, color: "#fff" } : { fontSize: 15, color: "#000" }}>Confirmed</Text>
            </TouchableOpacity>
            <TouchableOpacity style={
              status == "Canceled" ?
                { height: 40, width: 100, backgroundColor: "#08a29e", justifyContent: 'center', alignItems: 'center', borderRadius: 5 }
                : { height: 40, width: 100, backgroundColor: '#f5fafa', justifyContent: 'center', alignItems: 'center', borderRadius: 5 }
            }
              onPress={() => { setStatus("Canceled") }}
            >
              <Text style={status == "Canceled" ? { fontSize: 15, color: "#fff" } : { fontSize: 15, color: "#000" }}>Cancelled</Text>
            </TouchableOpacity>
          </View>
        </View>
        {status == "Confirmed" &&
          <View style={{ height: '80%', alignItems: 'center',justifyContent:'center', top: 10 }}>
            {data.length>0 ? 
            <FlatList
              data={data}
              renderItem={renderItem}
              ItemSeparatorComponent={itemSeparator}
              showsVerticalScrollIndicator={false}
            />
            :
            <Text style={{color:'#000',fontSize:16}}>You don't have any confirmed appointments.</Text>
            }

          </View>
        }
        {status == "Canceled" &&
          <View style={{ height: '80%', alignItems: 'center',justifyContent:'center', top: 10 }}>
            {cancel.length>0 ?
            <FlatList
              data={cancel}
              renderItem={renderCancelItem}
              ItemSeparatorComponent={itemSeparator}
              showsVerticalScrollIndicator={false}
            />
            :
            <Text style={{color:'#000',fontSize:16}}>You don't have any cancelled appointments.</Text>
            }
          </View>
        }
          {status == "Past" &&
          <View style={{ height: '80%', alignItems: 'center',justifyContent:'center', top: 10 }}>
            {past.length>0 ? 
            <FlatList
              data={past}
              renderItem={renderCancelItem}
              ItemSeparatorComponent={itemSeparator}
              showsVerticalScrollIndicator={false}
            />
            :
            <Text style={{color:'#000',fontSize:16}}>You don't have any past appointments.</Text>
            }
          </View>
        }
      </View>
    )
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
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
    // height: 150,
    marginRight: 5,
    borderRadius: 5,
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
    padding: 10,
  },
  appointmentDetails: {
    // height: '100%',
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
    justifyContent: 'flex-start',
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
  icon: {
    left: 2
  }
});

export default AppointmentDetails;
