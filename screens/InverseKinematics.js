import { View, Text } from 'react-native'
import React from 'react'
import { acos, add, atan, atan2, sin, cos, cross, dotMultiply, inv, multiply, norm, pi, pinv, sqrt, subtract, transpose, re, asin, abs, ceil } from 'mathjs';

// const InverseKinematics = (targetPosOrn,items) => {

// let individualMatrix=[];


// const dhParameters=(theta1,theta2,theta3,theta4,theta5,theta6)=>{
//     let dhParametersVar=[
//         [0,90,0.1807,theta1],
//         [-0.6127,0,0,theta2],
//         [-0.57155,0,0,theta3],
//         [0,90,0.17415,theta4],
//         [0,-90,0.11985,theta5],
//         [0,0,0.11655,theta6]
//     ];

//     return dhParametersVar;
// };
    
// // Create the master DH Transformation Matrix function
// const dhMatrix=(a_, alpha, d_, theta)=>{
//     alpha = alpha*(Math.PI/180);
//     theta = theta*(Math.PI/180);
//     // console.log('Theta: ',theta,' alpha: ',alpha);
//     let dh_matrix = [
//         [parseFloat(Math.cos(theta).toFixed(3)), parseFloat((-1*Math.sin(theta) * Math.cos(alpha)).toFixed(3)), parseFloat((Math.sin(theta) * Math.sin(alpha)).toFixed(3)) , parseFloat((a_ * Math.cos(theta)).toFixed(3)) ],
//         [parseFloat(Math.sin(theta).toFixed(3)), parseFloat((Math.cos(theta) * Math.cos(alpha)).toFixed(3)), parseFloat((-1*Math.cos(theta) * Math.sin(alpha)).toFixed(3)) , parseFloat((a_ * Math.sin(theta)).toFixed(3)) ],
//         [0, parseFloat(Math.sin(alpha).toFixed(3)), parseFloat(Math.cos(alpha).toFixed(3)), d_],
//         [0,0,0,1]
//     ];

//     return dh_matrix;
// }

// const eachMatrix=(items)=>{
//     let eachMatrixVar=[];
//     // Get the each individual Matrix
//     items.forEach((item,index)=>{
//         eachMatrixVar.push(dhMatrix(...item));
//         // console.log(`Matrix ${index}: `,dhMatrix(...item));
//     });

//     return eachMatrixVar;
// }

// // Get the accumulated Matrix
// const baseToLinkMatrices=(items)=>{
//     individualMatrix = eachMatrix(items)

//     let baseToLinkMatrixVar=[individualMatrix[0]];

//     let matrixMulti=individualMatrix[0];

//     if(individualMatrix){
//         individualMatrix.forEach((item,index)=>{
//             nextMAT = individualMatrix[index+1];
//             if(nextMAT !== undefined){
//                 matrixMulti = multiply(matrixMulti,nextMAT);
//                 baseToLinkMatrixVar.push(matrixMulti);
//             }
//         })        
//     }

//     return baseToLinkMatrixVar;

// }

// const endEffectorPosOrn=(baseToLinkMatrixVar)=>{
//     var lastHMatrix = baseToLinkMatrixVar[baseToLinkMatrixVar.length-1];
//     var endEffectorPos = [lastHMatrix[0][3],lastHMatrix[1][3],lastHMatrix[2][3]];

//     var T = lastHMatrix;

//     // Extract elements from the rotation matrix
//     const r11 = T[0][0], r12 = T[0][1], r13 = T[0][2];
//     const r21 = T[1][0], r22 = T[1][1], r23 = T[1][2];
//     const r31 = T[2][0], r32 = T[2][1], r33 = T[2][2];

//     let RY,RZ,RX;
//     RY = Math.atan2(-1*r31,Math.sqrt(r21*r21+r11*r11));
//     RZ = Math.atan2(r21/Math.cos(RY),r11/Math.cos(RY));
//     RX = Math.atan2(r32/Math.cos(RY),r33/Math.cos(RY));
    
//     RX = parseFloat(RX);
//     RY = parseFloat(RY);
//     RZ = parseFloat(RZ);
    
