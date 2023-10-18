import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image,Dimensions } from 'react-native'

import Back from 'react-native-vector-icons/Ionicons'
import Logout from 'react-native-vector-icons/AntDesign'
import styles from "../Constant/HeaderStyle";
import { COLORS } from '../Util/Color'
// get screens dimensions
const { width, height } = Dimensions.get('window');
const screenWidthGrater =width > 1100


export default function Header({ goBack, title, logout }) {
    return (
        <View style={styles.container}>
            <View style={styles.leftContainer}>
                <TouchableOpacity onPress={goBack}>
                    <Back name='arrow-back' size={screenWidthGrater ? width * 0.03 : width * 0.055} color={COLORS.white} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{title}</Text>
            </View>
        </View>
    )
}

