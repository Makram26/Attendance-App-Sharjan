
// const BASE_URL = 'https://tropatest.ifrs16.app';
// const BASE_URL = 'https://sufyan.go-tropa.com';
// const BASE_URL = 'http://192.168.70.184:8069';
// BASE URL
const BASE_URL = 'https://sophi.go-tropa.com';

import AsyncStorage from '@react-native-async-storage/async-storage';

// calling login API
export const login = (username, password,DATABASE_NAME) => {
    return fetch(`${BASE_URL}/web/session/authenticate/attendance-app`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, /',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            jsonrpc: "2.0",
            params: {
                login: username,
                password: password,
                db: DATABASE_NAME,
                attendance_app:"1"
            }
        }),
    }).then(res => res.json());
}
// calling get all users API
export const getAllUser = () => {
    return fetch(`${BASE_URL}/users/infos/filter?`, {
        method: 'GET',
        headers: {},
    }).then(res => res.json());
}
// calling Check_In API 
export const CheckInAPI = (date,pic,latitude,longitude,userId) => {
    return fetch(`${BASE_URL}/user/check_in`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, /',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            jsonrpc: "2.0",
            params: {
                check_in: date,
                check_in_latitude: latitude,
                check_in_longitude: longitude,
                user_id:userId,
                image:pic
            }
        }),
    }).then(res => res.json());
}
// calling Check_Out API
export const CheckOutAPI = (date,img,latitude,longitude,userId) => {   
    return fetch(`${BASE_URL}/user/check_out`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, /',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            jsonrpc: "2.0",
            params: {
                check_out: date,
                check_out_latitude: latitude,
                check_out_longitude: longitude,
                user_id:userId,
                image:img
            }
        }),
    }).then(res => res.json());
}
// calling Break_In API
export const BreakInAPI = (date,img,latitude,longitude,userId) => {
    return fetch(`${BASE_URL}/user/break_in`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, /',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            jsonrpc: "2.0",
            params: {
                break_time: date,
                user_id:userId,
                image:img
            }
        }),
    }).then(res => res.json());
}
// calling Break_Out API
export const BreakOutAPI = (date,img,latitude,longitude,userId) => {
    return fetch(`${BASE_URL}/user/break_out`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, /',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            jsonrpc: "2.0",
            params: {
                resume_time: date,
                user_id:userId,
                image:img
            }
        }),
    }).then(res => res.json());
}
// session management 
export const storeCredential = async (username,password,uid,admin) => {
  try {
    await AsyncStorage.setItem('username', username.toString())
    await AsyncStorage.setItem('password', password)
    await AsyncStorage.setItem('uid', uid.toString())
    await AsyncStorage.setItem('admin', admin.toString())
  } catch (e) {
    console.log("error",e)
  }
}
