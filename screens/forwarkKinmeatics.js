import { View, Text } from 'react-native'
import React from 'react'
import { multiply,pi,sin,cos, atan2, sqrt, ceil } from 'mathjs';

const mat_transf_matrox = (n,theta)=>{
    n = n-1
    let d = [0.1807,
     0,
     0,
     0.17415,
     0.11985,
     0.11655];

    let a = [0,
        -0.6127,
        -0.57155,
        0,
        0,
        0];

    let alpha = [pi/2.0,
        0,
        0,
        pi/2.0,
        -pi/2.0,
        0
    ];
    
    let t_zd = [[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]];
    t_zd[2][3]=d[n];

    let t_xa = [[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]];
    t_xa[0][3] = a[n]
    angle = theta[n];
    let r_z_theta = [[cos(angle),-sin(angle),0,0],
                     [sin(angle),cos(angle),0,0],
                     [0,0,1,0],
                     [0,0,0,1]];


    alphaValue=alpha[n];
    let r_x_alpha= [[1,0,0,0],
                  [0,cos(alphaValue),-sin(alphaValue),0],
                  [0,sin(alphaValue),cos(alphaValue),0],
                  [0,0,0,1]]

    transf = multiply(t_zd,multiply(r_z_theta,multiply(t_xa,r_x_alpha)));
    return transf;
};

export default function  forwarkKinmeatics(theta){

  theta = theta.map(item => item*(pi/180));

  // Find individual Homogenous Transf Matrices
  let T01 = mat_transf_matrox(1,theta);
  let T12 = mat_transf_matrox(2,theta);
  let T23 = mat_transf_matrox(3,theta);
  let T34 = mat_transf_matrox(4,theta);
  let T45 = mat_transf_matrox(5,theta);
  let T56 = mat_transf_matrox(6,theta);

  // Find the Homogenous Transformation MAtrix
  let T06 = multiply(T01,multiply(T12,multiply(T23,multiply(T34,multiply(T45,T56)))));

  // Find Euler angles from Rotation Matrix inside Transfomation Matrix
  let r11 = T06[0][0];
  let r21 = T06[1][0];
  let RZ = atan2(r21,r11);
  
  let r31 = T06[2][0];
  let r32 = T06[2][1];
  let r33 = T06[2][2];
  let RY = atan2(-r31,sqrt(r32*r32+r33*r33));

  let RX = atan2(r32,r33);
    

  // Round up and convert to degrees
  RX = RX*(180/pi);
  RY = RY*(180/pi);
  RZ = RZ*(180/pi);

  RX = ceil(RX*1000)/1000;
  RY = ceil(RY*1000)/1000;
  RZ = ceil(RZ*1000)/1000;

  // Round to 0.01 mm
  let x = ceil(T06[0][3]*100000)/100000;
  let y = ceil(T06[1][3]*100000)/100000;
  let z = ceil(T06[2][3]*100000)/100000;

  return [x,y,z,RX,RY,RZ];

}
