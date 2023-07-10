import { StyleSheet, Text, View, Image, ActivityIndicator, Pressable, FlatList, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { url } from '../services/api';
import axios from 'axios'
import moment from 'moment';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import crashlytics from '@react-native-firebase/crashlytics';
import { useToast } from "react-native-toast-notifications";
const VideoSlot = (props) => {
  const [datedata, setDateData] = useState<any[]>([]);
  const [ndatedata, setnDateData] = useState<any[]>([]);
  const [ntoday, setntoday] = useState<string>('')
  const [today, settoday] = useState<string>('')
  const [slots, setSlots] = useState(props?.sessiondata)
  const [currentTime, setCurrentTime] = useState<string>('')
  const [isloading, setIsLoading] = useState(false)
  const [slotid, setSlotid] = useState<string>('')
  const [sessionid, setSessionId] = useState<string>('')
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
    setCurrentTime(hours + ':' + minutes + ':' + '00' + ' ' + am_pm)
    var formattedDate = day.toString().padStart(2, '0') + '-' + month.toString().padStart(2, '0') + '-' + year;
    setntoday(formattedDate)
    var oneDate = moment(formattedDate, 'DD-MM-YYYY');
    var monthname = oneDate.format('MMMM')
    var dayName = oneDate.format('dddd');
    var slotdate = dayName.slice(0, 3) + ', ' + day + ' ' + monthname.slice(0, 3)
    settoday(slotdate)
    fetchDateData()
  }, [])
  const fetchDateData = () => {
    var currentDate = new Date();
    var today = new Date();
    var endDate = today.setDate(today.getDate() + 13);
    let datearray = []
    let ndatearray = []
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
    setnDateData(ndatearray)
    setDateData(datearray)
  }
  const renderItem = (item) => {
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

  useEffect(() => {
    // fetchSlotData()
    timeChecker()
    setSlotid("")
  }, [ntoday])

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
      normalColor: "#fff",
      textStyle: { fontSize: 18, color: '#424242' },
      style:{borderWidth:1,borderColor:'#000'}
    });
  }
 
  const  booking=async()=> {
    if(slotid){
    const phoneNumber = await AsyncStorage.getItem('phoneNumber')
    setIsLoading(true)
    await axios
      .post(
        url+'appointment/create',
        {
          slotId: slotid,
          phone: phoneNumber
        },
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            slotId: slotid,

          }),
        },
      )
      .then((response) => {
        setIsLoading(false)
        if(response.data.message){
        alert(response.data.message);
        }else{
          setIsLoading(false)
          showToast("Booking closed today,try tomorrow");
        }

      })
      .catch((error) => {
        crashlytics().recordError(error)
        setIsLoading(false)
        showToast(error.toString());
      });
   
  }else{
    showToast("Kindly choose a time slot for your appointment.")
  }
  }
  if (isloading) {
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center', height: '100%', backgroundColor: '#fff' }}>
        <ActivityIndicator color='#08a29e' size={40} />
      </View>
    )
  } else {
    return (
      <View style={{ height: '100%', backgroundColor: '#fff' }}>   
        <View style={{ height: '10%' }}>
          <View style={{ backgroundColor: '#f5fafa', height: 70, width: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', top: 10 }}>
            <FlatList
              data={datedata}
              renderItem={renderItem}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
        </View>
        <View style={{ height: '10%' }}>
          <View style={{ justifyContent: 'center', alignItems: 'center', top: 35 }}>
            <Text style={{ fontSize: 20, color: '#333333', fontWeight: 'bold' }}>{today}</Text>
          </View>
          <View
            style={{
              borderBottomColor: '#cccbca',
              top: 35,
              borderBottomWidth: StyleSheet.hairlineWidth,
            }}
          />
        </View>
        <ScrollView style={{ height: '35%' ,top:15}}>
          {slots.length != 0 ?
            <View style={{ height: '100%' }}>
              {
                slots.map((val) => {
                  return (
                    <View style={{ padding: 10 }}>
                      <Text style={{ fontSize: 20, color: '#333333', left: 10 }}>{val.type}</Text>
                      <FlatList
                        data={val?.slots}
                        // renderItem={renderSlot}
                        renderItem={({ item }) => {
                          if (slotid == item.id) {
                            return (
                              
                                <View colors={['#f4c4f3', '#fc67fa',]}
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
                                  <Pressable disabled={moment(currentTime, 'hh:mm A').format('HH:mm') >= moment(item.from, 'hh:mm A').format('HH:mm') && moment(currentTime, 'hh:mm A').format('HH:mm') >= moment(item.to, 'hh:mm A').format('hh:mm A') ? true : false} onPress={() => (setSlotid(""), setSessionId(val?.id))}>
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

                                    onPress={() => (setSlotid(item.id), setSessionId(val?.id))}
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
          }
        </ScrollView>
        <View style={{ height: "10%" ,justifyContent:'center',alignItems:'center'}}>
        <TouchableOpacity style={
            
                { height: 40, width: 200, backgroundColor: "#08a29e", justifyContent: 'center', alignItems: 'center', borderRadius: 5 }
               
              }
              onPress={() =>booking()}
            >
              <Text style={
                { fontSize: 18, color: "#fff" }}>Book Appointment</Text>
            </TouchableOpacity>
        </View>
      </View>
    )
  }
}

export default VideoSlot

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 20,
    color: '#333333',

  }
})