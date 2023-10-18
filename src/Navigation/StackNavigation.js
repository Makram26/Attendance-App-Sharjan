import React from "react";
import { createStackNavigator, CardStyleInterpolators } from "@react-navigation/stack";
import ClockingQueue from "../Screen/ClockRecord/ClokingQueue";

const Stack = createStackNavigator();

const ClockStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="ClockingQueue" component={ClockingQueue} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
}

export { ClockStack }