//     // console.log('Angles are:',[RX*(180/Math.PI),RY*(180/Math.PI),RZ*(180/Math.PI)]);

//     // REturn the array containing X,Y,Z,RX, RY,RZ
//     // console.log([...endEffectorPos,RX,RY,RZ]);
//     return [...endEffectorPos,RX,RY,RZ];
// }

// // Get the Jacobian Matrix
// const JacobianMatrix=(items)=>{
//     // Given all the matrices find the 'Ri's and 'Zi'
//     var HMatrices = items;

//     let H1, H2, H3, H4, H5, H6;
//     H1 = HMatrices[0]   
//     H2 = HMatrices[1]   
//     H3 = HMatrices[2]   
//     H4 = HMatrices[3]   
//     H5 = HMatrices[4]   
//     H6 = HMatrices[5]  
    
//     let R0,R1,R2,R3,R4,R5,R6;
//     R0 = [0,0,1];
//     R1 = [H1[2][0],H1[2][1],H1[2][2]];
//     R2 = [H2[2][0],H2[2][1],H2[2][2]];
//     R3 = [H3[2][0],H3[2][1],H3[2][2]];
//     R4 = [H4[2][0],H4[2][1],H4[2][2]];
//     R5 = [H5[2][0],H5[2][1],H5[2][2]];
//     R6 = [H6[2][0],H6[2][1],H6[2][2]];

//     let D0,D1,D2,D3,D4,D5,D6
//     D0 = [0,0,0];
//     D1 = [H1[3][0],H1[3][1],H1[3][2]];
//     D2 = [H2[3][0],H2[3][1],H2[3][2]];
//     D3 = [H3[3][0],H3[3][1],H3[3][2]];
//     D4 = [H4[3][0],H4[3][1],H4[3][2]];
//     D5 = [H5[3][0],H5[3][1],H5[3][2]];
//     D6 = [H6[3][0],H6[3][1],H6[3][2]];

//     let Jv0,Jv1,Jv2,Jv3,Jv4,Jv5
//     Jv0 = cross(R0,subtract(D6,D0));
//     Jv1 = cross(R1,subtract(D6,D1));
//     Jv2 = cross(R2,subtract(D6,D2));
//     Jv3 = cross(R3,subtract(D6,D3));
//     Jv4 = cross(R3,subtract(D6,D4));
//     Jv5 = cross(R3,subtract(D6,D5));

//     var J = [[...Jv0,...R0],
//              [...Jv1,...R1],
//              [...Jv2,...R2],
//              [...Jv3,...R3],
//              [...Jv4,...R4],
//              [...Jv5,...R5]]
//     // var J = 12;
//     // console.log('J: ',transpose(J));

//     return pinv(transpose(J));
// }

//     // Use the current theta
//     // thetas = [0,0,0,0,0,0];
//     thetas = [0,-90*Math.PI/180,0,-90*Math.PI/180,0,0];
//     targetPosOrn=[-1.3,-0.2907,0.06085,90*Math.PI/180,0.0,0.0];
//     // var error = subtract(targetPosOrn.map(Number),currentEndEffectorPosOrnVar.map(Number))
//     let new_thetas; 

//     // for(i=0;i<10000;i++){
//     //     // get the current pos1
//     //     var dhParametersVar = dhParameters(...thetas);
//     //     var baseToLinkMatricesVar = baseToLinkMatrices(dhParametersVar);
//     //     var currentEndEffectorPosOrnVar = endEffectorPosOrn(baseToLinkMatricesVar);
//     //     var inverseJacobianMatrixVar =  JacobianMatrix(baseToLinkMatricesVar);
        
//     //     // console.log('current Pos:',currentEndEffectorPosOrnVar);
//     //     // console.log('Target Pos:',targetPosOrn);

//     //     // // get the error using target pos
//     //     var error = subtract(targetPosOrn,currentEndEffectorPosOrnVar);
//     //     // console.log('Error:',error);
        
//     //     // // go through iteration until convergance
//     //     const deltaTheta = multiply(inverseJacobianMatrixVar,error);
//     //     // console.log('Delta theta: ',deltaTheta);
        
