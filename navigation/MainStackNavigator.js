import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from '../screens/LoginScreen.jsx';
import SignupScreen from '../screens/SignupScreen.jsx';
import ImperiumMenuScreen from '../screens/ImperiumMenuScreen.jsx';
import PlanetScreen from '../screens/PlanetScreen.jsx';
import ResearchScreen from '../screens/ResearchScreen.jsx';
import HangarScreen from '../screens/HangarScreen.jsx';

const Stack = createStackNavigator();

const MainStackNavigator = () => {
    return (
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: "Iniciar sesión" }}
        />
        <Stack.Screen
          name="Signup"
          component={SignupScreen}
          options={{ title: "Registro" }}
        />
        <Stack.Screen
          name="ImperiumMenu"
          component={ImperiumMenuScreen}
          options={{ title: "Menú del Imperium" }}
        />
        <Stack.Screen
          name="PlanetScreen"
          component={PlanetScreen}
          options={{ title: "Planeta" }}
        />
        <Stack.Screen
          name="ResearchScreen"
          component={ResearchScreen}
          options={{ title: "Investigacion" }}
        />
        <Stack.Screen
          name="HangarScreen"
          component={HangarScreen}
          options={{ title: "Hangar" }}
        />
      </Stack.Navigator>
    );
  };
  
  export default MainStackNavigator;