import { StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity, Image, StatusBar, Dimensions, Platform, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'

import CustomStatusBar from '../Component/CustomStatusBar'
import { COLORS } from '../Util/Color'
import Icon from "react-native-vector-icons/AntDesign"
import PersonIcon from "react-native-vector-icons/Octicons"
import Header from '../Component/Header'
import Spinner from 'react-native-loading-spinner-overlay';
import { getAllUser } from '../services'
import AsyncStorage from '@react-native-async-storage/async-storage';
import db from '../Database'
import NetInfo from '@react-native-community/netinfo';

// get screens dimensions
const { width, height } = Dimensions.get('window');

const screenWidthGrater = width > 1100
const UserList = ({ route, navigation }) => {

    const [searchQuery, setSearchQuery] = useState("")
    const [allUsers, setAllUsers] = useState("")
    const [loading, setLoading] = useState(false)
    const [isConnected, setIsConnected] = useState(true);

    useEffect(() => {
        // Get all user record in local storage.
        const getRecord = async () => {
            // get session uid 
            const uid = await AsyncStorage.getItem("uid");
            try {
                db.executeSql(
                    `SELECT * FROM users_profile WHERE userid = ${uid}`,
                    [],
                    (resultSet) => {
                        const rows = resultSet.rows
                        const record_Length = resultSet.rows.length;
                        if (record_Length > 0) {
                            const parseRecord = JSON.parse(rows.item(0).profile_record)
                            setAllUsers(parseRecord)
                        }
                        else {
                            setAllUsers("")
                        }
                    },
                    error => console.error('Error selecting data', error)
                );
            } catch (error) {
                console.log("error >>>>", error)
            }
        }

        getRecord()
    }, [])



    useEffect(() => {
        // check internet connection 
        const unsubscribe = NetInfo.addEventListener((state) => {
            setIsConnected(state.isConnected);
        });
        // Clean up the subscription on component unmount
        return () => {
            unsubscribe();
        };
    }, []);

    const getUsers = async () => {
        // get session uid 
        const uid = await AsyncStorage.getItem("uid");
        try {
            setLoading(true)
            // get all users record through API 
            const res = await getAllUser()
            
            // console.log("image",res)
            setAllUsers(res)
            // Insert and Update record in local storage 
            try {
                db.executeSql(
                    `SELECT * FROM users_profile WHERE userid = ${uid}`,
                    [],
                    (resultSet) => {
                        const rows = resultSet.rows
                        const record_Length = resultSet.rows.length;
                        if (record_Length > 0) {
                            const user_Profile_record = JSON.stringify(res);
                            try {
                                db.executeSql(
                                    'UPDATE users_profile SET profile_record = ? WHERE userid = ?',
                                    [user_Profile_record, uid], // replace 5 with the actual ID of the row you want to update
                                    () => console.log('Data updated'),
                                    error => console.error('Error updating data', error)
                                );
                            } catch (error) {
                                console.log("error in update", error)
                            }
                        }
                        else {
                            const user_Profile_record = JSON.stringify(res);
                            try {
                                db.executeSql(
                                    'INSERT INTO users_profile (userid,profile_record) VALUES (?,?)',
                                    [uid, user_Profile_record],
                                    () => console.log('Data inserted'),
                                    error => console.error('Error inserting data', error)
                                );
                            } catch (error) {
                                console.log("error in Insert data", error)
                            }
                        }
                    },
                    error => console.error('Error selecting data', error)
                );
            } catch (error) {
                console.log("error >>>>", error)

            }
            setLoading(false)
        } catch (error) {
            console.log("error <><><>", error)
            setLoading(false)
        }
    }
    // this function is used to filter user by last name 
    function filterEmployeesByLastName(letter, employees) {
        const filteredEmployees = employees && employees.filter((employee) => {
            if (employee.last_name && employee.last_name.toLowerCase().startsWith(letter.toLowerCase())) {
                return true;
            }
            return false;
        });
        return filteredEmployees;
    }

    const userInput = route.params.value;
    const filteredEmployees = filterEmployeesByLastName(userInput, allUsers);

    // this function is used to search user by first name 
    const filterFirstName = filteredEmployees && filteredEmployees.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    //    this function is used when user sync record again 
    const onRefresh = () => {
        getUsers()
    };
    return (
        <View style={styles.MainContainer}>
            <CustomStatusBar backgroundColor={COLORS.statusbar_color} barStyle="light-content" />
            {
                loading ?
                    <Spinner visible={true} />
                    :
                    null
            }
            <Header title="Users" goBack={() => navigation.goBack()} />
            <View style={styles.container}>
                <View style={styles.innerContainer}>
                    <TextInput
                        style={styles.inputStyle}
                        placeholder='Enter Search Name'
                        keyboardType="default"
                        value={searchQuery}
                        onChangeText={text => setSearchQuery(text)}
                    />
                    <Icon name="search1" size={screenWidthGrater ? width * 0.03 : width * 0.055} color={COLORS.black} style={{ alignSelf: "center", marginRight: 12 }} />
                </View>
                {
                    filterFirstName.length > 0 ?
                        <FlatList
                            data={filterFirstName}
                            showsVerticalScrollIndicator={false}
                            keyExtractor={(stoke) => stoke.key}
                            renderItem={({ item }) => {

                                // console.log(`https://sophi.go-tropa.com${item.img}`)
                                return (
                                    <TouchableOpacity onPress={() => navigation.navigate("Home", { item: item, isConnected: isConnected })} style={styles.cardContainer}>
                                        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                            {
                                                isConnected === false ?
                                                    <PersonIcon name="feed-person" size={screenWidthGrater ? width * 0.04 : width * 0.125} color={COLORS.black} style={{ alignSelf: "center", marginRight: 8, padding: 12 }} />
                                                    :
                                                    <View style={{ marginRight: 8, padding: 10 }}>
                                                        <Image
                                                            style={{
                                                                width: screenWidthGrater ? width * 0.05 : width * 0.12, // Adjust the percentage as needed
                                                                height: screenWidthGrater ? width * 0.05 : width * 0.12, borderRadius: 100
                                                            }}
                                                            // source={{ uri: `data:image/png;base64,${item.img}` }}
                                                            source={{ uri: `https://sophi.go-tropa.com${item.img}` }}

                                                        />
                                                    </View>
                                            }
                                            <View style={{ justifyContent: "center" }}>
                                                <Text style={{ color: COLORS.black, fontSize: screenWidthGrater ? width * 0.015 : width * 0.04, fontWeight: "600" }}>{item.name}</Text>
                                            </View>
                                        </View>
                                        <View style={{ alignSelf: "center", marginRight: 10 }}>
                                            <TouchableOpacity onPress={() => navigation.navigate("Home", { item: item, isConnected: isConnected })}>
                                                <Icon name="right" size={screenWidthGrater ? width * 0.025 : width * 0.055} color={COLORS.placeholder} />
                                            </TouchableOpacity>
                                        </View>
                                    </TouchableOpacity>
                                )
                            }}
                            refreshControl={
                                <RefreshControl refreshing={false} onRefresh={onRefresh} />
                            }
                        />
                        :
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 20 }}>
                            <Text style={{ color: COLORS.btn_color, marginLeft: 12, fontSize: screenWidthGrater ? width * 0.015 : width * 0.04 }}>No User Found</Text>
                            <TouchableOpacity onPress={() => getUsers()}
                                style={{ backgroundColor: COLORS.btn_color, borderRadius: 10, padding: screenWidthGrater ? 10 : 5, paddingHorizontal: screenWidthGrater ? 40 : 20 }}>
                                <Text style={{ color: "white", fontSize: screenWidthGrater ? width * 0.015 : width * 0.04 }}>Refresh</Text>

                            </TouchableOpacity>
                        </View>
                }
            </View>
        </View>
    )
}

