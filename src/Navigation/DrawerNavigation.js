import React, { useState, useEffect } from "react";
import { SafeAreaView, Dimensions } from "react-native";

import { NavigationContainer } from '@react-navigation/native'
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { ClockStack } from "./StackNavigation";
import Settings from "../Screen/Settings";
import AboutUs from "../Screen/AboutUs";
import Team from 'react-native-vector-icons/MaterialIcons'
import Clock from 'react-native-vector-icons/MaterialCommunityIcons'
import Setting from 'react-native-vector-icons/Ionicons'
import About from 'react-native-vector-icons/Ionicons'
import UserList from "../Screen/UserList";
import Alphabetscreen from "../Screen/Alphabetscreen";
import { COLORS } from "../Util/Color";
import Home from "../Screen/Dashboard/Home";
import CustomDrawer from "./CustomDrawer";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();
// get screens dimensions 
const { width, height } = Dimensions.get('window');
const screenWidthGrater = width > 1100

const DrawerNav = () => {
  const [hideShow, setHideShow] = useState("")
  useEffect(() => {
    fetchAdminData();
  }, []); // Empty dependency array means this effect will run only once, on mount

  const fetchAdminData = async () => {
    try {
      const adminData = await AsyncStorage.getItem('admin');
      if (adminData == null) {
        fetchAdminData()
        return true
      }
      console.log("first", adminData)
      setHideShow(adminData);
    } catch (error) {
      // Handle any errors that may occur during fetching
      console.error("Error fetching admin data:", error);
    }
  };

  return (
    <Drawer.Navigator
      initialRouteName="Alphabetscreen"
      screenOptions={{
        headerShown: false,
        drawerStyle: { width: width * 0.7 }
      }}
      drawerContent={(props) => <CustomDrawer {...props} />}
    >
      <Drawer.Screen
        name="Alphabetscreen"
        component={Alphabetscreen}
        options={{
          title: "Select Surname..",
          drawerLabelStyle: { fontSize: screenWidthGrater ? width * 0.02 : width * 0.035 },
          drawerIcon: ({ color, size }) => <Team name="groups" size={screenWidthGrater ? width * 0.04 : width * 0.055} color={color} />,
        }} />
      {
        hideShow == "true" ?
          <Drawer.Screen
            name="Cloking Queue"
            component={ClockStack}
            options={{
              drawerLabelStyle: { fontSize: screenWidthGrater ? width * 0.02 : width * 0.035 },
              drawerIcon: ({ color, size }) => <Clock name="clock-check" size={screenWidthGrater ? width * 0.04 : width * 0.055} color={color} />,
            }}
          />
          :
          null
      }
      <Drawer.Screen
        name="Settings"
        component={Settings}
        options={{
          drawerLabelStyle: { fontSize: screenWidthGrater ? width * 0.02 : width * 0.035 },
          drawerIcon: ({ color, size }) => <Setting name="settings" size={screenWidthGrater ? width * 0.04 : width * 0.055} color={color} />,
        }} />
      <Drawer.Screen
        name="About US"
        component={AboutUs}
        options={{
          drawerLabelStyle: { fontSize: screenWidthGrater ? width * 0.02 : width * 0.035 },
          drawerIcon: ({ color, size }) => <About name="ios-alert-circle" size={screenWidthGrater ? width * 0.04 : width * 0.055} color={color} />,
        }} />
    </Drawer.Navigator>
  )
}

export default function DrawerNavigation() {
  return (
    <NavigationContainer>
      <SafeAreaView style={{ height: "100%", width: "100%" }}>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: COLORS.btn_color, // Change header color here
            },
            headerTintColor: "#FFFFFF", // Change header text color here
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen
            name="Alphabetscreen"
            component={DrawerNav}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="UserList"

            options={{
              headerShown: false,
              title: "Users",
            }}
            component={UserList}
          />
          <Stack.Screen
            name="Home"
            options={{
              headerShown: false,
              title: "Attendance",
            }}
            component={Home}
          />
        </Stack.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
}

