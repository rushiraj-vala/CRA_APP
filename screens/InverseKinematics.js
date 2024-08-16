import { View, Text } from 'react-native'
import React from 'react'

const InverseKinematics = () => {

let individualMatrix=[];
let dhParameters=[
    [0,90,0.1807,0],
    [-0.6127,0,0,0],
    [-0.57155,0,0,],
    [0,90,0.17415,0],
    [0,-90,0.11985,0],
    [0,0,0.11655,0]
];
    
// Create the master DH Transformation Matrix function
const dhMatrix=(a,alpha,d,theta)=>{
    alpha = alpha*(Math.PI/180);
    theta = theta*(Math.PI/180);
    let dh_matrix = [
        [parseFloat(Math.cos(theta).toFixed(5)), parseFloat((-Math.sin(theta)*Math.cos(alpha)).toFixed(3), (Math.sin(theta)*Math.sin(alpha)).toFixed(3)) , parseFloat(a*Math.cos(theta).toFixed(3)) ],
        [parseFloat(Math.sin(theta).toFixed(3)), parseFloat((Math.cos(theta)*Math.cos(alpha)).toFixed(3), (-Math.cos(theta)*Math.sin(alpha)).toFixed(3)) , parseFloat(a*Math.sin(theta).toFixed(3)) ],
        [0, parseFloat(Math.sin(alpha).toFixed(3)), parseFloat(Math.cos(alpha).toFixed(3)), d],
        [0,0,0,1]
    ];

    return dh_matrix;
}

const eachMatrix=()=>{
    // Get the each individual Matrix
    dhParameters.forEach((item)=>{
        console.log(dhMatrix(...item));
    });
}

// Get the accumulated Matrix

// Get the Jacobian Matrix

  return (
    <Text>{eachMatrix()}</Text>
  )
}

export default InverseKinematics