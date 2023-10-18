import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity, Alert } from 'react-native'

import { COLORS } from "../../Util/Color";
const windowWidth = Dimensions.get('window').width;
import Icon from "react-native-vector-icons/AntDesign"
import Icon1 from "react-native-vector-icons/Ionicons"
import CustomStatusBar from "../../Component/CustomStatusBar";
import { CheckInAPI, CheckOutAPI } from "../../services";
import db from "../../Database";
import Spinner from "react-native-loading-spinner-overlay";
// get screens dimensions 
const screenWidthGrater = windowWidth > 1100

export default function ClockingQueue({ navigation }) {

    const [allRecord, setAllRecord] = useState("")
    const [loading, setLoading] = useState(false);
    var failureInfo = ""

    useEffect(() => {
        ShowRecord()
        const unsubscribe = navigation.addListener('focus', () => {
            ShowRecord()
        });
        return () => {
            unsubscribe;
        };
    }, [])

    const ShowRecord = () => {
        try {
            let tempdata = []
            db.executeSql(
                'SELECT * FROM users',
                [],
                (resultSet) => {
                    const rows = resultSet.rows;
                    tempdata.push(...rows.raw())
                    setAllRecord(tempdata)
                    setLoading(false)
                },
                error => console.error('Error selecting data', error)
            )
        } catch (error) {
            console.log("error", error)
            setLoading(true)

        }
    }

    const makeAPICall = async (apiFunction, dateTime, pic, latitude, longitude, user_id) => {
        try {
            const res = await apiFunction(dateTime, pic, latitude, longitude, user_id)
            console.log("response", res)
            if (res.result.status == "error") {
                failureInfo = res.result.message
                alert(res.result.message)
                return false
            } else {
                alert(res.result.message)
                return true
            }
        } catch (error) {
            console.log("error", error)
            failureInfo = "TypeError: Network request failed"
            alert(error)
            return false
        }
    }

    const CheckIn = async (time, latitude, longitude, img, userid, id, name, type) => {
        setLoading(true)
        const res = await makeAPICall(CheckInAPI, time, img, latitude, longitude, userid,)
        if (res == false) {
            try {
                db.executeSql(
                    'INSERT INTO users (name,time,type,latitude,longitude,image,failure,userid) VALUES (?,?,?,?,?,?,?,?)',
                    [name, time, type, latitude, longitude, img, failureInfo, userid],
                    () => { console.log('Data inserted'), ShowRecord() },
                    error => console.error('Error inserting data', error)
                );
                setLoading(false)
            } catch (error) {
                console.log("error", error)
                setLoading(false)
            }
        }
        else {
            DelRequest(id)
        }
    }

    const CheckOut = async (time, latitude, longitude, img, userid, id, name, type) => {
        setLoading(true)
        const res = await makeAPICall(CheckOutAPI, time, img, latitude, longitude, userid,)
        if (res == false) {
            try {
                db.executeSql(
                    'INSERT INTO users (name,time,type,latitude,longitude,image,failure,userid) VALUES (?,?,?,?,?,?,?,?)',
                    [name, time, type, latitude, longitude, img, failureInfo, userid],
                    () => { console.log('Data inserted'), ShowRecord() },
                    error => console.error('Error inserting data', error)
                );
                setLoading(false)
            } catch (error) {
                console.log("error", error)

            }
        }
        else {
            DelRequest(id)
        }
    }

    const DelRequest = (id) => {
        try {
            db.executeSql(
                'DELETE FROM users WHERE id = ?',
                [id],
                () => ShowRecord(),
                error => console.error('Error deleting data', error)
            );
            setLoading(false)
        } catch (error) {
            console.log("error", error)
            setLoading(false)
        }
    }
    const AlertDelRecord = async (id) => {
        try {
            Alert.alert(
                'Delete Record',
                'Are you sure you want to delete this record? ',
                [
                    { text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                    { text: 'Yes', onPress: () => DelRequest(id) },
                ],
                { cancelable: false });
        } catch (err) {
            console.log(err)
        }
    }
    const renderItem = ({ item }) => {
        return (
            <>
                <View style={styles.RecordContainer}>
                    {
                        loading ?
                            <Spinner visible={true} />
                            :
                            null
                    }
                    <View style={styles.HeadingContainer}>
                        <Text style={[styles.textHeadingStyle, { color: COLORS.black, fontSize: screenWidthGrater ? windowWidth * 0.015 : windowWidth * 0.025 }]}>{item.name == "Administrator" ? "Admin" : item.name}</Text>
                    </View>
                    <View style={styles.HeadingContainer}>
                        <Text style={[styles.textHeadingStyle, { color: COLORS.black, fontSize: screenWidthGrater ? windowWidth * 0.015 : windowWidth * 0.025 }]}>{item.type}</Text>
                    </View>
                    <View style={styles.HeadingContainer}>
                        <Text style={[styles.textHeadingStyle, { color: COLORS.black, fontSize: screenWidthGrater ? windowWidth * 0.015 : windowWidth * 0.025 }]}>{item.time}</Text>
                    </View>
                    <View style={styles.HeadingContainer}>
                        <Text style={[styles.textHeadingStyle, { color: COLORS.black, fontSize: screenWidthGrater ? windowWidth * 0.015 : windowWidth * 0.025 }]}>{item.failure}</Text>
                    </View >
                    <View style={styles.HeadingContainer}>
                        <Text style={[styles.textHeadingStyle, { color: COLORS.black, fontSize: screenWidthGrater ? windowWidth * 0.015 : windowWidth * 0.025 }]}>1</Text>
                    </View>
                    <View style={styles.HeadingContainer}>
                        <TouchableOpacity
                            onPress={() =>
                                item.type == "Clock In"
                                    ? CheckIn(
                                        item.time,
                                        item.latitude,
                                        item.longitude,
                                        item.image,
                                        item.userid,
                                        item.id,
                                        item.name,
                                        item.type,

                                    )
                                    : CheckOut(
                                        item.time,
                                        item.latitude,
                                        item.longitude,
                                        item.image,
                                        item.userid,
                                        item.id,
                                        item.name,
                                        item.type,
                                    )
                            }
                            style={styles.actionButton}
                        >
                            <Icon name="pause" size={screenWidthGrater ? windowWidth * 0.02 : windowWidth * 0.05} color={COLORS.white} style={{ fontWeight: "bold", }} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => AlertDelRecord(item.id)}
                            style={styles.actionButton}
                        >
                            <Icon name="delete" size={screenWidthGrater ? windowWidth * 0.02 : windowWidth * 0.05} color={COLORS.white} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ borderWidth: 0.5, borderColor: COLORS.black, marginTop: 15 }} />
            </>
        );
    };
    return (
        <View style={styles.MainContainer}>
            <CustomStatusBar backgroundColor={COLORS.statusbar_color} barStyle="light-content" />
            <View style={{ flexDirection: "row", backgroundColor: COLORS.btn_color, padding: 13, paddingLeft: 3, alignItems: "center" }}>
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <Icon1 name="menu-outline" size={screenWidthGrater ? windowWidth * 0.03 : windowWidth * 0.05} color={COLORS.white} style={{ alignSelf: "center", marginLeft: 10, marginRight: 8 }} />
                </TouchableOpacity>
                <Text style={styles.headerText}>Clocking Queue</Text>
            </View>
            <View style={styles.headerContainer}>
                <View style={styles.HeadingContainer}>
                    <Text style={styles.textHeadingStyle}>Name</Text>
                </View>
                <View style={styles.HeadingContainer}>
                    <Text style={styles.textHeadingStyle}>Kind</Text>
                </View>
                <View style={styles.HeadingContainer}>
                    <Text style={styles.textHeadingStyle}>Clocking Time</Text>
                </View>
                <View style={styles.HeadingContainer}>
                    <Text style={styles.textHeadingStyle}>Last Failure</Text>
                </View >
                <View style={styles.HeadingContainer}>
                    <Text style={styles.textHeadingStyle}>Tries</Text>
                </View>
                <View style={styles.HeadingContainer}>
                    <Text style={styles.textHeadingStyle}>Actions</Text>
                </View>
            </View>
            <FlatList
                data={allRecord}
                showsVerticalScrollIndicator={false}
                renderItem={renderItem}
                keyExtractor={(item) => item.id && item.id.toString()}
            />
        </View>
    )
}
const styles = StyleSheet.create({
    MainContainer: {
        flex: 1
    },
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: COLORS.btn_color,
        paddingBottom: 10
    },
    headerText: {
        fontSize: screenWidthGrater ? windowWidth * 0.02 : windowWidth * 0.04,
        color: "#FFFFFF",
        alignSelf: "center",
        fontWeight: "600"
    },
    RecordContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
        marginLeft: 10
    },
    HeadingContainer: {
        justifyContent: "center",
        alignItems: "center",
        width: windowWidth / 6
    },
    textHeadingStyle: {
        color: COLORS.white,
        fontSize: screenWidthGrater ? windowWidth * 0.02 : windowWidth * 0.03,
        fontWeight: "500",
        marginBottom: 10
    },
    actionButton: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.btn_color,
        marginBottom: 8,
        padding: windowWidth * 0.02,
        marginRight: 4,
        borderRadius: 10,
    },
})