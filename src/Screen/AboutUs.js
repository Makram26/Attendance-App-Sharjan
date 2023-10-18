import React from "react";
import { View, Text, StyleSheet, Button, TouchableOpacity, Dimensions } from 'react-native'

import Icon from "react-native-vector-icons/Ionicons"
import { COLORS } from "../Util/Color";
import CustomStatusBar from '../Component/CustomStatusBar'
// get screens dimensions 
const windowWidth = Dimensions.get('window').width;
const screenWidthGrater = windowWidth > 1100

export default function AboutUs({ navigation }) {
    return (
        <View style={{ flex: 1 }}>
            <CustomStatusBar backgroundColor={COLORS.statusbar_color} barStyle="light-content" />
            <View style={{ flexDirection: "row", backgroundColor: COLORS.btn_color, padding: 13, alignItems: "center" }}>
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <Icon name="menu-outline" size={screenWidthGrater ? windowWidth * 0.03 : windowWidth * 0.055} color={COLORS.white} style={{ alignSelf: "center", marginRight: 10 }} />
                </TouchableOpacity>
                <Text style={{ fontSize: screenWidthGrater ? windowWidth * 0.02 : windowWidth * 0.04, color: "#FFFFFF", alignSelf: "center", fontWeight: "600" }}>About Us</Text>
            </View>
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text style={{ fontSize: windowWidth * 0.04, fontWeight: '600', color: "#000" }}> About us screen </Text>
            </View>
        </View>
    )
}