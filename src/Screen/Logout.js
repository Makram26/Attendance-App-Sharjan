import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AuthContext from '../Component/AuthProvider';

export default function Logout() {
    const { setUser } = useContext(AuthContext)

    const handleLogout = async () => {
        setUser(null)
        alert("Logout Successfully")
    };
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handleLogout}>
                <Text style={styles.logout}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logout: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});
