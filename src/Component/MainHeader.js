import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'

import Logout from 'react-native-vector-icons/AntDesign'
import styles from "../Constant/HeaderStyle";
import { COLORS } from '../Util/Color'

export default function MainHeader({ goBack, title, logout }) {
    return (
        <View style={styles.container}>
            <View style={styles.leftContainer}>
                <Text style={styles.headerTitle}>{title}</Text>
            </View>
            <View style={styles.rightContainer}>
                <TouchableOpacity onPress={logout}>
                    <Logout name="logout" size={25} color={COLORS.white} style={{ marginRight: 10 }} />
                </TouchableOpacity>
                <Image source={require("../Assert/icon/AppLogo.jpeg")} style={styles.image} />
            </View>
        </View>
    )
}



