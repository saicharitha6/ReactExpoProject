import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, Pressable, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import moment from 'moment';
import { API_TOKEN } from "@env";
import crashlytics from '@react-native-firebase/crashlytics';
import { useToast } from "react-native-toast-notifications";
import axios from 'axios';

interface SlotScreenProps {
  route: any;
  navigation: any;
}

const SlotScreen: React.FC<SlotScreenProps> = ({ route, navigation }) => {
  const [datedata, setDateData] = useState<string[]>([]);
  const [ndatedata, setnDateData] = useState<string[]>([]);
  const [ntoday, setntoday] = useState<string>('');
  const [today, settoday] = useState<string>('');
  const [slots, setSlots] = useState<any[]>([]);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isloading, setIsLoading] = useState<boolean>(false);
  const [slotid, setSlotid] = useState<string>('');
  const [sessionid, setSessionId] = useState<string>('');
  const toast = useToast();

  useEffect(() => {
    var currentDate = new Date();
    var year = currentDate.getFullYear();
    var month = currentDate.getMonth() + 1;
    var day = currentDate.getDate();
    var hours = currentDate.getHours() > 12 ? currentDate.getHours() - 12 : currentDate.getHours();
    var am_pm = currentDate.getHours() >= 12 ? "PM" : "AM";
    hours = hours < 10 ? "0" + hours : hours;
    var minutes = currentDate.getMinutes() < 10 ? "0" + currentDate.getMinutes() : currentDate.getMinutes();
    setCurrentTime(hours + ':' + minutes + ':' + '00' + ' ' + am_pm);
    var formattedDate = day.toString().padStart(2, '0') + '-' + month.toString().padStart(2, '0') + '-' + year;
    setntoday(formattedDate);
    var oneDate = moment(formattedDate, 'DD-MM-YYYY');
    var monthname = oneDate.format('MMMM');
    var dayName = oneDate.format('dddd');
    var slotdate = dayName.slice(0, 3) + ', ' + day + ' ' + monthname.slice(0, 3);
    settoday(slotdate);
    fetchDateData();
  }, []);

  const fetchDateData = () => {
    var startDate = new Date();
    var today = new Date();
    var endDate = today.setDate(today.getDate() + 13);
    let datearray: string[] = [];
    let ndatearray: string[] = [];
    for (var currentDate = startDate; currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
      var year = currentDate.getFullYear();
      var month = currentDate.getMonth() + 1;
      var day = currentDate.getDate();
      var formattedDate = day.toString().padStart(2, '0') + '-' + month.toString().padStart(2, '0') + '-' + year;
      ndatearray.push(formattedDate);
      var oneDate = moment(formattedDate, 'DD-MM-YYYY');
      var monthname = oneDate.format('MMMM');
      var dayName = oneDate.format('dddd');
      var slotdate = dayName.slice(0, 3) + ', ' + day + ' ' + monthname.slice(0, 3);
      datearray.push(slotdate);
    }
    setDateData(datearray);
    setnDateData(ndatearray);
  };

  const fetchSlots = async (date: string) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${route.params.districtId}&date=${date}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': 'hi_IN',
          'User-Agent': 'Mozilla/5.0',
          'Authorization': `Bearer ${API_TOKEN}`
        }
      });
      setIsLoading(false);
      setSlots(response.data.sessions);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      crashlytics().log(error);
      crashlytics().recordError(error);
      toast.show("An error occurred while fetching slots. Please try again later.", {
        type: "danger",
      });
    }
  };

  const handleDateSelection = (date: string) => {
    const index = datedata.findIndex((item) => item === date);
    if (index !== -1) {
      setDateData((prevState) => {
        const updatedDates = [...prevState];
        updatedDates[index] = 'selected';
        return updatedDates;
      });
    }
    const nIndex = ndatedata.findIndex((item) => item === date);
    if (nIndex !== -1) {
      setnDateData((prevState) => {
        const updatedDates = [...prevState];
        updatedDates[nIndex] = 'selected';
        return updatedDates;
      });
    }
    fetchSlots(date);
  };

  const handleSlotSelection = (slot: any) => {
    setSlotid(slot.slot);
    setSessionId(slot.session_id);
    navigation.navigate('BookAppointment', {
      slotId: slot.slot,
      sessionId: slot.session_id,
      centerName: slot.name,
      centerAddress: slot.address,
      centerDistrict: route.params.districtName,
    });
  };

  const renderSlot = ({ item }: { item: any }) => {
    const slotTime = item.from.slice(0, 5) + ' - ' + item.to.slice(0, 5);
    return (
      <TouchableOpacity onPress={() => handleSlotSelection(item)}>
        <View style={styles.slotContainer}>
          <Text style={styles.slotTime}>{slotTime}</Text>
          <Text style={styles.slotAvailability}>Available Capacity: {item.available_capacity}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {isloading ? (
        <ActivityIndicator style={styles.loader} size="large" color="#0000ff" />
      ) : (
        <ScrollView>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>{route.params.districtName}</Text>
            <Text style={styles.subHeaderText}>{today}</Text>
          </View>
          <View style={styles.dateContainer}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={datedata}
              renderItem={({ item }) => (
                <Pressable onPress={() => handleDateSelection(item)}>
                  <View
                    style={[
                      styles.dateItem,
                      {
                        backgroundColor:
                          item === 'selected' ? '#007BFF' : '#fff',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.dateText,
                        {
                          color: item === 'selected' ? '#fff' : '#000',
                        },
                      ]}
                    >
                      {item}
                    </Text>
                  </View>
                </Pressable>
              )}
              keyExtractor={(item) => item}
            />
          </View>
          <View style={styles.slotsContainer}>
            {slots.map((slot) => (
              <View key={slot.session_id} style={styles.slotWrapper}>
                <Text style={styles.centerName}>{slot.name}</Text>
                <Text style={styles.centerAddress}>{slot.address}</Text>
                <FlatList
                  data={slot.slots}
                  renderItem={renderSlot}
                  keyExtractor={(item) => item.slot}
                />
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    marginBottom: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subHeaderText: {
    fontSize: 18,
    fontWeight: '600',
  },
  dateContainer: {
    marginBottom: 20,
  },
  dateItem: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
    marginRight: 10,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
  },
  slotsContainer: {
    marginBottom: 20,
  },
  slotWrapper: {
    marginBottom: 20,
  },
  centerName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  centerAddress: {
    fontSize: 14,
    marginBottom: 10,
  },
  slotContainer: {
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderRadius: 5,
  },
  slotTime: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  slotAvailability: {
    fontSize: 14,
  },
});

export default SlotScreen;