//     //     // console.log('Inverse Jacobian: ',inverseJacobianMatrixVar );
        
//     //     if(norm(error)>4){
//     //             new_thetas = subtract(thetas,deltaTheta.map(d => d*0.1));
//     //     } 
//     //     else if(norm(error)>2){
//     //         new_thetas = subtract(thetas,deltaTheta.map(d => d*0.1));
//     //     } 
//     //     else {
//     //         new_thetas = subtract(thetas,deltaTheta.map(d => d*30));
//     //     }
        
//     //     // let error_diff = norm(subtract(thetas,new_thetas));
//     //     // //console.log(error_diff);
//     //     // // if((norm(theta-new_thetas))<0.001){
            
//     //     // // }
//     //     // console.log('Error: ', error);
//     //     console.log('Normalize Error: ', norm(error));
//     //     // // console.log('New theta:',new_thetas)
//     //     thetas = new_thetas;
//     //     // console.log('theta:',thetas)

//     //     // // if(error_diff<0.006){
//     //     // //     console.log('Error: ',error);
//     //     // //     console.log('Norm Error:', error_diff);
//     //     // //     console.log('Solution Found');
//     //     // //     console.log('Thetas',thetas.map(a=>a*(180/Math.PI)));
//     //     // //     break;
//     //     // // }
//     // }



//   return (
//     <></>
//   )
// }

// const OhioInverseKinematics =(x,y,z,alpha,beta,gamma)=>{

//         // x = -0.3992;
//         // y = -0.3182;
//         // z = 0.2715;
//         // x = 0;
//         // y = -0.223;
//         // z = 0.694;

//         alpha = alpha * (Math.PI)/180;
//         beta = beta * (Math.PI)/180;
//         gamma = gamma * (Math.PI)/180;

//         // UR3e
//         let LB = 0.152;
//         let a2 = 0.244;
//         let a3 = 0.213;
//         let d4 = 0.131;
//         let d5 = 0.085;
//         let d6 = 0.092;
//         let LTP = 0.092;

//         // UR10e
//         // let LB = 0.181;
//         // let a2 = 0.613;
//         // let a3 = 0.572;
//         // let d4 = 0.174;
//         // let d5 = 0.120;
//         // let d6 = 0.117;
//         // let LTP = 0.117;

//         let B_T_0 = [[1,0,0,0],
//                     [0,1,0,0],
//                     [0,0,1,LB],
//                     [0,0,0,1]];

//         let six_T_TP = [[1,0,0,0],
//                     [0,1,0,0],
//                     [0,0,1,LTP],
//                     [0,0,0,1]];

//         let B_T_0_inv = pinv(B_T_0);
//         let six_T_TP_inv = pinv(six_T_TP);

//         let Rx = [ [1, 0, 0 ],
//                    [0, Math.cos(alpha), -Math.sin(alpha)],
//                    [0,Math.sin(alpha), Math.cos(alpha)]];
        
//         let Ry = [[Math.cos(beta),0,Math.sin(beta)],
//                   [0,1,0],
//                   [-Math.sin(beta),0,Math.cos(beta)]];

//         let Rz = [[Math.cos(gamma),-Math.sin(gamma),0],
//                   [Math.sin(gamma),Math.cos(gamma),0],
//                   [0,0,1]];

//         R = multiply(Rx,multiply(Ry,Rz));

//         function zeroUpMatrix(matrix) {
//             return matrix.map(row => 
//               row.map(element => Math.abs(element)<0.0001 ? 0 : element)
//             );
//           }

//         function roundUpMatrix(matrix) {
//         return matrix.map(row => 
//             row.map(element => Math.ceil(element * 1000) / 1000)
//         );
//         }
        
//         R = zeroUpMatrix(R);
//         R = roundUpMatrix(R);
//         console.log('R :',R);

//         // let R = [[-0.6722,-0.3586,-0.6477],
//         //          [0.7401,-0.3042,-0.5997],
//         //          [0.0180,-0.8826,0.4698]];

//         // R = [[1,0,0],
//         //         [0,0,-1],
//         //             [0,1,0]];
        
