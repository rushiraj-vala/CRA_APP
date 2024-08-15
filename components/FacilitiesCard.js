import { View, Text, Modal } from 'react-native'
import React, { useState } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'

const FacilitiesCard = ({name}) => {
  const [showModal, setShowModal] = useState(false);

  const handlePress = () => {
    // Log information when TouchableOpacity is pressed
    console.warn('TouchableOpacity pressed!');
  };

  return (
    <View>
      <TouchableOpacity onPress={()=>handlePress()}>
        <Text>Press me</Text>
      </TouchableOpacity>
    </View>
  );
}

export default FacilitiesCard