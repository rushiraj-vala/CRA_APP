import { View, Text, TouchableOpacity, Modal } from 'react-native'
import React, { useState } from 'react'
import { FlatList } from 'react-native-gesture-handler'
import FacilitiesCard from '../components/FacilitiesCard'

const MechanicalFacilities = () => {
  // const facilitiesName = [
  //   'Penumatic Trainer Kit',
  //   'Hydraulic Trainer Kit',
  //   'PLC Trainer Kit',
  //   'Degasifier',
  // ]
  // return (
  //   <View>
  //     <FlatList numColumns={2}
  //       className='m-1 self-center'
  //       data={facilitiesName}
  //       renderItem={({item})=>(
  //           <FacilitiesCard name={item} />
  //       )}
  //     />
  //   </View>
  // )

  const [showModal,setShowModal] = useState(false)

  const handlePress = () => {
    // Log information when TouchableOpacity is pressed

    setShowModal(showModal => !showModal);
  };

  return (
    <View>
    <View>
      <TouchableOpacity onPress={()=>handlePress()}>
        <Text>Press me</Text>
      </TouchableOpacity>
    </View>

    <Modal visible={showModal} animationType='slide' >
    <TouchableOpacity onPress={()=>handlePress()}>
        <Text>Exit me</Text>
      </TouchableOpacity>
    </Modal>

    </View>
  );
}

export default MechanicalFacilities;