//         let r11 = R[0][0], r12 = R[0][1], r13 = R[0][2];
//         let r21 = R[1][0], r22 = R[1][1], r23 = R[1][2];
//         let r31 = R[2][0], r32 = R[2][1], r33 = R[2][2];

//         let B_T_TP = [[r11,r12,r13,x],[r21,r22,r23,y],[r31,r32,r33,z],[0,0,0,1]]

//         let zero_T_6 = multiply(B_T_0_inv,multiply(B_T_TP,six_T_TP_inv))

//         zero_T_6 = zeroUpMatrix(zero_T_6);
//         zero_T_6 = roundUpMatrix(zero_T_6);
//         console.log('Zero_T_6 \n',zero_T_6)
//         x = zero_T_6[0][3];
//         y = zero_T_6[1][3];
//         z = zero_T_6[2][3];

//         r11 = zero_T_6[0][0];
//         r12 = zero_T_6[0][1];
//         r13 = zero_T_6[0][2];

//         r21 = zero_T_6[1][0];
//         r22 = zero_T_6[1][1];
//         r23 = zero_T_6[1][2];

//         r31 = zero_T_6[2][0];
//         r32 = zero_T_6[2][1];
//         r33 = zero_T_6[2][2];

//         let E1 = parseFloat(y);
//         let F1 = parseFloat(-x);
//         let G1 = d4;

//         console.log('E1, F1, G1',E1,F1,G1);

//         T1 = (-F1+Math.sqrt(E1*E1+F1*F1-G1*G1))/(G1-E1); 
//         T2 = (-F1-Math.sqrt(E1*E1+F1*F1-G1*G1))/(G1-E1); 

//         theta1_1 = 2*Math.atan(T1);
//         theta1_2 = 2*Math.atan(T2);

//         theta6_1 = Math.atan2(r12*Math.sin(theta1_1)-r22*Math.cos(theta1_1),
//                                r21*Math.cos(theta1_1)-r11*Math.sin(theta1_1));

//         theta6_2 = Math.atan2(r12*Math.sin(theta1_2)-r22*Math.cos(theta1_2),r21*Math.cos(theta1_2)-r11*Math.sin(theta1_2));

//         theta5_1 = Math.atan2((r21*Math.cos(theta1_1)-r11*Math.sin(theta1_1))*Math.cos(theta6_1)
//                                +(r12*Math.sin(theta1_1)-r22*Math.cos(theta1_1))*Math.sin(theta6_1),
//                                     r13*Math.sin(theta1_1)-r23*Math.cos(theta1_1));

//         theta5_2 = Math.atan2((r21*Math.cos(theta1_2)-r11*Math.sin(theta1_2))*Math.cos(theta6_2)
//                                 +(r12*Math.sin(theta1_2)-r22*Math.cos(theta1_2))*Math.sin(theta6_2),
//                                     r13*Math.sin(theta1_2)-r23*Math.cos(theta1_2));

//         let A_1 = ((r31*Math.cos(theta6_1))-(r32*Math.sin(theta6_1)))/(Math.cos(theta5_1))
//         let A_2 = ((r31*Math.cos(theta6_2))-(r32*Math.sin(theta6_2)))/(Math.cos(theta5_2))

//         // console.log('A_1,A_2',A_1,A_2);        
//         let B_1 = r32*Math.cos(theta6_1) + r31*Math.sin(theta6_1);
//         let B_2 = r32*Math.cos(theta6_2) + r31*Math.sin(theta6_2);

//         let a_1 = -x*Math.cos(theta1_1)-y*Math.sin(theta1_1)-d5*A_1;
//         let a_2 = -x*Math.cos(theta1_2)-y*Math.sin(theta1_2)-d5*A_2;

//         let b_1 = z - d5*B_1;
//         let b_2 = z - d5*B_2;

//         let E2_1 = -2*a2*b_1;
//         let E2_2 = -2*a2*b_2;

//         let F2_1 = -2*a2*a_1;
//         let F2_2 = -2*a2*a_2;

//         let G2_1 = a2*a2 + a_1*a_1 + b_1*b_1 - a3*a3;
//         let G2_2 = a2*a2 + a_2*a_2 + b_2*b_2 - a3*a3;

