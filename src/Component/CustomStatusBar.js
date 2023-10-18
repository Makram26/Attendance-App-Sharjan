import { View, Text, StatusBar, SafeAreaView } from 'react-native'
import React from 'react'

const CustomStatusBar = ({ backgroundColor, ...props }) => {
  return (
    <View style={{ backgroundColor, height: StatusBar.currentHeight }}>
      <SafeAreaView>
        <StatusBar translucent backgroundColor={backgroundColor} {...props} />
      </SafeAreaView>
    </View>
  )
}
export default CustomStatusBar