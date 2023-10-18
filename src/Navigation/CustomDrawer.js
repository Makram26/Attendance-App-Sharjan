import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Dimensions,
  Modal,
  TouchableOpacity
} from 'react-native';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import LogoutIcon from 'react-native-vector-icons/Fontisto'
import AuthContext from '../Component/AuthProvider';
// get screens dimensions 
const { width, height } = Dimensions.get('window');
const screenWidthGrater = width > 1100

const CustomAlert = ({ visible, onClose }) => {
  return (
    <Modal transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.alertContainer}>
          <Text style={styles.alertText}>
            This is an example alert message
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};


function CustomDrawer(props) {
  const navigation = useNavigation();
  const { setUser } = useContext(AuthContext)
  const [alertVisible, setAlertVisible] = useState(false);

  const showAlert = () => {
    setAlertVisible(true);
  };

  const hideAlert = () => {
    setAlertVisible(false);
  };

  const RemoveSession = async () => {
    await AsyncStorage.removeItem("uid")
    await AsyncStorage.removeItem("username")
    await AsyncStorage.removeItem("password")
    await AsyncStorage.removeItem("admin")
    setUser(null)
  }
  const onLogout = async () => {
    try {
      Alert.alert(
        'Logout',
        'Do you want to Logout?',
        [
          { text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
          { text: 'Yes', onPress: () => RemoveSession() },
        ],
        {
          cancelable: false,
          textstyle: styles.alertText

        });
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <DrawerContentScrollView {...props}>
      <CustomAlert visible={alertVisible} onClose={hideAlert} />
      <DrawerItemList {...props} />
      <DrawerItem
        label="Logout" onPress={() => onLogout()}
        labelStyle={{ fontSize: screenWidthGrater ? width * 0.02 : width * 0.035 }}
        icon={({ focused, color, size }) => {
          return (
            <LogoutIcon name="power" size={screenWidthGrater ? width * 0.04 : width * 0.055} color={color} />
          )
        }}
      />
    </DrawerContentScrollView>
  );
}
const styles = StyleSheet.create(
  {
    logo: {
      width: 80,
      height: 80,
      borderRadius: 100,
    },
    userInfoSection: {
      backgroundColor: '#006D6D',
      height: 150,
      width: 280,
      justifyContent: 'center',
      alignItems: 'center'
      , alignSelf: 'center'
    },
    textstyle: {
      fontSize: 17,
      textAlign: "center",
      fontStyle: "normal",
      color: "#fff",

    },
    editprofilebtn: {
      backgroundColor: "#2F6831",
      borderRadius: 10,
      shadowColor: '#000',
      width: "50%",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.8,
      shadowRadius: 10,
    },
    btnText: {
      color: 'rgba(255,255,255,0.7)',
      fontSize: 15,
      textAlign: 'center',
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonText: {
      fontSize: 18,
      color: 'blue',
      marginTop: 20,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    alertContainer: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
    },
    alertText: {
      fontSize: 20,
      marginBottom: 20,
    },

  }
)
export default CustomDrawer;