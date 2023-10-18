import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
    { name: 'mydatabase.db', location: 'default' },
    () => console.log('Database opened'),
    error => console.error('Error opening database', error)
);
export default db



