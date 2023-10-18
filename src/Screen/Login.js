import React, { useState, useContext } from 'react'
import { View, Text, StatusBar, Image, TextInput, TouchableOpacity, ScrollView, Dimensions, Alert } from 'react-native'
import { Auth_Screen_Styles } from '../Constant/LoginStyle'
import Feather from 'react-native-vector-icons/Feather';
import MailBox from 'react-native-vector-icons/Fontisto';
import Spinner from 'react-native-loading-spinner-overlay';
import { getAllUser, login, storeCredential } from '../services';
import AuthContext from '../Component/AuthProvider';

// get screens Dimensions
const { width, height } = Dimensions.get('window');
// get local Database
import db from '../Database'

const Login = () => {

  const { user, setUser } = useContext(AuthContext)
  const screenWidthGrater = width > 1100

  const [oldsecureTextEntry, setOldSecureTextEntry] = useState(false)
  const [userId, setUserId] = useState("")
  const [password, setPassword] = useState("")
  const [dbName, setDBName] = useState("")
  const [emailErrorMsg, setEmailErrorMsg] = useState("")
  const [passwordErrorMsg, setPasswordErrorMsg] = useState("")
  const [dbErrorMsg, setDBErrorMsg] = useState("")
  const [loading, setLoading] = useState(false)

  const updateOldSecureTextEntry = () => {
    setOldSecureTextEntry(!oldsecureTextEntry);
  }

  const getUserIdValue = (value) => {
    setUserId(value)
    setEmailErrorMsg("")
  }

  const getPasswordValue = (value) => {
    setPassword(value)
    setPasswordErrorMsg("")
  }

  const getDBValue = (value) => {
    setDBName(value)
    setDBErrorMsg("")
  }

  const submitHandler = async () => {
    if (userId === "") {
      setEmailErrorMsg("Please Enter Your Email")
      return true
    }

    if (password === "") {
      setPasswordErrorMsg("Please Enter Your Password")
      return true
    }
    if (dbName === "") {
      setDBErrorMsg("Please Enter Database Name")
      return true
    }
    if (userId != "" && password != "" && dbName != "") {
      try {
        setLoading(true)
        let response = await login(userId.trim(), password.trim(), dbName.trim())
        console.log("response", response)
        if (response.error && response.error.data.message != "Access denied") {
          alert(`database ${dbName} does not exist`)
          setLoading(false)
          return true
        }
        if (response.result) {
          if (response.result.error) {
            alert(response.result.error)
            setLoading(false)
            return true
          }
          // get all users record through API and Insert & Update Record in local storage 
          try {
            const res = await getAllUser()
            try {
              db.executeSql(
                `SELECT * FROM users_profile WHERE userid = ${response.result.uid}`,
                [],
                (resultSet) => {
                  const rows = resultSet.rows
                  const record_Length = resultSet.rows.length;
                  if (record_Length > 0) {
                    const user_Profile_record = JSON.stringify(res);
                    try {
                      db.executeSql(
                        'UPDATE users_profile SET profile_record = ? WHERE userid = ?',
                        [user_Profile_record, response.result.uid],
                        () => console.log('Data updated'),
                        error => console.error('Error updating data', error)
                      );
                    } catch (error) {
                      console.log("error in update", error)
                    }
                  }
                  else {
                    const user_Profile_record = JSON.stringify(res);
                    try {
                      db.executeSql(
                        'INSERT INTO users_profile (userid,profile_record) VALUES (?,?)',
                        [response.result.uid, user_Profile_record],
                        () => console.log('Data inserted'),
                        error => console.error('Error inserting data', error)
                      );
                    } catch (error) {
                      console.log("error in Insert data", error)
                    }
                  }
                },
                error => console.error('Error selecting data', error)
              );
            } catch (error) {
              console.log("error >>>>", error)
            }
          } catch (error) {
            console.log("error <><><>", error)
            setLoading(false)
          }
          storeCredential(userId.trim(), password.trim(), response.result.uid, response.result.is_admin)
          setUser(response.result.uid)
          setLoading(false)
        }
        else {
          setLoading(false)
          alert("Username and password do not match!")
        }
      } catch (error) {
        setLoading(false)
        console.log("error", error)
      }
    }
  }

  return (
    <View style={Auth_Screen_Styles.main_container}>
      {
        loading ?
          <Spinner visible={true} />
          :
          null
      }
      <StatusBar animated={true} backgroundColor="#000000" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="always">
        {/* Logo */}
        <View style={Auth_Screen_Styles.header}>
          <Image source={require("../Assert/icon/AppLogo.jpeg")} resizeMode='contain' style={Auth_Screen_Styles.bg} />
        </View>
        <View style={Auth_Screen_Styles.body}>
          <Text style={Auth_Screen_Styles.heading}>Let's Sign In</Text>
          {/* User Email */}
          <View
            style={Auth_Screen_Styles.inputContainer}
          >
            <TextInput
              placeholder='Enter Your Email'
              placeholderTextColor="#A1A5C1"
              style={Auth_Screen_Styles.input_Text}
              value={userId}
              onChangeText={(val) => getUserIdValue(val)}
            />
            <MailBox name="email" size={screenWidthGrater ? width * 0.015 : width * 0.04} color="#030303" />
          </View>
          <Text style={{ color: "red", marginTop: 5, fontSize: 10, marginLeft: 3 }}>{emailErrorMsg != "" ? emailErrorMsg : ""}</Text>
          {/* Password */}
          <View style={Auth_Screen_Styles.inputContainer}>
            <TextInput
              placeholder='Enter Your Password'
              placeholderTextColor="#A1A5C1"
              style={Auth_Screen_Styles.input_Text}
              secureTextEntry={oldsecureTextEntry ? false : true}
              value={password}
              onChangeText={(val) => getPasswordValue(val)}
            />
            <TouchableOpacity onPress={updateOldSecureTextEntry}>
              {
                oldsecureTextEntry ?
                  <Feather name="eye" size={screenWidthGrater ? width * 0.015 : width * 0.04} color="#030303" />
                  :
                  <Feather name="eye-off" size={screenWidthGrater ? width * 0.015 : width * 0.04} color="#030303" />
              }
            </TouchableOpacity>
          </View>
          <Text style={{ color: "red", marginTop: 5, fontSize: 10, marginLeft: 3 }}>{passwordErrorMsg != "" ? passwordErrorMsg : ""}</Text>
          {/* Database Name */}
          <View style={Auth_Screen_Styles.inputContainer}>
            <TextInput
              placeholder='Enter Database Name'
              placeholderTextColor="#A1A5C1"
              style={Auth_Screen_Styles.input_Text}
              value={dbName}
              onChangeText={(val) => getDBValue(val)}
            />
            <MailBox name="database" size={screenWidthGrater ? width * 0.015 : width * 0.04} color="#030303" />
          </View>
          <Text style={{ color: "red", marginTop: 5, fontSize: 10, marginLeft: 3 }}>{dbErrorMsg != "" ? dbErrorMsg : ""}</Text>
          <TouchableOpacity onPress={() => submitHandler()} style={Auth_Screen_Styles.btnContainer}>
            <Text style={Auth_Screen_Styles.btnText}>Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}
export default Login
