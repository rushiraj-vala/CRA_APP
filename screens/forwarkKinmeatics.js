import { View, Text } from 'react-native'
import React from 'react'
import { multiply,pi,sin,cos } from 'mathjs';

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
  //DH 
  let T01 = mat_transf_matrox(1,theta);
  let T12 = mat_transf_matrox(2,theta);
  let T23 = mat_transf_matrox(3,theta);
  let T34 = mat_transf_matrox(4,theta);
  let T45 = mat_transf_matrox(5,theta);
  let T56 = mat_transf_matrox(6,theta);

  let T06 = multiply(T01,multiply(T12,multiply(T23,multiply(T34,multiply(T45,T56)))));

  return [T06[0][3],T06[1][3],T06[2][3]]

}
