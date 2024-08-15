import { View, Text, Button } from 'react-native'
import React from 'react'

const Details = ({navigation}) => {
  return (
    <View className='flex-1 items-center justify-center'>
      <Text className='text-red-500 text-lg' >Details Screen</Text>
      <Button
        title='Go to Details...again'
        onPress={()=>navigation.navigate('Details')}
      />
    </View>
  )
}

export default Details