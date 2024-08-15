import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import Details from './screens/Details';
import UR10 from './screens/UR10';
import ElectricalFacilities from './screens/ElectricalFacilities';
import MechanicalFacilities from './screens/MechanicalFacilities';
import SpaceFacilities from './screens/SpaceFacilities';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='Home' component={HomeScreen} options={{headerShown:false}}/>
        <Stack.Screen name='Details' component={Details} />
        <Stack.Screen name='UR10' component={UR10}/>
        <Stack.Screen name = 'MechanicalFacilities' component={MechanicalFacilities} /> 
        <Stack.Screen name = 'ElectricalFacilities' component={ElectricalFacilities} />
        <Stack.Screen name = 'SpaceFacilities' component={SpaceFacilities} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
