import { Dimensions, StyleSheet, Text, TouchableOpacity, View, FlatList, StatusBar } from 'react-native'
import React from 'react'

import CustomStatusBar from '../Component/CustomStatusBar'
import Icon from "react-native-vector-icons/Ionicons"
import { AlphabetData4Column, AlphabetData6Column } from '../Util/Alphabetdata'
import { COLORS } from '../Util/Color'
// get screens dimensions 
const { width, height } = Dimensions.get('window');
const screenWidthGrater = width > 1100

const Alphabetscreen = ({ navigation }) => {
    return (
        <View style={styles.MainContainer}>
            <CustomStatusBar backgroundColor={COLORS.statusbar_color} barStyle="light-content" />
            <View style={{ flexDirection: "row", backgroundColor: COLORS.btn_color, padding: 13, alignItems: "center" }}>
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <Icon name="menu-outline" size={screenWidthGrater ? width * 0.03 : width * 0.05} color={COLORS.white} style={{ alignSelf: "center", marginRight: 10, marginTop: 4 }} />
                </TouchableOpacity>
                <Text style={{ fontSize: screenWidthGrater ? width * 0.02 : width * 0.04, color: "#FFFFFF", alignSelf: "center", fontWeight: "600" }}>Select Surname..</Text>
            </View>
            <View style={{ flex: 1, paddingHorizontal: 15, paddingTop: 10, marginTop: 0, }}>
                <FlatList
                    data={screenWidthGrater ? AlphabetData6Column : AlphabetData4Column}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(stoke) => stoke.key}
                    style={{ paddingBottom: 100 }}
                    renderItem={({ item }) => {
                        return (
                            <View style={styles.container}>
                                <TouchableOpacity onPress={() => navigation.navigate("UserList", { value: item.value1 })} style={styles.box}>
                                    <Text style={styles.textStyle}>{item.value1}</Text>
                                </TouchableOpacity >
                                <TouchableOpacity onPress={() => navigation.navigate("UserList", { value: item.value2 })} style={styles.box}>
                                    <Text style={styles.textStyle}>{item.value2}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => navigation.navigate("UserList", { value: item.value3 })} style={item.value3 != "" ? styles.box : { width: width * 0.06, height: width * 0.06, }}>
                                    <Text style={styles.textStyle}>{item.value3}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => navigation.navigate("UserList", { value: item.value4 })} style={item.value4 != "" ? styles.box : { width: width * 0.06, height: width * 0.06, }}>
                                    <Text style={styles.textStyle}>{item.value4}</Text>
                                </TouchableOpacity>
                                {
                                    screenWidthGrater ?
                                        <>
                                            <TouchableOpacity onPress={() => navigation.navigate("UserList", { value: item.value5 })} style={item.value5 != "" ? styles.box : { width: width * 0.06, height: width * 0.06, }}>
                                                <Text style={styles.textStyle}>{item.value5}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => navigation.navigate("UserList", { value: item.value6 })} style={item.value6 != "" ? styles.box : { width: width * 0.06, height: width * 0.06, }}>
                                                <Text style={styles.textStyle}>{item.value6}</Text>
                                            </TouchableOpacity>
                                        </>

                                        :
                                        null

                                }

                            </View>
                        )
                    }}
                />
            </View>
        </View>
    )
}

export default Alphabetscreen

const styles = StyleSheet.create({
    MainContainer: {
        flex: 1,
    },
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingLeft: 10,
        paddingRight: 10,

        marginBottom: height * 0.04, // Adjust the percentage as needed
        marginTop: height * 0.01, // Adjust the percentage as needed
    },
    box: {
        width: screenWidthGrater ? width * 0.06 : width * 0.14, // Adjust the percentage as needed
        height: screenWidthGrater ? width * 0.06 : width * 0.14, // Adjust the percentage as needed
        backgroundColor: COLORS.placeholder,
        justifyContent: "center",
        alignItems: 'center',
        borderRadius: (width * 0.14) / 2, // Adjust the percentage as needed
    },
    textStyle: {
        color: COLORS.black,
        fontSize: screenWidthGrater ? width * 0.03 : width * 0.08, // Adjust the percentage as needed
        fontWeight: "400"
    }
})