export default UserList

const styles = StyleSheet.create({
    MainContainer: {
        flex: 1
    },
    container: {
        flex: 1,
        padding: width * 0.03, // Adjust the percentage as needed
    },
    inputStyle: {
        width: "90%",
        alignSelf: 'center',
        fontSize: screenWidthGrater ? width * 0.02 : width * 0.04,
        paddingHorizontal: screenWidthGrater ? width * 0.02 : width * 0.03, // Adjust the percentage as needed
        paddingVertical: Platform.OS === "ios" ? width * 0.06 : (screenWidthGrater ? width * 0.015 : width * 0.04), // Adjust the percentage as needed
    },
    innerContainer: {
        flexDirection: "row",
        backgroundColor: COLORS.white,
        width: '99%',
        justifyContent: "space-between",
        elevation: 1,
        borderRadius: width * 0.01, // Adjust the percentage as needed
    },
    cardContainer: {
        flexDirection: "row",
        backgroundColor: COLORS.white,
        width: '99%',
        justifyContent: "space-between",
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: width * 0.025, // Adjust the percentage as needed
        },
        shadowOpacity: 0.1,
        shadowRadius: width * 0.025, // Adjust the percentage as needed
        marginTop: screenWidthGrater ? width * 0.015 : width * 0.03, // Adjust the percentage as needed
        borderRadius: width * 0.02, // Adjust the percentage as needed
    }
})