//         t2_1 = (-F2_1+Math.sqrt(E2_1*E2_1+F2_1*F2_1-G2_1*G2_1)) / (G2_1-E2_1);
//         t2_2 = (-F2_2-Math.sqrt(E2_2*E2_2+F2_2*F2_2-G2_2*G2_2)) / (G2_2-E2_2);

//         theta2_1 = 2*atan(t2_1);
//         theta2_2 = 2*atan(t2_2);

//         theta3_1 = Math.atan2(a_1-a2*Math.sin(theta2_1),b_1-a2*Math.cos(theta2_1)) - theta2_1;
//         theta3_2 = Math.atan2(a_2-a2*Math.sin(theta2_2),b_2-a2*Math.cos(theta2_2)) - theta2_2;

//         theta4_1 = Math.atan2(A_1,B_1) - theta2_1 - theta3_1;
//         theta4_2 = Math.atan2(A_2,B_2) - theta2_2 - theta3_2;

//         theta1_1 = parseFloat(theta1_1)*(180/Math.PI)
//         theta2_1 = parseFloat(theta2_1)*(180/Math.PI)
//         theta3_1 = parseFloat(theta3_1)*(180/Math.PI)
//         theta4_1 = parseFloat(theta4_1)*(180/Math.PI)
//         theta5_1 = parseFloat(theta5_1)*(180/Math.PI)
//         theta6_1 = parseFloat(theta6_1)*(180/Math.PI)

//         console.log('Theta_1 :',theta1_1);
//         console.log('Theta_2 :',theta2_1);
//         console.log('Theta_3 :',theta3_1);
//         console.log('Theta_4 :',theta4_1);
//         console.log('Theta_5 :',theta5_1);
//         console.log('Theta_6 :',theta6_1);
        
//         theta1_2 = parseFloat(theta1_2)*(180/Math.PI)
//         theta2_2 = parseFloat(theta2_2)*(180/Math.PI)
//         theta3_2 = parseFloat(theta3_2)*(180/Math.PI)
//         theta4_2 = parseFloat(theta4_2)*(180/Math.PI)
//         theta5_2 = parseFloat(theta5_2)*(180/Math.PI)
//         theta6_2 = parseFloat(theta6_2)*(180/Math.PI)

//         // console.log('Theta_1_2 :',theta1_2);
//         // console.log('Theta_2_2 :',theta2_2);
//         // console.log('Theta_3_2 :',theta3_2);
//         // console.log('Theta_4_2 :',theta4_2);
//         // console.log('Theta_5_2 :',theta5_2);
//         // console.log('Theta_6_2 :',theta6_2);
        
//     }


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

