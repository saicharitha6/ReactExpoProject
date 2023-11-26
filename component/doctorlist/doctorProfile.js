import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import doctorsData from './data.json';
import doctorImage from './doctor.jpg';

const DoctorProfile = ({ route }) => {
    // const route = useRoute();
    const navigation = useNavigation();
    const { doctorId } = route.params;
    const [doctorDetails, setDoctorDetails] = useState(null);

    useEffect(() => {
        // Fetch doctor details by ID and update state
        // You can use your own API or data source
        // Example: Fetching from a doctorsData array
        const selectedDoctor = doctorsData.find((doctor) => doctor.id === doctorId);
        setDoctorDetails(selectedDoctor);
    }, [doctorId]);

    if (!doctorDetails) {
        return <Text>Loading...</Text>; // Add a loading state or component
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView>
                <View style={styles.container}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Ionicons name="ios-arrow-back" size={24} color="blue" style={{ marginLeft: 10 }} />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>{doctorDetails?.name || 'Favourite Doctors'}</Text>
                        <TouchableOpacity>
                            <FontAwesome name="heart" size={24} color="red" style={{ marginRight: 10 }} />
                        </TouchableOpacity>
                    </View>

                    {/* Doctor Details */}
                    <View style={styles.container1}>
                        <Image source={doctorImage} style={styles.doctorImage} />
                        <Text style={styles.doctorName}>{doctorDetails.name}</Text>
                        <Text style={styles.specialization}>{doctorDetails.specialization}</Text>
                        <Text style={styles.specialization}>{doctorDetails.hospital}</Text>
                        {/* Add more details as needed */}
                    </View>
                    <View style={styles.separator} />
                    <View style={styles.container2}>
                        <Text style={styles.sectionTitle}>About Me</Text>
                        <Text>{doctorDetails.description}</Text>

                        <Text style={styles.sectionTitle}>Qualifications</Text>
                        <View style={styles.qualificationContainer}>
                            <Text style={styles.degree}>Degree</Text>
                            <Text style={styles.university}>{doctorDetails.qualification}</Text>
                        </View>

                        <Text style={styles.sectionTitle}>Service and Specialization</Text>
                        <View style={styles.qualificationContainer}>
                            <Text style={styles.degree}>Service</Text>
                            <Text style={styles.university}>{doctorDetails.service}</Text>
                        </View>

                        <View style={styles.qualificationContainer}>
                            <Text style={styles.degree}>specialization</Text>
                            <Text style={styles.university}>{doctorDetails.specialization}</Text>
                        </View>
                        <Text style={styles.sectionTitle}>Consulting Availability</Text>
                        <Text >Monday-Friday</Text>
                        <Text>08:00AM - 10:00PM</Text>
                    </View>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Book Appointment</Text>
                    </TouchableOpacity>
                    <View style={styles.separator} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.1)',
        borderBottomColor: 'rgba(0,0,0,0.1)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        padding: 10,
        width: '100%', paddingTop: 40,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
    },

    container1: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    doctorImage: {
        width: 100,
        height: 100,
        borderRadius: 100,
    },
    doctorName: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10,
    },
    specialization: {
        fontSize: 16,
        color: '#666',
        marginTop: 5,
    },
    container2: {
        // flex: 1,
        padding: 20
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 5
    },
    qualificationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    degree: {
        flex: 2,
        fontWeight: 'bold',
    },
    university: {
        flex: 3
    },
    button: {
        backgroundColor: 'blue',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    separator: {
        borderBottomWidth: 2,
        borderBottomColor: 'lightgrey',
        width: '100%', // Adjust the width as needed
        alignSelf: 'center',
        paddingVertical: 5
    },
});

export default DoctorProfile;
