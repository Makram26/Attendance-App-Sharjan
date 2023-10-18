import React, { useState, useEffect, useContext, useCallback } from "react";
import {
    View,
    Alert,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    Dimensions,
    PermissionsAndroid,
    Platform
} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import { COLORS } from "../../Util/Color";
import { launchCamera } from 'react-native-image-picker'
import PersonIcon from "react-native-vector-icons/Octicons"
import { request, check, PERMISSIONS } from 'react-native-permissions';
import CustomStatusBar from "../../Component/CustomStatusBar";
import Header from "../../Component/Header";
import { BreakInAPI, BreakOutAPI, CheckInAPI, CheckOutAPI } from "../../services";
import Geolocation from 'react-native-geolocation-service';
import db from "../../Database";

// Create tabel if not Exists 
db.transaction((tx) => {
    db.executeSql(
        'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT,time TEXT,type TEXT,latitude TEXT,longitude TEXT,image TEXT,failure TEXT,userid TEXT)',
        []
    );
    db.executeSql(
        'CREATE TABLE IF NOT EXISTS users_profile (userid INTEGER PRIMARY KEY,profile_record TEXT)',
        []
    );
});
// get screens dimensions
const windowWidth = Dimensions.get("window").width;
const screenWidthGrater = windowWidth > 1100
// Delete the table
// db.transaction((tx) => {
//     tx.executeSql('DROP TABLE IF EXISTS users;', [], (tx, result) => {
//       console.log('Table deleted successfully.');
//     }, (error) => {
//       console.log('Error deleting table:', error);
//     });
//   });
export default function Home({ navigation, route }) {

    const [loading, setLoading] = useState(false);
    const [{ latitude, longitude, error, pic }, setLocation] = useState({
        latitude: null,
        longitude: null,
        error: null,
        pic: ""
    });
    var failure_Info = ""
    //  destructure props data 
    const { item, isConnected } = route.params;


    // console.log("internet check",isConnected)
    //this function is used to Permission for camera
    const requestCameraPermission = async (value) => {
        if (Platform.OS === "ios") {
            const cameraStatus = await check(PERMISSIONS.IOS.CAMERA);
            console.log("camera Status in ios", cameraStatus)
            if (cameraStatus === 'granted') {
                openCamara();
            } else if (cameraStatus === 'denied') {
                Alert.alert(
                    'Camera Permission Denied',
                    'Please go to Settings and enable camera access for this app.',
                    [{ text: 'OK' }],
                    { cancelable: false }
                );
            } else {
                const result = await request(PERMISSIONS.IOS.CAMERA);
                if (result === 'granted') {
                    openCamara(value);
                }
                else {
                    Alert.alert(
                        'Camera Permission Denied',
                        'Please go to Settings and enable camera access for this app.',
                        [{ text: 'OK' }],
                        { cancelable: false }
                    );
                }
            }
        }
        else {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: "App Camera Permission",
                        message: "App needs access to your camera ",
                        buttonNeutral: "Ask Me Later",
                        buttonNegative: "Cancel",
                        buttonPositive: "OK"
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    openCamara(value);
                } else {
                    console.log("Camera permission denied");
                }
            } catch (err) {
                console.warn(err);
            }
        }
    };
    //this function is used to Take picture and retrieve its URI
    const openCamara = (value) => {
        const options = {
            storageOptions: {
                path: 'images',
                mediaType: 'photo',
                cameraType: "front"
            },
            includeBase64: true,
            maxWidth: 200,
            maxHeight: 200
        };
        launchCamera(options, response => {
            if (response.didCancel) {
                console.log('Not capture any image!');
                alert("Not capture any image!")
            }
            else {
                // You can also display the image using data:
                const source = { uri: response.assets[0].base64 };
                if (latitude != null) {
                    switch (value) {
                        case "in":
                            setTimeout(() => CheckIn(source.uri), 500);
                            break;
                        case "out":
                            CheckOut(source.uri);
                            break;
                        case "break_in":
                            BreakIn(source.uri);
                            break;
                        case "break_out":
                            BreakOut(source.uri);
                            break;
                    }
                } else {
                    alert("Location permission denied")
                }
            }
        });
    }

    // this function is used to get required format of date and time
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const now = new Date();
    const formattedDateTime = formatDate(now);

    const makeAPICall = async (apiFunction, dateTime, pic, latitude, longitude, user_id) => {
        try {
            const res = await apiFunction(dateTime, pic, latitude, longitude, user_id)
            console.log("response", res)
            if (res.result.status == "error") {
                failure_Info = res.result.message
                alert(res.result.message)
                return false
            } else {
                alert(res.result.message)
                navigation.navigate("Alphabetscreen")
                return true
            }
        } catch (error) {
            console.log("error", error)
            failure_Info = "No Internet Connection"
            alert("No Internet Connection: Attendance Saved To Offline Queue")
            return false
        }
    }

    // this function is used to call Check_In API 
    const CheckIn = async (img) => {
        setLoading(true)
        const res = await makeAPICall(CheckInAPI, formattedDateTime, img, latitude, longitude, item.user_id,)
        setLoading(false)
        if (res == false) {
            try {
                db.executeSql(
                    'INSERT INTO users (name,time,type,latitude,longitude,image,failure,userid) VALUES (?,?,?,?,?,?,?,?)',
                    [item.name, formattedDateTime, "Clock In", latitude, longitude, img, failure_Info, item.user_id],
                    () => console.log('Data inserted'),
                    error => console.error('Error inserting data', error)
                );
            } catch (error) {
                console.log("error", error)
            }
        }
    }
    // this function is used to call Check_Out API 
    const CheckOut = async (img) => {
        setLoading(true)
        const res = await makeAPICall(CheckOutAPI, formattedDateTime, img, latitude, longitude, item.user_id)
        setLoading(false)
        if (res == false) {
            try {
                db.executeSql(
                    'INSERT INTO users (name,time,type,latitude,longitude,image,failure,userid) VALUES (?,?,?,?,?,?,?,?)',
                    [item.name, formattedDateTime, "Clock Out", latitude, longitude, img, failure_Info, item.user_id],
                    () => console.log('Data inserted'),
                    error => console.error('Error inserting data', error)
                );
            } catch (error) {
                console.log("error", error)
            }
        }
    }
    // this function is used to call Break_In API 
    const BreakIn = async (img) => {
        setLoading(true)
        const res = await makeAPICall(BreakInAPI, formattedDateTime, img, null, null, item.user_id)
        setLoading(false)
    }
    // this function is used to call Break_Out API 
    const BreakOut = async (img) => {
        setLoading(true)
        const res = await makeAPICall(BreakOutAPI, formattedDateTime, img, null, null, item.user_id)
        setLoading(false)
    }

    useEffect(() => {
        // get permission about location 
        const requestLocationPermission = async () => {
            setLoading(true)
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    // Permission granted, retrieve latitude and longitude
                    Geolocation.getCurrentPosition(
                        (position) => {
                            console.log(position);
                            setLocation((prev) => ({ ...prev, latitude: position.coords.latitude, longitude: position.coords.longitude, error: null }));
                            setLoading(false)
                        },
                        (error) => {
                            // See error code charts below.
                            console.log(error.code, "<><><", error.message);
                            setLoading(false)
                            alert("Location permission denied or " + error.message)
                        },
                        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
                    );
                } else {
                    console.log('Location permission denied');
                    setLoading(false)
                    alert("Location permission denied")
                }
            } catch (err) {
                console.warn(err);
            }
        };

        // Check location permission status
        check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
            .then((result) => {
                switch (result) {
                    case 'granted':
                        // Permission already granted, retrieve latitude and longitude
                        requestLocationPermission();
                        break;
                    case 'denied':
                        // Permission denied, request location permission
                        request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then((response) => {
                            if (response === 'granted') {
                                // Permission granted, retrieve latitude and longitude
                                requestLocationPermission();
                            } else {
                                console.log('Location permission denied');
                            }
                        });
                        break;
                    default:
                        console.log('Location permission is neither granted nor denied');
                        break;
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);
    // design of Boxes in Home screens 
    const StatusBox = useCallback(({ image, type, fun_call }) => {
        return (
            <TouchableOpacity onPress={fun_call} style={styles.statusBox}>
                <Image source={image} style={styles.images} />
                <Text style={styles.statusquantity}>{type}</Text>
            </TouchableOpacity>
        )
    })
    return (
        <View style={styles.container}>
            {
                loading ?
                    <Spinner visible={true} />
                    :
                    null
            }
            <CustomStatusBar backgroundColor={COLORS.statusbar_color} barStyle="light-content" />
            <Header title="Attendance" goBack={() => navigation.goBack()} />
            {/* body */}
            <ScrollView contentContainerStyle={styles.body}>
                {/* Heading */}
                <View style={{ flexDirection: "row", alignItems: "center", marginLeft: 10 }}>
                    {
                        isConnected === false ?
                            <PersonIcon name="feed-person" size={screenWidthGrater ? windowWidth * 0.05 : windowWidth * 0.10} color={COLORS.black} style={{ padding: 12 }} />
                            :
                            <View style={{ marginRight: 8, padding: 10 }}>
                                <Image
                                    style={{ width: screenWidthGrater ? windowWidth * 0.1 : windowWidth * 0.14, height: screenWidthGrater ? windowWidth * 0.1 : windowWidth * 0.14, borderRadius: 100 }}
                                    source={{ uri: `https://sophi.go-tropa.com${item.img}` }}
                                />
                            </View>
                    }
                    <Text style={styles.textHeading}>{item.name}</Text>
                </View>
                <View style={{ borderWidth: 0.5, borderColor: COLORS.placeholder, marginTop: 10 }} />
                {/* Status Boxes */}
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginTop: 15 }}>
                    <View style={styles.statusBoxContainer}>
                        <StatusBox
                            image={require("../../Assert/icon/checkin1.png")}
                            type="Check-IN"
                            fun_call={() => requestCameraPermission("in")}
                        />
                        <StatusBox
                            image={require("../../Assert/icon/checkout1.png")}
                            type="Check-OUT"
                            fun_call={() => requestCameraPermission("out")}
                        />
                        <StatusBox
                            image={require("../../Assert/icon/breakin1.png")}
                            type="Break-IN"
                            fun_call={() => requestCameraPermission("break_in")}
                        />
                        <StatusBox
                            image={require("../../Assert/icon/breakout11.png")}
                            type="Break-OUT"
                            fun_call={() => requestCameraPermission("break_out")}
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 1,
    },
    body: {
        flexGrow: 1,
        backgroundColor: '#fff'
    },
    statusBoxContainer: {
        width: screenWidthGrater ? windowWidth - 40 : windowWidth - 25,
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        paddingTop: 0,
    },
    statusBox: {
        width: screenWidthGrater ? windowWidth / 6.5 : windowWidth / 2.5,
        borderRadius: 30,
        justifyContent: "center",
        backgroundColor: 'white',
        elevation: 6,
        marginBottom: windowWidth * 0.10,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.5,
        shadowRadius: 5,
    },
    statusType: {
        color: COLORS.black,
        fontSize: windowWidth * 0.12,
        fontFamily: 'Lato',
        fontStyle: 'normal',
        fontWeight: '400',
        marginTop: 15,
    },
    images: {
        width: screenWidthGrater ? windowWidth * 0.09 : windowWidth * 0.30,
        height: screenWidthGrater ? windowWidth * 0.09 : windowWidth * 0.30,
        alignSelf: 'center',
        margin: 10
    },
    statusquantity: {
        fontSize: screenWidthGrater ? windowWidth * 0.018 : windowWidth * 0.045,
        fontWeight: '500',
        color: COLORS.black,
        alignSelf: 'center',
    },
    textHeading: {
        fontSize: windowWidth * 0.03,
        fontWeight: '700',
        color: COLORS.black,
    },
})
