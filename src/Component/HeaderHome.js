import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'

import Menu from 'react-native-vector-icons/Feather'
import Notification from 'react-native-vector-icons/Ionicons'
import { COLORS } from '../Util/Color'
import styles from "../Constant/HeaderStyle";

export default function HeaderHome({ drawerOpen }) {
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={drawerOpen}>
                <Menu name='menu' size={25} color={COLORS.white} />
            </TouchableOpacity>
            <View style={styles.rightContainer}>
                <Notification name="notifications-outline" size={25} color={COLORS.white} style={{ marginRight: 10 }} />
                <Image source={require("../Assert/icon/AppLogo.jpeg")} style={styles.image} />
            </View>
        </View>
    )
}

