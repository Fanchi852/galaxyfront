import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import MainStackNavigator from './navigation/MainStackNavigator.js';

/*
import LoginScreen from './components/LoginScreen.jsx';
import SignupScreen from './components/SignupScreen.jsx';
import ImperiumMenuScreen from './components/ImperiumMenuScreen.jsx';
*/
const Stack = createStackNavigator();

export default function App() {
  return (

    <NavigationContainer>
      <MainStackNavigator />
    </NavigationContainer>

    /*
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" style={styles.container}>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ImperiumMenu" component={ImperiumMenuScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>

    
    <View style={styles.container}>
      <LoginScreen></LoginScreen>
    </View>
    */
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
