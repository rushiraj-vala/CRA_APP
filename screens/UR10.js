
// App.js
import React, { useCallback, useRef, useState, useSharedValue, useEffect } from 'react';
import { Canvas, useFrame, useThree,  } from '@react-three/fiber/native';
import * as THREE  from 'three';
import { View,Text, TextInput, TouchableOpacity, Modal } from 'react-native';
import { debounce } from 'lodash';
import { OrthographicCamera } from '@react-three/drei/native';
import Icon  from 'react-native-vector-icons/MaterialIcons';
import * as ScreenOrientation from 'expo-screen-orientation';
import { newJasperIk } from './InverseKinematics';
import { abs, boolean, ceil, isString, min, norm, pi, sqrt } from 'mathjs';
import forwarkKinmeatics from './forwarkKinmeatics';
import { Thread } from "react-native-parallel";


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

function CustomTransformations({baseRef,link1Ref,link2Ref,link3Ref,link4Ref,link5Ref,link6Ref,link7Ref,baseAngle,shoulderAngle,elbowAngle,wrist1Angle, wrist2Angle, wrist3Angle,targetAngle1,targetAngle2,targetAngle3,targetAngle4,targetAngle5,targetAngle6, setAngle1,setAngle2,setAngle3,setAngle4,setAngle5,setAngle6, isMoving, setIsMoving, isStopping, setIsStopping}) {

  const grandparentRef = baseRef;
  const parentRef = link1Ref;
  const child1Ref = link2Ref;
  const child2Ref = link3Ref;
  const child3Ref = link4Ref;
  const child4Ref = link5Ref;
  const child5Ref = link6Ref;
  const child6Ref = link7Ref;

  baseAngle = baseAngle*(Math.PI/180);  
  shoulderAngle = shoulderAngle*(Math.PI/180);
  elbowAngle =  elbowAngle*(Math.PI/180);
  wrist1Angle = wrist1Angle*(Math.PI/180);
  wrist2Angle = wrist2Angle*(Math.PI/180);
  wrist3Angle = wrist3Angle*(Math.PI/180)

  const lastAngle1 = useRef(0);
  const lastAngle2 = useRef(0);
  const lastAngle3 = useRef(0);
  const lastAngle4 = useRef(0);
  const lastAngle5 = useRef(0);
  const lastAngle6 = useRef(0);

  let hasReachAngle1 = false;
  let hasReachAngle2 = false;
  let hasReachAngle3 = false;
  let hasReachAngle4 = false;
  let hasReachAngle5 = false;
  let hasReachAngle6 = false;

  // Update transformations in the frame loop
  useEffect(() => {
    if (grandparentRef.current && parentRef.current && child1Ref.current) {

      // Example: Set initial transformations for each level
    // Grandparent
    grandparentRef.current.position.set(0, 0.1375/2, 0);
    grandparentRef.current.rotation.set(0, baseAngle, 0);  //(0, -Math.PI/4, 0);
    grandparentRef.current.scale.set(1, 1, 1);

    // Parent
    parentRef.current.position.set(-0.135, 0.0432, 0);
    parentRef.current.rotation.set( (Math.PI/2)+shoulderAngle, 0, Math.PI/2);  //(-Math.PI/4, 0, Math.PI/2);
    parentRef.current.scale.set(1, 1, 1);

    // console.log('Parent Ref Pos:',parentRef.current.position);

    // Child 1 , No movement
    child1Ref.current.position.set(0.30635, 0.041, 0);
    child1Ref.current.rotation.set(0, 0, -Math.PI/2);
    child1Ref.current.scale.set(1, 1, 1);

    // Child 2
    child2Ref.current.position.set(0.0686, 0.30635, 0);
    child2Ref.current.rotation.set(elbowAngle, 0, Math.PI/2); //(Math.PI/4,0,Math.PI/2)
    child2Ref.current.scale.set(1, 1, 1);

    // Child 3 , No Movement
    child3Ref.current.position.set(0.285775, -0.0686, 0);
    child3Ref.current.rotation.set(0, 0, -Math.PI/2);
    child3Ref.current.scale.set(1, 1, 1);
    
    // child 4
    child4Ref.current.position.set(-0.067675, 0.285775, 0);
    child4Ref.current.rotation.set((Math.PI/2)+wrist1Angle, 0, Math.PI/2); // (Math.PI/4, 0, Math.PI/2)
    child4Ref.current.scale.set(1, 1, 1);
    
    // child 5
    child5Ref.current.position.set(0.043, 0.067675, 0);
    child5Ref.current.rotation.set(wrist2Angle, 0, -Math.PI/2); // (Math.PI/4, 0, Math.PI/2)
    child5Ref.current.scale.set(1, 1, 1);
    
    // child 6
    child6Ref.current.position.set(-0.037825, 0.131, 0);
    child6Ref.current.rotation.set(wrist3Angle, 0, Math.PI/2); // (Math.PI/4, 0, Math.PI/2)
    child6Ref.current.scale.set(1, 1, 1);

  }


   });

  useFrame(()=>{

    if(isMoving==true && isStopping==false){
           // Angle 1
          if(baseAngle != targetAngle1){
            grandparentRef.current.rotation.y = THREE.MathUtils.lerp(grandparentRef.current.rotation.y,targetAngle1,0.05);
            lastAngle1.current = grandparentRef.current.rotation.y;
            // setAngle1((grandparentRef.current.rotation.y*(180/Math.PI)).toString());
              if(abs((targetAngle1)-grandparentRef.current.rotation.y)<0.01){
                // setAngle1((targetAngle1*(180/Math.PI)).toString());
                baseAngle = targetAngle1;
                lastAngle1.current = targetAngle1;
                }
          }else{
            grandparentRef.current.rotation.y = targetAngle1;
            lastAngle1.current = targetAngle1;
            hasReachAngle1 = true;
          }
    
          // Angle 2

          if(shoulderAngle != targetAngle2){
            parentRef.current.rotation.x = THREE.MathUtils.lerp(parentRef.current.rotation.x,targetAngle2+Math.PI/2,0.05);
            lastAngle2.current = parentRef.current.rotation.x;
            if(abs((targetAngle2+Math.PI/2)-parentRef.current.rotation.x)<0.01){
              shoulderAngle = targetAngle2;
              lastAngle2.current = targetAngle2+Math.PI/2;
            }
          }else{
            parentRef.current.rotation.x = targetAngle2 +Math.PI/2;
            lastAngle2.current = targetAngle2+Math.PI/2;
            hasReachAngle2 = true;
          }

          // Angle 3
    
          if(elbowAngle != targetAngle3){
            // setAngle3((child2Ref.current.rotation.y*(180/Math.PI)).toString());
            child2Ref.current.rotation.x = THREE.MathUtils.lerp(child2Ref.current.rotation.x,targetAngle3,0.05);
            lastAngle3.current = child2Ref.current.rotation.x;
            if(abs((targetAngle3)-child2Ref.current.rotation.x)<0.01){
              elbowAngle = targetAngle3;
              lastAngle3.current = targetAngle3;
            }
          }else{
            child2Ref.current.rotation.x = targetAngle3;
            lastAngle3.current = targetAngle3;
            hasReachAngle3 = true;
          }

          // Angle 4
    
          if(wrist1Angle != targetAngle4){
            // setAngle4((child4Ref.current.rotation.y*(180/Math.PI)).toString());
            child4Ref.current.rotation.x = THREE.MathUtils.lerp(child4Ref.current.rotation.x,targetAngle4+Math.PI/2,0.05);
            lastAngle4.current = child4Ref.current.rotation.x;          
            if(abs((targetAngle4+Math.PI/2)-child4Ref.current.rotation.x)<0.01){
              wrist1Angle = targetAngle4;
              lastAngle4.current = targetAngle4+Math.PI/2;
            }
          }else{
            child4Ref.current.rotation.x = targetAngle4+Math.PI/2;
            hasReachAngle4 = true;
            lastAngle4.current = targetAngle4+Math.PI/2;
          }
    
      
          if(wrist2Angle != targetAngle5){
            // setAngle5((child5Ref.current.rotation.y*(180/Math.PI)).toString());
            child5Ref.current.rotation.x = THREE.MathUtils.lerp(child5Ref.current.rotation.x,targetAngle5,0.05);
            lastAngle5.current = child5Ref.current.rotation.x;
            if(abs((targetAngle5)-child5Ref.current.rotation.x)<0.01){
              wrist2Angle = targetAngle5;
              lastAngle5.current = targetAngle5;
            }
          }else{
            child5Ref.current.rotation.x = targetAngle5;
            hasReachAngle5 = true;
            lastAngle5.current = targetAngle5;
          }
  
          if(wrist3Angle != targetAngle6){

            child6Ref.current.rotation.x = THREE.MathUtils.lerp(child6Ref.current.rotation.x,targetAngle6,0.05);
            lastAngle6.current = child6Ref.current.rotation.x;
            if(abs((targetAngle6)-child6Ref.current.rotation.x)<0.01){
              wrist3Angle = targetAngle6;
              lastAngle6.current = targetAngle6;
            }
          }else{
            child6Ref.current.rotation.x = targetAngle6;
              hasReachAngle6 = true;
              lastAngle6.current = targetAngle6;
            }
    }

    if(isMoving==false && isStopping==true){
      console.log('Stoping...')
      setAngle1((lastAngle1.current*(180/Math.PI)).toString());
      setAngle2(((lastAngle2.current-Math.PI/2)*(180/Math.PI)).toString());
      setAngle3((lastAngle3.current*(180/Math.PI)).toString());
      setAngle4(((lastAngle4.current-Math.PI/2)*(180/Math.PI)).toString());
      setAngle5((lastAngle5.current*(180/Math.PI)).toString());
      setAngle6((lastAngle6.current*(180/Math.PI)).toString());
      setIsStopping(false);      
    }

    if(hasReachAngle1 && hasReachAngle2 && hasReachAngle3 && hasReachAngle4 && hasReachAngle5 && hasReachAngle6){
      setAngle1((targetAngle1*(180/Math.PI)).toString());  
      setAngle2((targetAngle2*(180/Math.PI)).toString());  
      setAngle3((targetAngle3*(180/Math.PI)).toString());  
      setAngle4((targetAngle4*(180/Math.PI)).toString());  
      setAngle5((targetAngle5*(180/Math.PI)).toString());  
      setAngle6((targetAngle6*(180/Math.PI)).toString());  

      console.log('Goal reached');

      hasReachAngle1=false;
      hasReachAngle2=false;
      hasReachAngle3=false;
      hasReachAngle4=false;
      hasReachAngle5=false;
      hasReachAngle6=false;

      setIsMoving(false);
      setIsStopping(false);
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

  const baseRef = useRef();
  const link1Ref = useRef();
  const link2Ref = useRef();
  const link3Ref = useRef();
  const link4Ref = useRef();
  const link5Ref = useRef();
  const link6Ref = useRef();
  const link7Ref = useRef();

  const[currTouchX,setCurrTouchX] = useState(0);
  const[startTouchX,setStartTouchX] = useState(0);
  const[direction,setDirection]=useState('');
  const[isVisible,setIsVisible]=useState(false);
  const[selectedTcpMenu,setSelectedTcpMenu]=useState('tcp_Pos');
  const[selectedInputMenu,setSelectedInputMenu]=useState('ANGLE_INPUT');
  const[isMoving,setIsMoving] = useState(false);
  const[isStopping,setIsStopping] = useState(false);

  const[angle1,setAngle1]=useState('0');
  const[angle2,setAngle2]=useState('-90');
  const[angle3,setAngle3]=useState('0');
  const[angle4,setAngle4]=useState('-90');
  const[angle5,setAngle5]=useState('0');
  const[angle6,setAngle6]=useState('0');

  const[targetAngle1,setTargetAngle1]=useState(0.0);
  const[targetAngle2,setTargetAngle2]=useState(-Math.PI/2);
  const[targetAngle3,setTargetAngle3]=useState(0.0);
  const[targetAngle4,setTargetAngle4]=useState(-Math.PI/2);
  const[targetAngle5,setTargetAngle5]=useState(0.0);
  const[targetAngle6,setTargetAngle6]=useState(0.0);

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
    switch(inputId) {
      case 'angle1':
        setAngle1(inputText);
        break;
      case 'angle2':
        setAngle2(inputText);
        break;
      case 'angle3':
        setAngle3(inputText);
        break;
      case 'angle4':
        setAngle4(inputText);
        break;
      case 'angle5':
        setAngle5(inputText);
        break;
      case 'angle6':
        setAngle6(inputText);
        break;
      case 'tcpX':
        setTcpX(inputText);
        break;
      case 'tcpY':
        setTcpY(inputText);
        break;
      case 'tcpZ':
        setTcpZ(inputText);
        break;
      case 'tcpRX':
        setTcpRX(inputText);
        break;
      case 'tcpRY':
        setTcpRY(inputText);
        break;
      case 'tcpRZ':
        setTcpRZ(inputText);
        break;
      default:
        // Handle unknown inputId if needed
        break;
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



  const moveActuator=async(direction)=>{

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

    // const thread = new Thread('../thread.js');

    // thread.postMessage('hello');

    // thread.onmessage = (message)=>{console.log(message)};

    // thread.terminate();

    let currentAngles = [angle1,angle2,angle3,angle4,angle5,angle6]
    let currentTransf = [tcpX,tcpY,tcpZ,tcpRX,tcpRY,tcpRZ]

    currentAngles = currentAngles.map(item=>parseFloat(item));
    currentTransf = currentTransf.map(item=>parseFloat(item));

    let targetTransf = [];

    // Do not make reference ->   X  let targetUpTransf = currentTransf; 
    let targetUpTransf = [...currentTransf];
    let targetDownTransf = [...currentTransf];
    let targetLeftTransf = [...currentTransf];
    let targetRightTransf = [...currentTransf];
    let targetForwardTransf = [...currentTransf];
    let targetBackwardTransf = [...currentTransf];

    console.log('Firstly:',targetDownTransf);
    targetUpTransf[2]+=100;
    targetDownTransf[2] = targetDownTransf[2]-100;
    targetLeftTransf[1]+=100;
    targetRightTransf[1]-=100;
    targetForwardTransf[0]+=100;
    targetBackwardTransf[0]-=100;
    console.log('Afterly:',targetDownTransf);

    let ikAnglesUp = []
    let ikAnglesDown = []
    let ikAnglesLeft = []
    let ikAnglesRight = []
    let ikAnglesForward = []
    let ikAnglesBackward = []

    try {
      ikAnglesUp = await newJasperIk([targetUpTransf[0]/1000,targetUpTransf[1]/1000,targetUpTransf[2]/1000,-90.0,0.0,-180]);
      ikAnglesDown = await newJasperIk([targetDownTransf[0]/1000,targetDownTransf[1]/1000,targetDownTransf[2]/1000,-90.0,0.0,-180]);
      ikAnglesLeft = await newJasperIk([targetLeftTransf[0]/1000,targetLeftTransf[1]/1000,targetLeftTransf[2]/1000,-90.0,0.0,-180]);
      ikAnglesRight = await newJasperIk([targetRightTransf[0]/1000,targetRightTransf[1]/1000,targetRightTransf[2]/1000,-90.0,0.0,-180]);
      ikAnglesForward = await newJasperIk([targetForwardTransf[0]/1000,targetForwardTransf[1]/1000,targetForwardTransf[2]/1000,-90.0,0.0,-180]);
      ikAnglesBackward = await newJasperIk([targetForwardTransf[0]/1000,targetBackwardTransf[1]/1000,targetBackwardTransf[2]/1000,-90.0,0.0,-180]);      
    } catch (error) {
      console.error(error);
    }

    let ikAngles = []

    switch (direction) {
      case 'up':
            // Either moving up
            ikAngles = ikAnglesUp;
            targetTransf = targetUpTransf;

            break;
      case 'down':
            // Either moving up
            ikAngles = ikAnglesDown;
            targetTransf = targetDownTransf;
            break;
      case 'left':
            // Either moving up
            ikAngles = ikAnglesLeft;
            targetTransf = targetLeftTransf;
            break;
      case 'right':
            // Either moving up
            ikAngles = ikAnglesRight;
            targetTransf = targetRightTransf;
            break;
      case 'forward':
            // Either moving up
            ikAngles = ikAnglesForward;
            targetTransf = targetForwardTransf;
            break;
      case 'backward':
            // Either moving up
            ikAngles = ikAnglesBackward;
            targetTransf = targetBackwardTransf;
            break;    
      default:
            console.log('Switch Statement failed');
        break;
    }


    console.log('Target:',targetTransf);

    // //Check if the target
    // if(norm([targetTransf[0],targetTransf[1],targetTransf[2]])>1520){
    //   console.log('Target pos out of reach')
    //   return;
    // }
    
    x = targetTransf[0]/1000;
    y = targetTransf[1]/1000;
    z = targetTransf[2]/1000;

    // try {
    //   ikAngles = await newJasperIk([x,y,z,-90.0,0.0,-180]); 
    // } catch (error) {
    //   console.error(error);
    // }

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
    console.log('Result: ',result);
    console.log('Best result: ',bestResult);

    let result = ikAngles[7].map(value => ceil(value*100)/100);
    // bestTransf = forwarkKinmeatics(result); // Hard pressing the best move result from 


    // Set Angles
    
    setTargetAngle1(result[0]*(Math.PI/180));
    setTargetAngle2(result[1]*(Math.PI/180));
    setTargetAngle3(result[2]*(Math.PI/180));
    setTargetAngle4(result[3]*(Math.PI/180));
    setTargetAngle5(result[4]*(Math.PI/180));
    setTargetAngle6(result[5]*(Math.PI/180));

    // Set TCP
    setTcpX((bestTransf[0]*1000).toString());
    setTcpY((bestTransf[1]*1000).toString());
    setTcpZ((bestTransf[2]*1000).toString());
    setTcpRX(bestTransf[3].toString());
    setTcpRY(bestTransf[4].toString());
    setTcpRZ(bestTransf[5].toString());

    setIsMoving(true);
    setIsStopping(false);
  }

  const stopActuator=async()=>{
    console.log('Called stop...')
    setIsMoving(false);
    setIsStopping(true);
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
                    <Icon name='arrow-upward' size={55} color='#00B2FF' className='h-full w-full' onPress={()=>{}} onPressIn={()=>{moveActuator('up')}} onPressOut={()=>{stopActuator()}} />
                    </TouchableOpacity>
  
                    <TouchableOpacity className='flex-1 bg-transparent'>
                      {/* <Text>2</Text> */}
                    </TouchableOpacity>

                    <TouchableOpacity className='flex-1 bg-transparent'>
                      {/* <Text>3</Text> */}
                      <Icon name='arrow-downward' size={55} color='#00B2FF' className='h-full w-full' onPress={()=>{}} onPressIn={()=>{moveActuator('down')}} onPressOut={()=>{stopActuator()}} />
                    </TouchableOpacity>
                  </View>

                  <View id='posConRow2' className='flex-1 flex-row'>
                    <TouchableOpacity className='flex-1 bg-transparent'>
                      {/* <Text>4</Text> */}
                    </TouchableOpacity>

                    <TouchableOpacity className='flex-1 bg-transparent justify-center items-center rotate-90'>
                      {/* <Text>5</Text> */}
                      <Icon name='arrow-circle-left' size={55} color='#00B2FF' className='h-full w-full' onPress={()=>{}} onPressIn={()=>{moveActuator('forward')}} onPressOut={()=>{stopActuator()}} />
                    </TouchableOpacity>

                    <TouchableOpacity className='flex-1 bg-transparent'>
                    {/* <Text>6</Text> */}
                    </TouchableOpacity>
                  </View>

                  <View id='posConRow3' className='flex-1 flex-row'>
                    <TouchableOpacity className='flex-1 bg-transparent'>
                      {/* <Text>7</Text> */}
                      <Icon name='arrow-circle-left' size={55} color='#00B2FF' className='h-full w-full' onPress={()=>{}} onPressIn={()=>{moveActuator('left')}} onPressOut={()=>{stopActuator()}} />
                    </TouchableOpacity>

                    <TouchableOpacity className='flex-1 bg-transparent'>
                      {/* <Text>8</Text> */}
                    </TouchableOpacity>

                    <TouchableOpacity className='flex-1 bg-transparent'>
                      {/* <Text>9</Text> */}
                      <Icon name='arrow-circle-right' size={55} color='#00B2FF' className='h-full w-full' onPress={()=>{}} onPressIn={()=>{moveActuator('right')}} onPressOut={()=>{stopActuator()}}/>
                    </TouchableOpacity>
                  </View>

                  <View id='posConRow4' className='flex-1 flex-row'>
                    <TouchableOpacity className='flex-1 bg-transparent'>
                      {/* <Text>10</Text> */}
                    </TouchableOpacity>
  
                    <TouchableOpacity className='flex-1 flex-row bg-transparent justify-center items-center rotate-90'>
                      {/* <Text>11</Text> */}
                      <Icon name='arrow-circle-right' size={55} color='#00B2FF' className='h-full w-full' onPress={()=>{}} onPressIn={()=>{moveActuator('backward')}} onPressOut={()=>{stopActuator()}}/>
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
                      <CustomTransformations baseRef={baseRef} link1Ref={link1Ref} link2Ref={link2Ref} link3Ref={link3Ref} link4Ref={link4Ref} link5Ref={link5Ref} link6Ref={link6Ref} link7Ref={link7Ref} baseAngle={angle1} shoulderAngle={angle2} elbowAngle={angle3} wrist1Angle={angle4} wrist2Angle={angle5} wrist3Angle={angle6} targetAngle1={targetAngle1} targetAngle2={targetAngle2} targetAngle3={targetAngle3} targetAngle4={targetAngle4} targetAngle5={targetAngle5} targetAngle6={targetAngle6} setAngle1={setAngle1} setAngle2={setAngle2} setAngle3={setAngle3} setAngle4={setAngle4} setAngle5={setAngle5} setAngle6={setAngle6} isMoving={isMoving} setIsMoving={setIsMoving} isStopping={isStopping} setIsStopping={setIsStopping} className="z-2" />                    
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




