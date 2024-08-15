import { View, Text, Button, ScrollView, Image } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Card from '../components/card'
import { useNavigation } from '@react-navigation/native'

const HomeScreen = () => {
    const navigation  = useNavigation();
    const RobotNames=[
        'UR10e',
        'NAO',
        'Turtlebot3',
        'AI_Serbot'
    ]

    const facilitiesName = [
        'Mechanical',
        'Electrical',
        'Space',
    ]

    const inventoryName = [
        'Sensors',
        'Boards',
        'Training kits',
        'Power supply',
        'Micro Controller',
        'SBC',
    ]

  return (
    // Main view
    <SafeAreaView>

    <View>
        {/* Create scroll view  */}
        <ScrollView 
        horizontal={false}
        >
        
        {/* Title Row */}
        <View className='flex-row items-center justify-evenly bg-white pt-2 pb-2'>
            {/* First Column */}
            <View>
                <Text className='text-gray-500 text-base' >welcome to </Text>
                <Text className='text-gray-800 text-lg' >Centre for Robotics and Automation</Text>
            </View>
            <Image
            className='h-20 w-20 bg-white rounded'
            source={require('../assets/images/CRA_Logo.png')}
            />
        </View>

        {/* Second Row */}
        <View>
            <View className='flex-row items-center justify-evenly mt-2 px-4 bg-white'>
                <Text className='flex-1 font-bold text-lg' >Robots</Text>
                <Text className='font-bold text-gray-300 text-lg' >see all</Text>
            </View>

            <ScrollView
            horizontal={true}
            className='bg-white py-2 px-5'
            >
            {RobotNames.map((item,index)=>(
                <Card
                key={index}
                title={item}
                imageName={RobotNames[index]}
                />
                ))}
            </ScrollView>
        </View>

        {/* Third Row */}
        <View>
            <View className='flex-row items-center justify-evenly mt-2 px-4 bg-white'>
                <Text className='flex-1 font-bold text-lg' >Facilities</Text>
                <Text className='font-bold text-gray-300 text-lg' >see all</Text>
            </View>
            
            <ScrollView
            horizontal={true}
            className='bg-white py-2 px-5'
            >
            {facilitiesName.map((item,index)=>(
                <Card
                key={index}
                 title={item}
                 imageName={facilitiesName[index]}
                />
            ))}
            </ScrollView>

        </View>

        {/* Fourth Row */}
        <View>
            <View className='flex-row items-center justify-evenly mt-2 px-4 bg-white'>
                <Text className='flex-1 font-bold text-lg' >Inventory</Text>
                <Text className='font-bold text-gray-300 text-lg' >see all</Text>
            </View>
            
            <ScrollView
            horizontal={true}
            className='bg-white py-2 px-5'
            >
            {facilitiesName.map((item,index)=>(
                <Card
                key={index}
                 title={item}
                 imageName={facilitiesName[index]}
                />
            ))}
            </ScrollView>

        </View>
        
        </ScrollView>
    </View>
    </SafeAreaView>
  )
}

export default HomeScreen