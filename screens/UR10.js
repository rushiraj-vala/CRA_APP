
// App.js
import React, { useCallback, useRef, useState, useSharedValue, useEffect } from 'react';
import { Canvas, useFrame, useThree,  } from '@react-three/fiber/native';
import * as THREE  from 'three';
import { View,Text, TextInput, TouchableOpacity, Modal } from 'react-native';
import { debounce } from 'lodash';
import { OrthographicCamera } from '@react-three/drei/native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Icon  from 'react-native-vector-icons/MaterialIcons';
import * as ScreenOrientation from 'expo-screen-orientation';
import InverseKinematics, { newJasperIk } from './InverseKinematics';
import closeFormedIK from './closeFormedIK';
import japersIK from './InverseKinematics';
import { ceil, min, norm, pi, sqrt } from 'mathjs';
import forwarkKinmeatics from './forwarkKinmeatics';

const CameraControl = ({cameraRef,direction}) =>{
  useFrame(()=>{
    
    if(direction=='Left'){
      const xComp = cameraRef.current.position.x;
      const yComp = cameraRef.current.position.y;
      const zComp = cameraRef.current.position.z;
      // console.log('xComp:',xComp,'zComp:',zComp);
      let theta = Math.atan2(zComp,xComp);
      // const mag = Math.sqrt((xComp*xComp)+(zComp*zComp));
      const mag = Math.sqrt(xComp*xComp+zComp*zComp);
      console.log('Old Theta:',theta);
      theta -= (0.08727*2);
      let newXComp=Math.cos(theta)*mag;
      let newZComp=Math.sin(theta)*mag;
      cameraRef.current.position.x=newXComp;
      cameraRef.current.position.z=newZComp;
      cameraRef.current.position.y=yComp;
      console.log('Theta:',theta);
      // console.log('Xcomp:',newXComp);
    }
    
    if(direction=='Right'){
      const xComp = cameraRef.current.position.x;
      const yComp = cameraRef.current.position.y;
      const zComp = cameraRef.current.position.z;
      // console.log('xComp:',xComp,'zComp:',zComp);
      let theta = Math.atan2(zComp,xComp);
      // const mag = Math.sqrt((xComp*xComp)+(zComp*zComp));
      const mag = Math.sqrt(xComp*xComp+zComp*zComp);
      console.log('Old Theta:',theta);
      theta += (0.08727*2);
      let newXComp=Math.cos(theta)*mag;
      let newZComp=Math.sin(theta)*mag;
      cameraRef.current.position.x=newXComp;
      cameraRef.current.position.z=newZComp;
      cameraRef.current.position.y=yComp;
      console.log('Theta:',theta);
      // console.log('Xcomp:',newXComp);
    }
    
    if(cameraRef.current){
      // cameraRef.current.position.set(2,2,2);
      cameraRef.current.lookAt(0,0,0);
    }

  });

  return null;
};

