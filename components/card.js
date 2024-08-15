import { View, Text, Image } from 'react-native'
import React from 'react'
import { GestureDetector, GestureHandlerRootView, TouchableOpacity } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'


const Card = ({title,imageName}) => {

  const navigation = useNavigation();
  
  const imagePath = '../assets/images/'+imageName  ;

  let imageSource;
  let nextScreen;

  switch (title) {
    case 'UR10e':
      imageSource = require('../assets/images/ur10e.png');
      nextScreen = 'UR10';
      break;
    case 'NAO':
        imageSource = require('../assets/images/NAO.png');
        break;
    case 'SCORBOT':
        imageSource = require('../assets/images/SCORBOT.png');
        nextScreen = 'SCORBOT';
      break;
    case 'Turtlebot3':
      imageSource = require('../assets/images/turtlebot3_waffle.png');
      nextScreen = 'Turtlebot3';
      break;
    case 'AI_Serbot':
      imageSource = require('../assets/images/SerBot_PrimeX.png');
      nextScreen = 'AI_Serbot';
      break;
    case 'Mechanical':
      imageSource = require('../assets/images/mechanical_tool.png');
      nextScreen = 'MechanicalFacilities';
      break;
    case 'Electrical':
      imageSource = require('../assets/images/electrical_tool.png');
      nextScreen = 'ElectricalFacilities';
      break;
    case 'Space':
      imageSource = require('../assets/images/room_door.png');
      nextScreen = 'SpaceFacilities';
      break;
    // Add more cases as needed for other images
    default:
      imageSource = require('../assets/images/CRA_Logo.png');
  }

  return (
    <GestureHandlerRootView>
    <View>
    <TouchableOpacity onPress={()=>{navigation.navigate(nextScreen)}}>
      <View className='items-center text-center content-center justify-between px-2 pt-2 mx-4'>
        <Image
        className='h-20 w-20 py-2 bg-white rounded object-cover'
        source={imageSource}
        />
        <Text className='py-1' >{title}</Text>
      </View>
      </TouchableOpacity>
         
       </View>
    </GestureHandlerRootView>
  )
}

export default Card