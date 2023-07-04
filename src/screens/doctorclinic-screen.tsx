import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, Pressable, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { url, newUrl } from '../services/api';
import axios from 'axios';
import moment from 'moment';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import crashlytics from '@react-native-firebase/crashlytics';
import DropDownPicker from 'react-native-dropdown-picker';
import { List } from 'react-native-paper';
import { useToast } from "react-native-toast-notifications";
import { API_TOKEN } from "@env"
import AsyncStorage from '@react-native-async-storage/async-storage';
import VideoSlot from './online-slot-screen';

interface SessionData {
  type: string;
}

interface Location {
  name: string;
  address: string;
  id: string;
  authAssignmentId: string;
  sessions: SessionData[];
}

const DoctorClinic = ({ navigation, route }: { navigation: any; route: any }) => {
  let listViewRef;
  const [docdata, setDocdata] = useState<any[]>([]);
  const [isloading, setIsLoading] = useState<boolean>(false);
  const [visit, setVisit] = useState<string>("Clinic Visit");
  const [isonline, setIsonline] = useState<boolean>(false);
  const [onlinesession, setOnlineSession] = useState<SessionData[] | null>(null);
  const [offlinesession, setOfflineSession] = useState<SessionData[]>([]);
  const [location, setLocation] = useState<any[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState(null);

  const [datedata, setDateData] = useState<any[]>([]);
  const [ndatedata, setnDateData] = useState<any[]>([]);
  const [ntoday, setntoday] = useState<any[]>([]);
  const [today, settoday] = useState<any[]>([]);
  const [slots, setSlots] = useState<any[]>([]);
  const [currentTime, setCurrentTime] = useState<string>('')
  const [slotid, setSlotid] = useState<string>('')
  const [sessionid, setSessionId] = useState<string>('')
  const toast = useToast();
  useEffect(() => {
    fetchData();
  }, [])
  useEffect(() => {
    if (value) {
      fetchDateData();
    }
    if (ntoday.length > 0) {
      fetchSlotData()
      timeChecker()
      setSlotid("")
    }

  }, [value, ntoday]);

  const fetchDateData = () => {
    var startDate = new Date();
    var today = new Date();
    var endDate = today.setDate(today.getDate() + 13);
    let datearray = []
    let ndatearray = []
    for (var currentDate = startDate; currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
      var year = currentDate.getFullYear();
      var month = currentDate.getMonth() + 1;
      var day = currentDate.getDate();
      var formattedDate = day.toString().padStart(2, '0') + '-' + month.toString().padStart(2, '0') + '-' + year;
      ndatearray.push(formattedDate)
      var oneDate = moment(formattedDate, 'DD-MM-YYYY');
      var monthname = oneDate.format('MMMM')
      var dayName = oneDate.format('dddd');
      var slotdate = dayName.slice(0, 3) + ', ' + day + ' ' + monthname.slice(0, 3)
      datearray.push(slotdate)
    }
    setnDateData(ndatearray)
    setDateData(datearray)
  }
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(url + 'practitioner/' + route?.params?.id + '/sessions');
      setDocdata(response.data.data);
      let dropDownData = [];
      const online = response.data.data.consultantLocations?.map((val: Location) => {
        dropDownData.push({ value: val?.authAssignmentId, label: val?.name + ',' + val?.address });
        return val.sessions?.filter(value => value?.type === "Online Consultation");
      });
      setLocation(dropDownData)

      const offline = response.data.data.consultantLocations[0]?.sessions?.filter((val: SessionData) => {
        return val?.type !== "Online Consultation";
      });

      online?.map((val: SessionData[]) => {
        if (val.length > 0) {
          setOnlineSession(val);
          setIsonline(true);
        }
      });

      setOfflineSession(offline);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      crashlytics().recordError(error);
      alert(error.toString());
    }
  };
  const fetchSlotData = async () => {
    setIsLoading(true)
    const slotdate = ntoday;
    if (slotdate) {
      await axios
        .get(
          url + 'auth-assignment-slots' + '/' + value + '/' + slotdate,
          {
            headers: {
              // Authorization: ' Bearer ' + token,
              Accept: 'application/json',
              'Content-Type': 'application/json',

            },
            body: JSON.stringify({
              // Toceken:token,
            }),
          },
        )
        .then((response) => {

          setSlots(response.data.data)
          setIsLoading(false)
          //alert(response)
        })
        .catch((error) => {
          crashlytics().recordError(error)
          alert(error.toString());
          setIsLoading(false)
        });
    }
  }
  const timeChecker = () => {
    var currentDate = new Date();
    var year = currentDate.getFullYear();
    var month = currentDate.getMonth() + 1;
    var day = currentDate.getDate();
    var hours = currentDate.getHours() > 12 ? currentDate.getHours() - 12 : currentDate.getHours();
    var am_pm = currentDate.getHours() >= 12 ? "PM" : "AM";
    hours = hours < 10 ? "0" + hours : hours;
    var minutes = currentDate.getMinutes() < 10 ? "0" + currentDate.getMinutes() : currentDate.getMinutes();
    var formattedDate = day.toString().padStart(2, '0') + '-' + month.toString().padStart(2, '0') + '-' + year;
    if (formattedDate == ntoday) {
      setCurrentTime(hours + ':' + minutes + ':' + '00' + ' ' + am_pm)
    } else {
      setCurrentTime('00:00:00 am')
    }
  }
  const renderDateItem = (item) => {
    return (
      <View style={{ height: 50, width: 150, justifyContent: 'center', alignItems: 'center' }}>
        <TouchableOpacity
          onPress={() => (
            settoday(item.item),
            setntoday(ndatedata[item.index])
          )}
          style={
            item.item == today ?
              { height: 50, width: 130, backgroundColor: '#e1fcfc', borderWidth: 1, borderColor: '#08a29e', justifyContent: 'center', alignItems: 'center', borderRadius: 5 }
              : { height: 50, width: 130, backgroundColor: '#fff', borderWidth: 1, borderColor: '#08a29e', justifyContent: 'center', alignItems: 'center', borderRadius: 5 }
          }
        >
          <Text style={{ fontSize: 17, color: '#333333', fontWeight: 'bold' }}>{item.item}</Text>
        </TouchableOpacity>
      </View>
    )

  }
  const showToast = (message) => {
    // toast.show("Hello World");
    toast.show(message, {
      type: "normal",
      placement: "center",
      duration: 5000,
      offset: 30,
      animationType: "slide-in",
      successColor: "#03AC13",
      swipeEnabled: true,
      normalColor: "#F1F7F7",
      textStyle: { fontSize: 18, color: '#424242' }
    });
  }
  const futuredaybooking = async () => {
    var originalDate = ntoday;
    var dateComponents = originalDate.split('-');
    var rearrangedDate = dateComponents[2] + '-' + dateComponents[1] + '-' + dateComponents[0];
    const tocken = AsyncStorage.getItem('token')
    await AsyncStorage.getItem('phoneNumber').then((phoneNumber) => {

      if (slotid) {
        setIsLoading(true)
        const url = newUrl + 'api/v1/appointment/make';
        const headers = {
          'accept': 'application/json',
          'x-schedula-auth-token': API_TOKEN,
          'Content-Type': 'application/json'
        };

        const data = {
          "sessionId": sessionid,
          "phoneNumber": phoneNumber,
          "appointmentDate": rearrangedDate,
          "requestMode": "MobileApp",
          "slotId": slotid
        }
        fetch(url, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(data)
        })
          .then(response => response.json())
          .then(data => {
            setIsLoading(false)
            // alert(data.message);
            showToast(data.message)
          })
          .catch(error => {
            alert(error.message);
            setIsLoading(false)
          });
      } else {
        alert("Please select slot time.");
      }
    })
  }
  const downButtonHandler = () => {
    listViewRef?.scrollToEnd({ animated: true });
  };
  if (isloading) {
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center', height: '100%', backgroundColor: '#fff' }}>
        <ActivityIndicator color='#08a29e' size={40} />
      </View>
    )
  } else {
    return (
      <ScrollView ref={(ref) => {
        listViewRef = ref;
      }} style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={{ justifyContent: 'center', alignItems: 'center', height: 130 }}>
          <View
            style={{
              height: 100,
              width: '90%',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignContent: 'flex-start',
            }}
          >
            <View style={{ flex: 0.4 }}>
              <Image
                style={{
                  width: '70%',
                  height: 100,
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignSelf: 'center',
                }}
                source={require('../theme/assets/images/doctors.png')}
              />
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'flex-start', flex: 0.6 }}>
              <Text style={styles.titleStyle}>Dr.{docdata.name}</Text>
              <Text style={styles.introTextStyle}>({docdata?.specialization && docdata?.specialization[0]?.name})</Text>
            </View>

          </View>
        </View>
        <View style={{ backgroundColor: '#ebf0ec', width: '100%', height: 5 }} />
        <View style={styles.optionSelectionContainer}>
          <View style={styles.optionSelection}>
            <TouchableOpacity
              style={
                visit === "Clinic Visit"
                  ? { height: 40, width: 93, backgroundColor: "white", justifyContent: 'center', alignItems: 'center', borderRadius: 5, borderWidth: 1, borderColor: "#089ea2" }
                  : { height: 40, width: 93, backgroundColor: '#f5fafa', justifyContent: 'center', alignItems: 'center', borderRadius: 5 }
              }
              onPress={() => { setVisit("Clinic Visit") }}
            >
              <Text style={{ fontSize: 15, color: "#000" }}>Clinic Visit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={
                visit === "Online"
                  ? { height: 40, width: 93, backgroundColor: "white", justifyContent: 'center', alignItems: 'center', borderRadius: 5, borderWidth: 1, borderColor: "#089ea2" }
                  : { height: 40, width: 93, backgroundColor: '#f5fafa', justifyContent: 'center', alignItems: 'center', borderRadius: 5 }
              }
              onPress={() => { setVisit("Online") }}
            >
              <Text style={{ fontSize: 15, color: "#000" }}>Online Consult</Text>
            </TouchableOpacity>
          </View>
        </View>
        {visit == "Clinic Visit" ?
          <View style={{ padding: 10, height: 700}}>
            <View style={{ height: 60, zIndex: 9999 }}>
              <DropDownPicker
                placeholder='Select the clinic location'
                open={open}
                value={value}
                items={location}
                setOpen={setOpen}
                setValue={setValue}
                listChildContainerStyle={{
                  padding: 20,
                  backgroundColor: 'red'
                }}
                containerStyle={{
                  // backgroundColor:'red',
                  zIndex: 9999,
                }}
              />
            </View>
            {datedata.length != 0 &&
              <View style={{ height: 160 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                  <FontAwesome name="calendar-alt" color='#000' size={22} />
                  <Text style={{ fontSize: 15, color: '#000', left: 10 }}>
                    Select the appointment date.
                  </Text>
                </View>
                <View style={{ backgroundColor: '#f5fafa', height: 80, width: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', top: 10 }}>
                  <FlatList
                    data={datedata}
                    renderItem={renderDateItem}
                    horizontal
                  />
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center', height: 50 }}>
                  <Text style={{ fontSize: 20, color: '#333333', fontWeight: 'bold' }}>{today}</Text>
                </View>
                <View style={{ backgroundColor: '#ebf0ec', width: '100%', height: 5 }} />
              </View>
            }
            <View style={{ height: 400 }}>
              
              {ntoday.length > 0 ?
                slots.length != 0 ?
                  <View style={{ height: '90%' }}>
                    {
                      slots.map((val) => {
                        return (
                          val.type != "Online Consultation" &&
                          <View style={{ padding: 10 }}>
                            <Text style={{ fontSize: 17, color: '#333333'}}>{val.type}</Text>
                            <FlatList
                              data={val?.slots}
                              // renderItem={renderSlot}
                              renderItem={({ item }) => {
                                if (slotid == item.id) {
                                  return (

                                    <View
                                      style={moment(currentTime, 'hh:mm A').format('HH:mm') >= moment(item.from, 'hh:mm A').format('HH:mm') && moment(currentTime, 'hh:mm A').format('HH:mm') >= moment(item.to, 'hh:mm A').format('HH:mm') ? {
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderWidth: 3,
                                        backgroundColor: '#3EA99F',
                                        borderRadius: 10,
                                        borderColor: '#fff',
                                        width: 100,
                                        height: 40,
                                        top: 5,
                                        padding: 3,
                                        margin: 3,

                                      } : {
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderWidth: 1,
                                        backgroundColor: '#08a29e',
                                        borderColor: '#08a29e',
                                        borderRadius: 5,
                                        width: 100,
                                        height: 40,
                                        // top: 5,
                                        padding: 3,
                                        margin: 3,
                                      }}>
                                      <Pressable disabled={moment(currentTime, 'hh:mm A').format('HH:mm') >= moment(item.from, 'hh:mm A').format('HH:mm') && moment(currentTime, 'hh:mm A').format('HH:mm') >= moment(item.to, 'hh:mm A').format('hh:mm A') ? true : false} onPress={() => (setSlotid(""), setSessionId(val?.id),downButtonHandler())}>
                                        <Text style={{ fontWeight: 'bold', fontSize: 10, textAlign: 'center', justifyContent: 'center', color: 'white' }}>
                                          {moment(item.from, 'h:mm a').format('h:mm a')} - {moment(item.to, 'h:mm a').format('h:mm a')}
                                        </Text>
                                      </Pressable>
                                    </View>

                                  );
                                } else {
                                  return (
                                    <View
                                      style={moment(currentTime, 'hh:mm A').format('HH:mm') >= moment(item.from, 'hh:mm A').format('HH:mm') && moment(currentTime, 'hh:mm A').format('HH:mm') >= moment(item.to, 'hh:mm A').format('HH:mm') ? {
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderWidth: 1,
                                        backgroundColor: '#f5fafa',
                                        borderColor: '#f5fafa',
                                        borderRadius: 5,
                                        width: 100,
                                        height: 40,
                                        // top: 5,
                                        padding: 3,
                                        margin: 3,
                                      } : {
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderWidth: 1,
                                        backgroundColor: '#fff',
                                        borderColor: '#08a29e',
                                        borderRadius: 5,
                                        width: 100,
                                        height: 40,
                                        // top: 5,
                                        padding: 3,
                                        margin: 3,
                                      }}>
                                      <Pressable
                                        disabled=
                                        {
                                          moment(currentTime, 'hh:mm A').format('HH:mm')
                                            >= moment(item.from, 'hh:mm A').format('HH:mm')
                                            && moment(currentTime, 'hh:mm A').format('HH:mm')
                                            >= moment(item.to, 'hh:mm A').format('HH:mm')
                                            ? true :
                                            false
                                        }

                                        onPress={() => (setSlotid(item.id), setSessionId(val?.id),downButtonHandler())}
                                      >
                                        <Text style={{ fontWeight: 'bold', fontSize: 10, textAlign: 'center', justifyContent: 'center', color: 'black' }}>
                                          {/* {item.from} -  {item.to}a */}
                                          {moment(item.from, 'h:mm a').format('h:mm a')} - {moment(item.to, 'h:mm a').format('h:mm a')}
                                        </Text>
                                      </Pressable>
                                    </View>

                                  );

                                }
                              }}
                              numColumns={3}
                            />

                          </View>
                        )
                      })
                    }
                  </View>
                  :
                  <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 17, color: '#333333' }}>No Slots Available</Text>
                  </View>
                : null
              }

            </View>
          {ntoday.length >0 &&  
        <View style={{ height: 30, justifyContent: 'center', alignItems: 'center'}}>
          <TouchableOpacity style={
            slotid ?
              { height: 40, width: 200, backgroundColor: "#08a29e", justifyContent: 'center', alignItems: 'center', borderRadius: 5 }
              : { height: 40, width: 200, backgroundColor: '#BDEDFF', justifyContent: 'center', alignItems: 'center', borderRadius: 5 }

          }
            onPress={() => slotid ? futuredaybooking() : null}
          >
            <Text style={
              { fontSize: 18, color: "#fff" }}>Book Appointment</Text>
          </TouchableOpacity>
        </View>
  }
          </View>
          : 
          visit == "Online" ?
          <View style={{ padding: 10, height: 500}}>
             <VideoSlot sessiondata={onlinesession}/>
          </View>
          : null}
       
      </ScrollView>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  itemContainer: {
    backgroundColor: '#fff',
    borderColor: '#cccbca',
    borderWidth: 1,
    width: '95%',
    height: 190,
    marginRight: 5,
    borderRadius: 5,
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
    marginLeft: 10,
    marginTop: 10
  },
  itemHeader: {
    backgroundColor: '#e1fcfc',
    height: 55,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  iconStyle: {
    marginRight: 10,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  clinicInfo: {
    height: 70
  },
  clinicName: {
    fontSize: 20,
    color: '#333333',
    top: 10,
    marginLeft: 15
  },
  titleStyle: {
    // paddingTop: 10,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    fontStyle: 'italic',
    marginLeft: 10
  },
  introTextStyle: {
    fontSize: 15,
    color: '#333333',
    marginLeft: 10,
    fontStyle: 'italic'
  },
  clinicAddress: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 15,
    top: 10,
    color: '#333333'
  },
  viewButtonContainer: {
    height: 20,
    top: 28,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  onlineContainer: {
    backgroundColor: '#fff',
    borderColor: '#cccbca',
    borderWidth: 1,
    width: '95%',
    height: 190,
    marginRight: 5,
    borderRadius: 5,
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
    marginLeft: 10,
    marginTop: 10
  },
  onlineHeader: {
    backgroundColor: '#f7d7f7',
    height: 55,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  optionSelectionContainer: {
    // padding: 10,
    height: 65,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  optionSelection: {
    height: 50,
    width: 200,
    backgroundColor: '#f5fafa',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#cccbca',
    // top: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  }
});

export default DoctorClinic;