export default function japersIK(target_Pos){

    let d1 = 0.1807;
    let d2 = 0;
    let d3 = 0;
    let d4 = 0.17415;
    let d5 = 0.11985;
    let d6 = 0.11655;
    let a2 = -0.6127;
    let a3 = -0.57155; 

    let thetas = [];
    for(let i=0;i<6;i++){
        thetas.push(new Array(8).fill(0))
    }

    x = target_Pos[0]
    y = target_Pos[1]
    z = target_Pos[2]
    RX = target_Pos[3] * (pi/180)
    RY = target_Pos[4] * (pi/180)
    RZ = target_Pos[5] * (pi/180)

    RotX = [[1,0,0],
            [0,cos(RX),-sin(RX)],
            [0,sin(RX),cos(RX)]];

    RotY = [[cos(RY),0,sin(RY)],[0,1,0],[-sin(RY),0,cos(RY)]];

    RotZ = [[cos(RZ),-sin(RZ),0],[sin(RZ),cos(RZ),0],[0,0,1]];

    R = multiply(RotZ,multiply(RotY,RotX));

    // R = R.map(row =>(
    //     row.map(value => value > 0.999 ? 1 : value)
    // ))

    // R = R.map(row =>(
    //     row.map(value => value < -0.999 ? -1 : value)
    // ))

    // R = R.map(row =>(
    //     row.map(value => abs(value)<=0.0001 ? 0 : value)
    // ))

    let T06 = [[R[0][0],R[0][1],R[0][2],x],
               [R[1][0],R[1][1],R[1][2],y],
               [R[2][0],R[2][1],R[2][2],z],
               [0,0,0,1]];

    T06 = T06.map(row=>
        row.map(value => abs(value)<0.001 ? 0.0 : value)
    )

    console.log('T06:',T06)
    //  Theta 1 ------------

    // P05 = T06 * [0,0,-d6,1]
    P05 = multiply(T06,[[0],[0],[-d6],[1]])  
    psi = atan2(P05[1][0],P05[0][0]);
    phi = acos(d4/(sqrt(P05[1]*P05[1]+P05[0]*P05[0])));


    // Assign values to thetas , Find A Better way to do it
    thetas[0][0] = psi + phi + pi/2;
    thetas[0][1] = psi + phi + pi/2;
    thetas[0][2] = psi + phi + pi/2;
    thetas[0][3] = psi + phi + pi/2;
    
    thetas[0][4] = psi - phi + pi/2;
    thetas[0][5] = psi - phi + pi/2;
    thetas[0][6] = psi - phi + pi/2;
    thetas[0][7] = psi - phi + pi/2;

    // theta 5 -------------------------------------
    for(let i of [0,4]){
        // let angle = thetas[0][i]
        // let th5cos = ( T06[0][3] * sin(angle) - T06[1][3] * cos(angle)-(d2+d4+d3))/d6
        // let th5 = 0;
        // if (1>=th5cos>=-1){
        //     th5 = acos(th5cos)
        // }else{
        //     th5=0
        // }

        let thetasLocal =  [thetas[0][i],thetas[1][i],thetas[2][i],thetas[3][i],thetas[4][i],thetas[5][i]];
        T10 = inv(mat_transf_matrox(1,thetasLocal));
        T16 = multiply(T10,T06);
        tvalue = T16[2][3];
        th5 = acos((tvalue-d4)/d6) 
        th5 = re(th5);

        thetas[4][i]= th5;
        thetas[4][i+1]= th5;
        thetas[4][i+2]= -th5;
        thetas[4][i+3]= -th5;

    }

    
    // theta 6 
    thetas[4][0] = -0.1;
    for(let i of [0,2,4,6]){
        let angle5 = thetas[4][i];
        let thetasLocal =  [thetas[0][i],thetas[1][i],thetas[2][i],thetas[3][i],thetas[4][i],thetas[5][i]]
        let T10 = inv(mat_transf_matrox(1,thetasLocal))
        let T61 = inv(multiply(T10,T06));

        //  Old way 
        // let th6 = atan2((-T60[1][0]*sin(angle) + T60[1][1]*cos(angle)),
        //            (T60[0][0]*sin(angle) - T60[0][1]*cos(angle)));
        let th6 = atan2((-T61[1][2]/sin(angle5)),(T61[0][2]/sin(angle5)))
        
        th6 = re(th6);
        thetas[5][i]=th6;
        thetas[5][i+1]=th6;

    }

    // theta 3 
    for(let i of [0,2,4,6]){
        thetasLocal =  [thetas[0][i],thetas[1][i],thetas[2][i],thetas[3][i],thetas[4][i],thetas[5][i]]
        let T01 = mat_transf_matrox(1,thetasLocal); 
        let T45 = mat_transf_matrox(5,thetasLocal); 
        let T56 = mat_transf_matrox(6,thetasLocal); 

        let T14 = multiply(inv(T01),multiply(T06,inv(multiply(T45,T56))));

        P13 = multiply(T14,[[0],[-d4],[0],[1]]);

        costh3 = ((P13[0][0]*P13[0][0] + P13[1][0]*P13[1][0] - a2*a2 -a3*a3)/(2*a2*a3));

        let th3 = 0;
        if(1>=costh3>=-1){
            th3 = acos(costh3)            
        }else{
            th3 = 0
        }

        th3 = re(th3);
        thetas[2][i] = th3;
        thetas[2][i+1] = -th3;
    }

    //  theta 2,4
    for(i=0;i<8;i++){
        thetasLocal =  [thetas[0][i],thetas[1][i],thetas[2][i],thetas[3][i],thetas[4][i],thetas[5][i]]
        let T01 = mat_transf_matrox(1,thetasLocal); 
        let T45 = mat_transf_matrox(5,thetasLocal); 
        let T56 = mat_transf_matrox(6,thetasLocal); 

        let T14 = multiply(inv(T01),multiply(T06,inv(multiply(T45,T56))));

        let P13 = multiply(T14,[[0],[-d4],[0],[1]]);

        let a = atan2(-P13[1][0],-P13[0][0]);
        let denom = sqrt(P13[0][0]*P13[0][0] + P13[1][0]*P13[1][0]);
        let angle = thetas[2][i];
        let numer = -a3 * sin(angle);
        let theta1 = a - asin( numer / denom );
        theta1 = re(theta1);
        thetas[1][i] = theta1;

        thetasLocal =  [thetas[0][i],thetas[1][i],thetas[2][i],thetas[3][i],thetas[4][i],thetas[5][i]]
        let T32 = inv(mat_transf_matrox(2,thetasLocal));
        let T21 = inv(mat_transf_matrox(1,thetasLocal));
        let T34 = multiply(T32,multiply(T21,T14));
        thetas[3][i] = atan2(T34[1][0],T34[0][0]);
    }


    angles=[];
    for(i=0;i<8;i++){
        angles[i]=[thetas[0][i]*(180/pi),thetas[1][i]*(180/pi),thetas[2][i]*(180/pi),thetas[3][i]*(180/pi),thetas[4][i]*(180/pi),thetas[5][i]*(180/pi)];
    }
    angles = angles.map(row => row.map(value => parseFloat(value)));

    return angles;

} 

