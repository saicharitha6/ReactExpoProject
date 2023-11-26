import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Image, TextInput, SafeAreaView, ScrollView } from 'react-native';
import doctorsData from './doctorsData.json';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import doctorImage from './doctorImage.jpg';

const DoctorSearch = () => {
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    // const [modalVisible, setModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigation = useNavigation();


    const renderStarRating = (rating) => {
        const starIcons = [];

        for (let i = 1; i <= 5; i++) {
            starIcons.push(
                <Ionicons
                    key={i}
                    name={i <= rating ? 'ios-star' : 'ios-star-outline'}
                    size={16}
                    color={i <= rating ? '#FFD700' : '#ccc'}
                />
            );
        }

        return (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {starIcons}
            </View>
        );
    };

    const goToDoctorProfile = (doctor) => {
        setSelectedDoctor(doctor);
        navigation.navigate('DoctorProfileDetails', { doctorId: doctor.id });
    };

    // Filter doctors based on search query
    const filteredDoctors = doctorsData.filter(
        (doctor) =>
            doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView>
                <View style={styles.container}>
                    {/* Navigation Bar */}
                    <View style={styles.navBar}>
                        <TouchableOpacity>
                            {/* Hamburger menu icon */}
                            <FontAwesome name="navicon" size={24} color="blue" style={{ marginLeft: 10 }} />
                        </TouchableOpacity>
                        <Text style={styles.navTitle}>Favourite Doctors</Text>
                        <TouchableOpacity>
                            <Ionicons name="ellipsis-horizontal" size={24} color="blue" style={{ marginRight: 10 }} />
                        </TouchableOpacity>
                    </View>

                    {/* Search Bar */}
                    <View style={styles.searchContainer}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search Doctor"
                            placeholderTextColor="#666"
                            value={searchQuery}
                            onChangeText={(text) => setSearchQuery(text)}
                        />
                    </View>
                    <Ionicons name="ios-search" size={24} color="#666" style={styles.searchIcon} />

                    {/* Doctor Cards */}
                    <View style={styles.cardsContainer}>
                        {filteredDoctors.map((doctor) => (
                            <TouchableOpacity
                                key={doctor.id}
                                style={styles.card}
                                onPress={() => goToDoctorProfile(doctor)}
                            >
                                <Image
                                    source={doctorImage}
                                    style={styles.cardImage}
                                    resizeMode="contain"
                                    accessibilityLabel={`${doctor.name}`}
                                />

                                <View style={styles.cardDetails}>
                                    <Text style={styles.cardName}>{doctor.name}</Text>
                                    <Text style={styles.cardSpecialization}>{doctor.specialization}</Text>
                                    <View style={styles.cardRatingContainer}>
                                        {renderStarRating(doctor.star)}
                                        <Text style={styles.cardRating}>{doctor.star}/5 Reviews</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                    {/* Footer */}
                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.footerItem}>
                            <Ionicons name="search" size={24} color="#007bff" />
                            <Text style={styles.footerText}>Search</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.footerItem}>
                            <Ionicons name="document-text" size={24} color="#007bff" />
                            <Text style={styles.footerText}>Records</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.footerItem}>
                            <Ionicons name="calendar" size={24} color="#007bff" />
                            <Text style={styles.footerText}>Appointments</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.footerItem}>
                            <Ionicons name="person" size={24} color="#007bff" />
                            <Text style={styles.footerText}>Profile</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    navBar: {
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
        padding: 10,paddingTop:40,
        width: '100%',
    },
    navTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
    },
    searchContainer: {
        width: '90%',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 20,
        marginTop: 30,
        marginHorizontal: 5,
        padding: 10,

    },
    searchIcon: {
        top: -38,
        marginRight: 305,
        color: '#007bff',
        marginLeft: 15
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        marginLeft: 25,
        color: '#333',
    },
    cardsContainer: {
        marginHorizontal: 15,
        flex: 1,
        flexDirection: 'column',
        flexWrap: 'wrap',
        alignItems: 'center',
        marginLeft: 50,
        width: "100%",
    },
    card: {
        backgroundColor: 'white',
        padding: 20,
        margin: 10,
        width: "85%",
        justifyContent: "space-evenly",
        borderBottomWidth: 2,
        borderTopWidth: 2,
        borderTopColor: 'rgba(0,0,0,0.1)',
        borderBottomColor: 'rgba(0,0,0,0.1)',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        overflow: 'hidden',
        flexDirection: 'row',
        borderRadius: 10,
    },

    cardDetails: {
        flex: 1,
        flexWrap: 'wrap',
        alignItems: 'flex-start',
    },
    cardImage: {
        width: "50%",
        alignSelf: 'flex-start',
        height: 100,
        marginLeft: 0,
        marginRight: 0,
        right: 30,
        marginBottom: 10,
        borderRadius: 40
    },
    cardName: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 5,
    },
    cardSpecialization: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    cardRatingContainer: {
        marginBottom: 5,
    },
    footer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingVertical: 10,
        borderTopWidth: 1,
        position: 'bottom',

    },
    footerItem: {
        alignItems: 'center',
    },
    footerText: {
        marginTop: 1,
        color: 'lightgrey',
    }
});

export default DoctorSearch;