function CustomTransformations({baseAngle,shoulderAngle,elbowAngle,wrist1Angle, wrist2Angle, wrist3Angle}) {
  const grandparentRef = useRef();
  const parentRef = useRef();
  const child1Ref = useRef();
  const child2Ref = useRef();
  const child3Ref = useRef();
  const child4Ref = useRef();
  const child5Ref = useRef();
  const child6Ref = useRef();
  
  // Update transformations in the frame loop
  useFrame(() => {
    if (grandparentRef.current && parentRef.current && child1Ref.current) {
      // Example: Set initial transformations for each level
      // Grandparent
      grandparentRef.current.position.set(0, 0.1375/2, 0);
      grandparentRef.current.rotation.set(0, baseAngle*(Math.PI/180), 0);  //(0, -Math.PI/4, 0);
      grandparentRef.current.scale.set(1, 1, 1);

      // Parent
      parentRef.current.position.set(-0.135, 0.0432, 0);
      parentRef.current.rotation.set( (Math.PI/2)+shoulderAngle*(Math.PI/180), 0, Math.PI/2);  //(-Math.PI/4, 0, Math.PI/2);
      parentRef.current.scale.set(1, 1, 1);

      // console.log('Parent Ref Pos:',parentRef.current.position);

      // Child 1 , No movement
      child1Ref.current.position.set(0.30635, 0.041, 0);
      child1Ref.current.rotation.set(0, 0, -Math.PI/2);
      child1Ref.current.scale.set(1, 1, 1);

      // Child 2
      child2Ref.current.position.set(0.0686, 0.30635, 0);
      child2Ref.current.rotation.set(elbowAngle*(Math.PI/180), 0, Math.PI/2); //(Math.PI/4,0,Math.PI/2)
      child2Ref.current.scale.set(1, 1, 1);

      // Child 3 , No Movement
      child3Ref.current.position.set(0.285775, -0.0686, 0);
      child3Ref.current.rotation.set(0, 0, -Math.PI/2);
      child3Ref.current.scale.set(1, 1, 1);
      
      // child 4
      child4Ref.current.position.set(-0.067675, 0.285775, 0);
      child4Ref.current.rotation.set((Math.PI/2)+wrist1Angle*(Math.PI/180), 0, Math.PI/2); // (Math.PI/4, 0, Math.PI/2)
      child4Ref.current.scale.set(1, 1, 1);
      
      // child 5
      child5Ref.current.position.set(0.043, 0.067675, 0);
      child5Ref.current.rotation.set(wrist2Angle*(Math.PI/180), 0, -Math.PI/2); // (Math.PI/4, 0, Math.PI/2)
      child5Ref.current.scale.set(1, 1, 1);
      
      // child 6
      child6Ref.current.position.set(-0.037825, 0.131, 0);
      child6Ref.current.rotation.set(wrist3Angle*(Math.PI/180), 0, Math.PI/2); // (Math.PI/4, 0, Math.PI/2)
      child6Ref.current.scale.set(1, 1, 1);

    }
  });

  return (
    <group ref={grandparentRef}>
      {/* Grandparent Cylinder */}
      <mesh>
        <cylinderGeometry args={[0.075, 0.075, 0.275, 32]} />
        <meshStandardMaterial color="red" />

        {/* Parent Cylinder */}
        <group ref={parentRef}>
          <mesh>
            <cylinderGeometry args={[0.075, 0.075, 0.270, 32]} />
            <meshStandardMaterial color="green" />

            {/* Child Cylinder */}
            <group ref={child1Ref}>
              <mesh>
                <cylinderGeometry args={[0.055, 0.055, 0.6127, 32]} />
                <meshStandardMaterial color="blue" />
              </mesh>

                  {/* Child 2 Cylinder */}
                  <group ref={child2Ref}>
                    <mesh>
                      <cylinderGeometry args={[0.058, 0.058, 0.2792, 32]} />
                      <meshStandardMaterial color="yellow" />
                    </mesh>

                        {/* Child 3 Cylinder */}
                        <group ref={child3Ref}>
                          <mesh>
                            <cylinderGeometry args={[0.0475, 0.0475, 0.57155, 32]} />
                            <meshStandardMaterial color="violet" />
                          </mesh>
                          
                            {/* Child 4 Cylinder */}
                              <group ref={child4Ref}>
                                <mesh>
                                  <cylinderGeometry args={[0.045, 0.045, 0.13535, 32]} />
                                  <meshStandardMaterial color="orange" />
                                </mesh>

                                {/* Child 5 Cylinder */}
                                  <group ref={child5Ref}>
                                    <mesh>
                                      <cylinderGeometry args={[0.045, 0.045, 0.176, 32]} />
                                      <meshStandardMaterial color="indigo" />
                                    </mesh>

                                  {/* Child 6 Cylinder */}
                                    <group ref={child6Ref}>
                                      <mesh>
                                        <cylinderGeometry args={[0.045, 0.045, 0.176, 32]} />
                                        <meshStandardMaterial color="cyan" />
                                      </mesh>
                                    </group>
                                  </group>
                              </group>
                        </group>
                  </group>
            </group>
          </mesh>
        </group>
      </mesh>
    </group>
  );
}


