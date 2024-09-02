import { View, Text } from 'react-native'
import React from 'react'
import { add, cross, dotMultiply, multiply, norm, pinv, subtract, transpose } from 'mathjs';

const InverseKinematics = (targetPosOrn,items) => {

let individualMatrix=[];


const dhParameters=(theta1,theta2,theta3,theta4,theta5,theta6)=>{
    let dhParametersVar=[
        [0,90,0.1807,theta1],
        [-0.6127,0,0,theta2],
        [-0.57155,0,0,theta3],
        [0,90,0.17415,theta4],
        [0,-90,0.11985,theta5],
        [0,0,0.11655,theta6]
    ];

    return dhParametersVar;
};
    
// Create the master DH Transformation Matrix function
const dhMatrix=(a_, alpha, d_, theta)=>{
    alpha = alpha*(Math.PI/180);
    theta = theta*(Math.PI/180);
    // console.log('Theta: ',theta,' alpha: ',alpha);
    let dh_matrix = [
        [parseFloat(Math.cos(theta).toFixed(3)), parseFloat((-1*Math.sin(theta) * Math.cos(alpha)).toFixed(3)), parseFloat((Math.sin(theta) * Math.sin(alpha)).toFixed(3)) , parseFloat((a_ * Math.cos(theta)).toFixed(3)) ],
        [parseFloat(Math.sin(theta).toFixed(3)), parseFloat((Math.cos(theta) * Math.cos(alpha)).toFixed(3)), parseFloat((-1*Math.cos(theta) * Math.sin(alpha)).toFixed(3)) , parseFloat((a_ * Math.sin(theta)).toFixed(3)) ],
        [0, parseFloat(Math.sin(alpha).toFixed(3)), parseFloat(Math.cos(alpha).toFixed(3)), d_],
        [0,0,0,1]
    ];

    return dh_matrix;
}

const eachMatrix=(items)=>{
    let eachMatrixVar=[];
    // Get the each individual Matrix
    items.forEach((item,index)=>{
        eachMatrixVar.push(dhMatrix(...item));
        // console.log(`Matrix ${index}: `,dhMatrix(...item));
    });

    return eachMatrixVar;
}

// Get the accumulated Matrix
const baseToLinkMatrices=(items)=>{
    individualMatrix = eachMatrix(items)

    let baseToLinkMatrixVar=[individualMatrix[0]];

    let matrixMulti=individualMatrix[0];

    if(individualMatrix){
        individualMatrix.forEach((item,index)=>{
            nextMAT = individualMatrix[index+1];
            if(nextMAT !== undefined){
                matrixMulti = multiply(matrixMulti,nextMAT);
                baseToLinkMatrixVar.push(matrixMulti);
            }
        })        
    }

    return baseToLinkMatrixVar;

}

const endEffectorPosOrn=(baseToLinkMatrixVar)=>{
    var lastHMatrix = baseToLinkMatrixVar[baseToLinkMatrixVar.length-1];
    var endEffectorPos = [lastHMatrix[0][3],lastHMatrix[1][3],lastHMatrix[2][3]];

    var T = lastHMatrix;

    // Extract elements from the rotation matrix
    const r11 = T[0][0], r12 = T[0][1], r13 = T[0][2];
    const r21 = T[1][0], r22 = T[1][1], r23 = T[1][2];
    const r31 = T[2][0], r32 = T[2][1], r33 = T[2][2];

    let RY,RZ,RX;
    RY = Math.atan2(-1*r31,Math.sqrt(r21*r21+r11*r11));
    RZ = Math.atan2(r21/Math.cos(RY),r11/Math.cos(RY));
    RX = Math.atan2(r32/Math.cos(RY),r33/Math.cos(RY));
    
    RX = parseFloat(RX);
    RY = parseFloat(RY);
    RZ = parseFloat(RZ);
    
    // console.log('Angles are:',[RX*(180/Math.PI),RY*(180/Math.PI),RZ*(180/Math.PI)]);

    // REturn the array containing X,Y,Z,RX, RY,RZ
    // console.log([...endEffectorPos,RX,RY,RZ]);
    return [...endEffectorPos,RX,RY,RZ];
}

// Get the Jacobian Matrix
const JacobianMatrix=(items)=>{
    // Given all the matrices find the 'Ri's and 'Zi'
    var HMatrices = items;

    let H1, H2, H3, H4, H5, H6;
    H1 = HMatrices[0]   
    H2 = HMatrices[1]   
    H3 = HMatrices[2]   
    H4 = HMatrices[3]   
    H5 = HMatrices[4]   
    H6 = HMatrices[5]  
    
    let R0,R1,R2,R3,R4,R5,R6;
    R0 = [0,0,1];
    R1 = [H1[2][0],H1[2][1],H1[2][2]];
    R2 = [H2[2][0],H2[2][1],H2[2][2]];
    R3 = [H3[2][0],H3[2][1],H3[2][2]];
    R4 = [H4[2][0],H4[2][1],H4[2][2]];
    R5 = [H5[2][0],H5[2][1],H5[2][2]];
    R6 = [H6[2][0],H6[2][1],H6[2][2]];

    let D0,D1,D2,D3,D4,D5,D6
    D0 = [0,0,0];
    D1 = [H1[3][0],H1[3][1],H1[3][2]];
    D2 = [H2[3][0],H2[3][1],H2[3][2]];
    D3 = [H3[3][0],H3[3][1],H3[3][2]];
    D4 = [H4[3][0],H4[3][1],H4[3][2]];
    D5 = [H5[3][0],H5[3][1],H5[3][2]];
    D6 = [H6[3][0],H6[3][1],H6[3][2]];

    let Jv0,Jv1,Jv2,Jv3,Jv4,Jv5
    Jv0 = cross(R0,subtract(D6,D0));
    Jv1 = cross(R1,subtract(D6,D1));
    Jv2 = cross(R2,subtract(D6,D2));
    Jv3 = cross(R3,subtract(D6,D3));
    Jv4 = cross(R3,subtract(D6,D4));
    Jv5 = cross(R3,subtract(D6,D5));

    var J = [[...Jv0,...R0],
             [...Jv1,...R1],
             [...Jv2,...R2],
             [...Jv3,...R3],
             [...Jv4,...R4],
             [...Jv5,...R5]]
    // var J = 12;
    // console.log('J: ',transpose(J));

    return pinv(transpose(J));
}

    // Use the current theta
    // thetas = [0,0,0,0,0,0];
    thetas = [0,-90*Math.PI/180,0,-90*Math.PI/180,0,0];
    targetPosOrn=[-1.3,-0.2907,0.06085,90*Math.PI/180,0.0,0.0];
    // var error = subtract(targetPosOrn.map(Number),currentEndEffectorPosOrnVar.map(Number))
    let new_thetas; 

    // for(i=0;i<10000;i++){
    //     // get the current pos1
    //     var dhParametersVar = dhParameters(...thetas);
    //     var baseToLinkMatricesVar = baseToLinkMatrices(dhParametersVar);
    //     var currentEndEffectorPosOrnVar = endEffectorPosOrn(baseToLinkMatricesVar);
    //     var inverseJacobianMatrixVar =  JacobianMatrix(baseToLinkMatricesVar);
        
    //     // console.log('current Pos:',currentEndEffectorPosOrnVar);
    //     // console.log('Target Pos:',targetPosOrn);

    //     // // get the error using target pos
    //     var error = subtract(targetPosOrn,currentEndEffectorPosOrnVar);
    //     // console.log('Error:',error);
        
    //     // // go through iteration until convergance
    //     const deltaTheta = multiply(inverseJacobianMatrixVar,error);
    //     // console.log('Delta theta: ',deltaTheta);
        
    //     // console.log('Inverse Jacobian: ',inverseJacobianMatrixVar );
        
    //     if(norm(error)>4){
    //             new_thetas = subtract(thetas,deltaTheta.map(d => d*0.1));
    //     } 
    //     else if(norm(error)>2){
    //         new_thetas = subtract(thetas,deltaTheta.map(d => d*0.1));
    //     } 
    //     else {
    //         new_thetas = subtract(thetas,deltaTheta.map(d => d*30));
    //     }
        
    //     // let error_diff = norm(subtract(thetas,new_thetas));
    //     // //console.log(error_diff);
    //     // // if((norm(theta-new_thetas))<0.001){
            
    //     // // }
    //     // console.log('Error: ', error);
    //     console.log('Normalize Error: ', norm(error));
    //     // // console.log('New theta:',new_thetas)
    //     thetas = new_thetas;
    //     // console.log('theta:',thetas)

    //     // // if(error_diff<0.006){
    //     // //     console.log('Error: ',error);
    //     // //     console.log('Norm Error:', error_diff);
    //     // //     console.log('Solution Found');
    //     // //     console.log('Thetas',thetas.map(a=>a*(180/Math.PI)));
    //     // //     break;
    //     // // }
    // }



  return (
    <></>
  )
}

export default InverseKinematics();