function mat_transtorm_DH(n,thetas){
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

    n = n - 1;
    zAngle = thetas[n];

    t_z_theta = [[cos(zAngle), -sin(zAngle), 0, 0],
                [sin(zAngle), cos(zAngle), 0, 0],
                [0, 0, 1, 0],
                [0, 0, 0, 1]]
    t_zd = [[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]]

    t_zd[2][3] = d[n];

    t_xa = [[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]];

    t_xa[0][3] = a[n];

    xAngle = alpha[n];

    t_x_alpha = [[1, 0, 0, 0],
                [0, cos(xAngle), -sin(xAngle), 0],
                [0, sin(xAngle), cos(xAngle), 0],
                [0, 0, 0, 1]]

    transform = multiply(t_z_theta,multiply(t_zd, multiply(t_xa,t_x_alpha)));

    return transform
}

export function newJasperIk(target_Pos){
    let d1 = 0.1807;
    let d2 = 0;
    let d3 = 0;
    let d4 =  0.17415;
    let d5 = 0.11985;
    let d6 = 0.11655;

    let a2 = -0.6127;
    let a3 = -0.57155;


    let x = target_Pos[0];
    let y = target_Pos[1];
    let z = target_Pos[2];
    let alp = target_Pos[3]*(pi/180);
    let bet = target_Pos[4]*(pi/180);
    let gam = target_Pos[5]*(pi/180);

    let rotX = [[1,0,0],[0,cos(alp),-sin(alp)],[0,sin(alp),cos(alp)]];
    let rotY = [[cos(bet),0,sin(bet)],[0,1,0],[-sin(bet),0,cos(bet)]];
    let rotZ = [[cos(gam),-sin(gam),0],[sin(gam),cos(gam),0],[0,0,1]];

    let R = multiply(rotZ,multiply(rotY,rotX));

    let transform_matrix = [[R[0][0],R[0][1],R[0][2],x],[R[1][0],R[1][1],R[1][2],y],[R[2][0],R[2][1],R[2][2],z],[0,0,0,1]];

    theta = [];
    for(i=0;i<6;i++){
        theta.push(new Array(8).fill(0));
    }

    // theta 1
    let T06 = transform_matrix;
    let P05 = multiply(T06,[[0],[0],[-d6],[1]]);
    let psi = re(atan2(P05[1][0], P05[0][0]));
    let phi = re(acos((d2 + d4 + d3) / sqrt(P05[0]*P05[0] + P05[1]*P05[1])));

    theta[0][0] = psi + phi + pi / 2;
    theta[0][1] = psi + phi + pi / 2;
    theta[0][2] = psi + phi + pi / 2;
    theta[0][3] = psi + phi + pi / 2;

    theta[0][4] = psi - phi + pi / 2;
    theta[0][5] = psi - phi + pi / 2;
    theta[0][6] = psi - phi + pi / 2;
    theta[0][7] = psi - phi + pi / 2;


    //  Theta 5
    for (let i of [0,4]){
        let a = T06[0][3];
        let angle = theta[0][i];

        th5cos = (a * sin(angle) - T06[1][3] * cos(angle) - (d2 + d4 + d3)) / d6

        if (1 > th5cos > -1){
            th5 = acos(th5cos);
        }else{
            th5 = 0.0;
        }
        th5 = re(th5);

        theta[4][i] = th5;
        theta[4][i+1] = th5;
        theta[4][i+2] = -th5;
        theta[4][i+3] = -th5;

    }

    // Theta 6
    for(let i in [0,2,4,6]){
        T60 = inv(T06)
        let angle = theta[0][i]
        th = atan2((-T60[1][0] * sin(angle) + T60[1][1] * cos(angle)),
                   (T60[0][0] * sin(angle) - T60[0][1] * cos(angle)));
        theta[5][i] = re(th)
        theta[5][i+1] = re(th);
    }

    // theta 3
    for(let i of [0,2,4,6]){
        thetasLocal = [theta[0][i],theta[1][i],theta[2][i],theta[3][i],theta[4][i],theta[5][i]];

        T01 = mat_transtorm_DH(1, thetasLocal);
        T45 = mat_transtorm_DH(5, thetasLocal);
        T56 = mat_transtorm_DH(6, thetasLocal);

        T14 = multiply(inv(T01),multiply(T06,inv(multiply(T45,T56))));

        P13 = multiply(T14, [[0], [-d4], [0], [1]])

        costh3 = ((P13[0][0]*P13[0][0] + P13[1][0]*P13[1][0] - a2*a2 - a3*a3) /
                  (2 * a2 * a3))

        if (1 >= costh3 >= -1){            
            th3 = acos(costh3)
        }else{
            th3 = 0.0
        }
        th3 = re(th3)
        theta[2][i] = th3
        theta[2][i + 1] = -th3
    }

    // theta 2,4
    for(i=0;i<8;i++){
        thetasLocal = [theta[0][i],theta[1][i],theta[2][i],theta[3][i],theta[4][i],theta[5][i]];

        T01 = mat_transtorm_DH(1, thetasLocal);
        T45 = mat_transtorm_DH(5, thetasLocal);
        T56 = mat_transtorm_DH(6, thetasLocal);

        T14 = multiply(inv(T01),multiply(T06,inv(multiply(T45,T56))));

        P13 = multiply(T14,[[0], [-d4], [0], [1]]);
        angle = theta[2][i];
        theta[1][i] = re(atan2(-P13[1][0], -P13[0][0]) - asin(-a3*sin(angle) / sqrt(P13[0][0]*P13[0][0] + P13[1][0]*P13[1][0])));

        //  Update theta local
        thetasLocal = [theta[0][i],theta[1][i],theta[2][i],theta[3][i],theta[4][i],theta[5][i]];
        T32 = inv(mat_transtorm_DH(3, thetasLocal));
        T12 = mat_transtorm_DH(2, thetasLocal);
        T21 = inv(mat_transtorm_DH(2, thetasLocal));

        T34 = multiply(T32,multiply(T21, T14));

        numer = T34[1][0];
        denom = T34[0][0];

        theta[3][i] = re(atan2( numer,denom));

    }

    angles=[];

    for(i=0;i<8;i++){
        angles[i]=[theta[0][i]*(180/pi),theta[1][i]*(180/pi),theta[2][i]*(180/pi),theta[3][i]*(180/pi),theta[4][i]*(180/pi),theta[5][i]*(180/pi)];
    }
    angles = angles.map(row => row.map(value => parseFloat(value)));

    return angles;

}