function TargetOrb({targetRef,X,Y,Z}) {
  const target = targetRef;
  
  // Update transformations in the frame loop
  useFrame(() => {
    if (target.current) {
      target.current.position.set(parseFloat(Y)/1000, parseFloat(Z)/1000, parseFloat(X)/1000);
      target.current.rotation.set(0, 0, 0);  
      target.current.scale.set(1, 1, 1);

    }
  });

  return (
    <group ref={target}>
      {/* Grandparent Cylinder */}
      <mesh>
        <sphereGeometry args={[0.05,16,16]} />
        <meshStandardMaterial color="red" />
      </mesh>
    </group>
  );
}


function App() {
  useEffect(()=>{
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);

    return () =>{
      ScreenOrientation.unlockAsync();
    };

  },[]);

  const cameraRef = useRef();

  const targetOrbRef = useRef();

  const intervalRef = useRef(null);

  const[currTouchX,setCurrTouchX] = useState(0);
  const[startTouchX,setStartTouchX] = useState(0);
  const[direction,setDirection]=useState('');
  const[isVisible,setIsVisible]=useState(false);
  const[selectedTcpMenu,setSelectedTcpMenu]=useState('tcp_Pos');
  const[selectedInputMenu,setSelectedInputMenu]=useState('ANGLE_INPUT');

  const[angle1,setAngle1]=useState('0');
  const[angle2,setAngle2]=useState('-90');
  const[angle3,setAngle3]=useState('0');
  const[angle4,setAngle4]=useState('-90');
  const[angle5,setAngle5]=useState('0');
  const[angle6,setAngle6]=useState('0');

  const[tcpX,setTcpX]=useState('0');
  const[tcpY,setTcpY]=useState('-291');
  const[tcpZ,setTcpZ]=useState('1483');
  const[tcpRX,setTcpRX]=useState('-90');
  const[tcpRY,setTcpRY]=useState('0');
  const[tcpRZ,setTcpRZ]=useState('0');
  
  const baseAngle = parseInt(angle1) || 0;
  const shoulderAngle = parseInt(angle2) || 0;
  const elbowAngle = parseInt(angle3) || 0;
  const wrist1Angle = parseInt(angle4) || 0;
  const wrist2Angle = parseInt(angle5) || 0;
  const wrist3Angle = parseInt(angle6) || 0;

  const handleTextChangeAngle=(inputText,inputId)=>{
    if(inputId==='angle1'){
      setAngle1(inputText);
    }else if(inputId==='angle2'){
      setAngle2(inputText);
    }else if(inputId==='angle3'){
      setAngle3(inputText);
    }else if(inputId==='angle4'){
      setAngle4(inputText);
    }else if(inputId==='angle5'){
      setAngle5(inputText);
    }else if(inputId==='angle6'){
      setAngle6(inputText);
    }else if(inputId==='tcpX'){
      setTcpX(inputText)
    }else if(inputId==='tcpY'){
      setTcpY(inputText)
    }else if(inputId==='tcpZ'){
      setTcpZ(inputText)
    }else if(inputId==='tcpRX'){
      setTcpRX(inputText)
    }else if(inputId==='tcpRY'){
      setTcpRY(inputText)
    }else if(inputId==='tcpRZ'){
      setTcpRZ(inputText)
    }
  }

  const debounceHandleTextChange = useCallback(
    debounce(handleTextChangeAngle,1500),
    []
  );

  const handleTouchStart =(event)=>{
    const touch = event.nativeEvent;
    const { pageX, pageY } = touch;
    setStartTouchX(pageX);
    console.log('Touch started at',pageX,pageY);
  };

  const handleTouchMove =(event)=>{
    const touch = event.nativeEvent;
    const { pageX, pageY } = touch;
    setCurrTouchX(pageX);
    const direc = currTouchX - startTouchX;
    // console.log('Touch at:',pageX,pageY);
    if (direc<0){
      setDirection('Left');
      console.log('Left');
    }else if(direc>0){
      setDirection('Right');
      console.log('Right');
    }
  };

  const handleTouchEnd = (event)=>{
    console.log('touch ended')
    setDirection('')
  };

  const handleVisible=(event)=>{
    setIsVisible(!isVisible); 
  };

  const handleTcpMenu=(menuName)=>{
    setSelectedTcpMenu(menuName);
  };

  const handleInputMenu=(menuName)=>{
    setSelectedInputMenu(menuName);
  };

  const handleOrbMovePressIn=(direction)=>{

    intervalRef.current= setInterval(()=>{
      if(direction==='up'){
        setTcpZ(prev =>(parseFloat(prev)+50).toString())
      }else if(direction==='down'){
        setTcpZ(prev =>(parseFloat(prev)-50).toString())
      }else if(direction==='left'){
        setTcpX(prev =>(parseFloat(prev)+50).toString())
      }else if(direction==='right'){
        setTcpX(prev =>(parseFloat(prev)-50).toString())
      }else if(direction==='forward'){
        setTcpY(prev =>(parseFloat(prev)+50).toString())
      }else if(direction==='backward'){
        setTcpY(prev =>(parseFloat(prev)-50).toString())
      }
    },500);
  }

  const handleOrbMovePressOut=()=>{
    if (intervalRef.current){
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // closeFormedIK();



  const moveActuator=(direction)=>{
    /**
     * Function takes the current position of end effector and 
     * moves it a litte in direciton that is desire, 
     * But first check if it is within reach: UR10e has 1300 mm reach
     * calculate all the posible 8 states, and find which one is the nearest to current state
     * To make motion smooth make the robot move in that direction for
     *    a Long press:  a large definite step, animate to target postion, stop if reach or press-up in that case retain last angle positions
     *    a short press: move a very small step
     */   

    // Need current move current state
    let currentAngles = [angle1,angle2,angle3,angle4,angle5,angle6]
    let currentTransf = [tcpX,tcpY,tcpZ,tcpRX,tcpRY,tcpRZ]

    currentAngles = currentAngles.map(item=>parseFloat(item));
    currentTransf = currentTransf.map(item=>parseFloat(item));

    let targetTransf = currentTransf;

    console.log('Prev Target:',targetTransf);
    switch (direction) {
      case 'up':
            // Either moving up
            targetTransf[2]+=50;  
            break;
      case 'down':
            // Either moving up
            targetTransf[2]-=50;  
            break;
      case 'left':
            // Either moving up
            targetTransf[1]+=50;  
            break;
      case 'right':
            // Either moving up
            targetTransf[1]-=50;  
            break;
      case 'forward':
            // Either moving up
            targetTransf[0]+=50;  
            break;
      case 'backward':
            // Either moving up
            targetTransf[0]-=50;  
            break;    
      default:
        break;
    }


    console.log('Target:',targetTransf);

    console.log('Target norm:',norm([targetTransf[0],targetTransf[1],targetTransf[2]]))

    //Check if the target
    if(norm([targetTransf[0],targetTransf[1],targetTransf[2]])>1520){
      console.log('Target pos out of reach')
      return;
    }
    
    x = targetTransf[0]/1000;
    y = targetTransf[1]/1000;
    z = targetTransf[2]/1000;

    ikAngles = newJasperIk([x,y,z,-90.0,0.0,-180])

    // Go through each result and find the nearest solution to true value
    bestResult = []
    bestDistance = Infinity;
    bestTransf = [];

    
    for(i=0;i<8;i++){
      let result = ikAngles[i].map(value => ceil(value*100)/100);
      
      let newTransf = forwarkKinmeatics(result);
      
      let targetDistance = sqrt((x-newTransf[0])*(x-newTransf[0]) + (y-newTransf[1])*(y-newTransf[1]) + (z-newTransf[2])*(z-newTransf[2]));
      
      if(targetDistance<bestDistance){
        bestResult=result;
        bestDistance = targetDistance;
        bestTransf = newTransf;
      }      
      
    }

    let result = ikAngles[7].map(value => ceil(value*100)/100);
    
    // Set Angles
    setAngle1(result[0].toString());
    setAngle2(result[1].toString());
    setAngle3(result[2].toString());
    setAngle4(result[3].toString());
    setAngle5(result[4].toString());
    setAngle6(result[5].toString());

    // Set TCP
    setTcpX((bestTransf[0]*1000).toString());
    setTcpY((bestTransf[1]*1000).toString());
    setTcpZ((bestTransf[2]*1000).toString());
    setTcpRX(bestTransf[3].toString());
    setTcpRY(bestTransf[4].toString());
    setTcpRZ(bestTransf[5].toString());

  }


  return (
    // <GestureHandlerRootView style={{flex:1 }} >
    //   <GestureDetector gesture={panGesture} >
      <>
      <View className=" flex-row h-10 bg-blue-200 align-middle items-center justify-around" >
        <Text className='m-2 bg-inherit align-middle self-center text-lg' >Connected to Virtual Device</Text>
        <TouchableOpacity className='w-12 items-center' onPress={handleVisible} ><Icon name='edit' size={30} color='#900' className='m-2 center' /></TouchableOpacity>
      </View>

      {/* Main column View */}
      <View className='flex flex-1 flex-row h-full mb-2'>

        {/* Left Pane */}
          <View className='bg-white flex-col w-1/4  justify-normal border-r-2 border-cyan-500'> 
            <View id='tcp_menu' className='flex-row' >
              <TouchableOpacity className='flex-1 bg-red-200' onPress={()=>{handleTcpMenu('tcp_Pos')}}>
                <Text className='text-center text-base' >Pos</Text>    
              </TouchableOpacity>
              <TouchableOpacity className='flex-1 bg-green-200' onPress={()=>{handleInputMenu('tcp_Orn')}} >
                <Text className='text-center text-base' >Orn</Text>  
              </TouchableOpacity>
            </View>
            <View className='flex-1 bg-white' >
              {selectedTcpMenu==='tcp_Pos' && (
                <View id='posCon' className='flex-1 flex-col'>
                  <View id='posConRow1' className='flex-1 flex-row mt-2'>
  
                    <TouchableOpacity className='flex-1 btransparent'>
                      {/* <Text>1</Text> */}
                    <Icon name='arrow-downward' size={55} color='#00B2FF' className='h-full w-full' onPress={()=>{moveActuator('up')}} onTouchStart={()=>{handleOrbMovePressIn('down')}} onTouchEnd={()=>{handleOrbMovePressOut()}} />
                    </TouchableOpacity>
  
                    <TouchableOpacity className='flex-1 bg-transparent'>
                      {/* <Text>2</Text> */}
                    </TouchableOpacity>

                    <TouchableOpacity className='flex-1 bg-transparent'>
                      {/* <Text>3</Text> */}
                      <Icon name='arrow-upward' size={55} color='#00B2FF' className='h-full w-full' onPress={()=>{moveActuator('down')}} onTouchStart={()=>{handleOrbMovePressIn('up')}} onTouchEnd={()=>{handleOrbMovePressOut()}} />
                    </TouchableOpacity>
                  </View>

                  <View id='posConRow2' className='flex-1 flex-row'>
                    <TouchableOpacity className='flex-1 bg-transparent'>
                      {/* <Text>4</Text> */}
                    </TouchableOpacity>

                    <TouchableOpacity className='flex-1 bg-transparent justify-center items-center rotate-90'>
                      {/* <Text>5</Text> */}
                      <Icon name='arrow-circle-left' size={55} color='#00B2FF' className='h-full w-full' onPress={()=>{moveActuator('forward')}} onTouchStart={()=>{handleOrbMovePressIn('forward')}} onTouchEnd={()=>{handleOrbMovePressOut()}} />
                    </TouchableOpacity>

                    <TouchableOpacity className='flex-1 bg-transparent'>
                    {/* <Text>6</Text> */}
                    </TouchableOpacity>
                  </View>

                  <View id='posConRow3' className='flex-1 flex-row'>
                    <TouchableOpacity className='flex-1 bg-transparent'>
                      {/* <Text>7</Text> */}
                      <Icon name='arrow-circle-left' size={55} color='#00B2FF' className='h-full w-full' onPress={()=>{moveActuator('left')}} onTouchStart={()=>{handleOrbMovePressIn('left')}} onTouchEnd={()=>{handleOrbMovePressOut()}} />
                    </TouchableOpacity>

                    <TouchableOpacity className='flex-1 bg-transparent'>
                      {/* <Text>8</Text> */}
                    </TouchableOpacity>

                    <TouchableOpacity className='flex-1 bg-transparent'>
                      {/* <Text>9</Text> */}
                      <Icon name='arrow-circle-right' size={55} color='#00B2FF' className='h-full w-full' onPress={()=>{moveActuator('right')}} onTouchStart={()=>{handleOrbMovePressIn('right')}} onTouchEnd={()=>{handleOrbMovePressOut()}}/>
                    </TouchableOpacity>
                  </View>

                  <View id='posConRow4' className='flex-1 flex-row'>
                    <TouchableOpacity className='flex-1 bg-transparent'>
                      {/* <Text>10</Text> */}
                    </TouchableOpacity>
  
                    <TouchableOpacity className='flex-1 flex-row bg-transparent justify-center items-center rotate-90'>
                      {/* <Text>11</Text> */}
                      <Icon name='arrow-circle-right' size={55} color='#00B2FF' className='h-full w-full' onPress={()=>{moveActuator('backward')}} onTouchStart={()=>{handleOrbMovePressIn('backward')}} onTouchEnd={()=>{handleOrbMovePressOut()}}/>
                    </TouchableOpacity>
  
                    <TouchableOpacity className='flex-1 bg-transparent'>
                      {/* <Text>12</Text> */}
                    </TouchableOpacity>
                  </View>
                </View>
                )}
              {selectedTcpMenu==='tcp_Orn'&& (<Text>Orientation Control</Text>)}
            </View>
          </View>

        {/* Middle Pane */}
          <View className='bg-gray-500 flex-1 justify-center'> 
            {/* <Text className=' bg-green-300  text-center' >3D Scene</Text> */}

             {/*Canvas */}
                
              
                    <Canvas className='z-0' onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd} col>
                      <OrthographicCamera makeDefault zoom={80} position={[25,25,25]} ref={cameraRef}/>
                      <CameraControl cameraRef={cameraRef} direction={direction} />
                      <ambientLight intensity={1} />
                      <gridHelper args={[2,5,'white','gray']} className="z-1"/>
                      <CustomTransformations baseAngle={angle1} shoulderAngle={angle2} elbowAngle={angle3} wrist1Angle={angle4} wrist2Angle={angle5} wrist3Angle={angle6} className="z-2" />
                    
                      <TargetOrb targetRef={targetOrbRef} X={tcpX} Y={tcpY} Z={tcpZ} />
                    </Canvas>
             
               
          </View>

        {/* Right Pane */}
        <View className="h-full flex bg-white flex-col border-l-2 border-cyan-500 justify-stretch">
        <View id='input_menu' className='flex-row' >
              <TouchableOpacity className='flex-1 bg-red-200' onPress={()=>{handleInputMenu('ANGLE_INPUT')}}>
                <Text className='text-center text-base' >Angles</Text>    
              </TouchableOpacity>
              <TouchableOpacity className='flex-1 bg-green-200' onPress={()=>{handleInputMenu('TCP_INPUT')}} >
                <Text className='text-center text-base' >TCP</Text>  
              </TouchableOpacity>
            </View>

          {/* Angle Control Input */}
        {selectedInputMenu=="ANGLE_INPUT" &&(
          <View id='column1' className=" bg-white flex-1 flex-col m-3 mb-1 justify-around">
          <View id="col1row1" className=" bg-inherit flex-row items-center m-1 align-middle ">
            <Text className="w-20 h-7 pl-1 text-base font-medium bg-cyan-500 text-white ">Base</Text>
            <TextInput keyboardType='number-pad' placeholder={angle1} onChangeText={(text)=>{debounceHandleTextChange(text,'angle1')}} className="w-20 h-7 bg-sky-50 ml-2 justify-center text-center text-cyan-500  font-medium border border-cyan-500"/>
          </View>
          <View id="col1row2" className=" bg-inherit flex-row items-center m-1 align-middle">
            <Text className="w-20 h-7 pl-1 text-base font-medium bg-cyan-500 text-white ">Shoulder</Text>
            <TextInput keyboardType='number-pad' placeholder={angle2} onChangeText={(text)=>{debounceHandleTextChange(text,'angle2')}} className="w-20 bg-sky-50 ml-2 justify-center text-center text-cyan-500  font-medium border border-cyan-500"/>
          </View>
          <View id="col1row3" className="bg-inherit flex-row items-center m-1" align-middle>
            <Text className="w-20 h-7 pl-1 text-base font-medium bg-cyan-500 text-white">Elbow</Text>
            <TextInput keyboardType='number-pad' placeholder={angle3} onChangeText={(text)=>{debounceHandleTextChange(text,'angle3')}} className="w-20 bg-sky-50 ml-2 justify-center text-center text-cyan-500  font-medium border border-cyan-500"/>
          </View>
          <View id="col2row1" className=" bg-inherit flex-row items-center m-1 align-middle">
            <Text className="w-20 h-7 pl-1 text-base font-medium bg-cyan-500 text-white">Wrist 1</Text>
            <TextInput keyboardType='number-pad' placeholder={angle4} onChangeText={(text)=>{debounceHandleTextChange(text,'angle4')}} className="w-20 bg-sky-50 ml-2 justify-center text-center text-cyan-500  font-medium border border-cyan-500"/>
          </View>
          <View id="col2row2" className="bg-inherit flex-row items-center m-1" align-middle>
            <Text className="w-20 h-7 pl-1 text-base font-medium bg-cyan-500 text-white">Wrist 2</Text>
            <TextInput keyboardType='number-pad' placeholder={angle5} onChangeText={(text)=>{debounceHandleTextChange(text,'angle5')}} className="w-20 bg-sky-50 ml-2 justify-center text-center text-cyan-500  font-medium border border-cyan-500"/>
          </View>
          <View id="col2row3" className=" bg-inherit flex-row items-center m-1 align-middle">
            <Text className="w-20 h-7 pl-1 text-base font-medium bg-cyan-500 text-white">Wrist 3</Text>
            <TextInput keyboardType='number-pad' placeholder={angle6} onChangeText={(text)=>{debounceHandleTextChange(text,'angle6')}} className="w-20 bg-sky-50 ml-2 justify-center text-center text-cyan-500  font-medium border border-cyan-500"/>
          </View>
        </View>

        )}

        {selectedInputMenu=="TCP_INPUT"&&(
          <View id='column1' className=" bg-white flex-1 flex-col m-3 mb-1 justify-around">
          <View id="col1row1" className=" bg-inherit flex-row items-center m-1 align-middle ">
            <Text className="w-20 h-7 pl-1 text-base font-medium bg-cyan-500 text-white ">X</Text>
            <TextInput keyboardType='number-pad' placeholder={tcpX} onChangeText={(text)=>{debounceHandleTextChange(text,'tcpX')}} className="w-20 h-7 bg-sky-50 ml-2 justify-center text-center text-cyan-500  font-medium border border-cyan-500"/>
          </View>
          <View id="col1row2" className=" bg-inherit flex-row items-center m-1 align-middle">
            <Text className="w-20 h-7 pl-1 text-base font-medium bg-cyan-500 text-white ">Y</Text>
            <TextInput keyboardType='number-pad' placeholder={tcpY} onChangeText={(text)=>{debounceHandleTextChange(text,'tcpY')}} className="w-20 bg-sky-50 ml-2 justify-center text-center text-cyan-500  font-medium border border-cyan-500"/>
          </View>
          <View id="col1row3" className="bg-inherit flex-row items-center m-1" align-middle>
            <Text className="w-20 h-7 pl-1 text-base font-medium bg-cyan-500 text-white">Z</Text>
            <TextInput keyboardType='number-pad' placeholder={tcpZ} onChangeText={(text)=>{debounceHandleTextChange(text,'tcpZ')}} className="w-20 bg-sky-50 ml-2 justify-center text-center text-cyan-500  font-medium border border-cyan-500"/>
          </View>
          <View id="col2row1" className=" bg-inherit flex-row items-center m-1 align-middle">
            <Text className="w-20 h-7 pl-1 text-base font-medium bg-cyan-500 text-white">RX</Text>
            <TextInput keyboardType='number-pad' placeholder={tcpRX} onChangeText={(text)=>{debounceHandleTextChange(text,'tcpRX')}} className="w-20 bg-sky-50 ml-2 justify-center text-center text-cyan-500  font-medium border border-cyan-500"/>
          </View>
          <View id="col2row2" className="bg-inherit flex-row items-center m-1" align-middle>
            <Text className="w-20 h-7 pl-1 text-base font-medium bg-cyan-500 text-white">RY</Text>
            <TextInput keyboardType='number-pad' placeholder={tcpRY} onChangeText={(text)=>{debounceHandleTextChange(text,'tcpRY')}} className="w-20 bg-sky-50 ml-2 justify-center text-center text-cyan-500  font-medium border border-cyan-500"/>
          </View>
          <View id="col2row3" className=" bg-inherit flex-row items-center m-1 align-middle">
            <Text className="w-20 h-7 pl-1 text-base font-medium bg-cyan-500 text-white">RZ</Text>
            <TextInput keyboardType='number-pad' placeholder={tcpRZ} onChangeText={(text)=>{debounceHandleTextChange(text,'tcpRZ')}} className="w-20 bg-sky-50 ml-2 justify-center text-center text-cyan-500  font-medium border border-cyan-500"/>
          </View>
        </View>          
        )}
        </View>

        <Modal
        transparent={true}
        animationType='slide'
        visible={isVisible}
        >
          <View className='flex flex-col top-3/4 h-1/4 w-full bg-white items-center align-middle'>
          <View className='flex flex-row bg-blue-100 h-full w-full items-center' >
            <View className='flex h-10 w-1/6 align-middle justify-center' >
              <Text className=' text-center  text-lg  font-bold' >Robot's IP</Text>
            </View>
            <TextInput className=' w-1/5 h-10 bg-white text-center text-lg' defaultValue='192.168.1.1'></TextInput>
            
            <View className='flex h-10 w-1/6 align-middle justify-center' >
              <Text className='text-center  text-lg font-bold ' >Port</Text>
            </View>
          
            <TextInput className='h-10 w-1/5 bg-white text-center text-lg' defaultValue='6754'></TextInput>

            <TouchableOpacity 
            className=' ml-16  bg-green-300 p-2  items-center rounded-full' 
            onPress={handleVisible} >
                <Icon name='link' size={30} color='#100' className='m-1' />
            </TouchableOpacity>

           </View>

          {/* <View className='flex h-10 w-full align-middle justify-center' >
            <Text className=' text-center  text-lg  font-bold' >Robot's IP</Text>
          </View>
        
          <TextInput className=' h-10 w-full text-center text-lg border-blue-300 border-2 rounded-xl' defaultValue='192.168.1.1'></TextInput>
        
          <View className='flex h-10 w-full align-middle justify-center' >
            <Text className='text-center  text-lg font-bold ' >Port</Text>
          </View>
        
          <TextInput className='h-10 w-full text-center text-lg border-2 border-blue-300 rounded-xl' defaultValue='6754'></TextInput>
        
          <TouchableOpacity 
            className=' mt-6 w-ful bg-sky-300 p-6  items-center rounded-full' 
            onPress={handleVisible} >
                <Icon name='link' size={50} color='#100' className='m-2' />
            </TouchableOpacity> */}
        
        </View>
        </Modal>
      </View>

    </>
    // </GestureDetector>
    // </GestureHandlerRootView>
  );
}


export default App;




