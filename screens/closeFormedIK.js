import { View, Text } from 'react-native'
import React from 'react'
import { inv, multiply } from 'mathjs';

const closeFormedIK = () => {
let d1,a2,a3,d4,d5,d6;
d1 = 0.1807;
a2 = -0.6127;
a3 = -0.57155;
d4 = 0.17415;
d5 = 0.11985;
d6 = 0.11655;

function CInversa(VTCP) {
    const PX = VTCP[0];
    const PY = VTCP[1];
    const PZ = VTCP[2];
    const Psi = VTCP[3];
    const Theta = VTCP[4];
    const phi = VTCP[5];

    const T = [
        [
            Math.cos(phi) * Math.cos(Theta),
            Math.sin(Psi) * Math.cos(phi) * Math.sin(Theta) - Math.cos(Psi) * Math.sin(phi),
            Math.sin(Psi) * Math.sin(phi) + Math.cos(Psi) * Math.cos(phi) * Math.sin(Theta),
            PX
        ],
        [
            Math.cos(Theta) * Math.sin(phi),
            Math.cos(Psi) * Math.cos(phi) + Math.sin(Psi) * Math.sin(phi) * Math.sin(Theta),
            Math.cos(Psi) * Math.sin(phi) * Math.sin(Theta) - Math.sin(Psi) * Math.cos(phi),
            PY
        ],
        [
            -Math.sin(Theta),
            Math.sin(Psi) * Math.cos(Theta),
            Math.cos(Psi) * Math.cos(Theta),
            PZ
        ],
        [0, 0, 0, 1]
    ];

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            T[i][j] = Math.round(T[i][j] * 100) / 100;
        }
    }

    const Z06 = [T[0][2], T[1][2], T[2][2]];
    const P06 = [T[0][3], T[1][3], T[2][3]];

    const P05 = P06.map((p, i) => p - d6 * Z06[i]);
    console.log(P05);

    const phi1 = Math.degrees(Math.atan2(P05[1], P05[0]));
    const P05XY = Math.sqrt(Math.pow(P05[1], 2) + Math.pow(P05[0], 2));
    console.log(d4, P05XY, (d4 / P05XY));

    const phi2 = Math.degrees(Math.acos(d4 / P05XY));
    let theta1 = phi1 + phi2 + 90;
    theta1 = Math.round(theta1 * 100) / 100;
    console.log('Theta1', theta1);
    theta1 = theta1 * (Math.PI)/180;
    const theta5 = Math.acos((P06[0] * Math.sin(theta1) - P06[1] * Math.cos(theta1) - d4) / d6);

    const CT6 = -T[1][0] * Math.sin(theta1) + T[1][1] * Math.cos(theta1) / Math.sin(theta5);
    const ST6 = T[0][0] * Math.sin(theta1) - T[0][1] * Math.cos(theta1) / Math.sin(theta5);
    const theta6 = Math.atan2(CT6, ST6);

    const T1 = [
        [Math.cos(theta1), 0, Math.sin(theta1), 0],
        [Math.sin(theta1), 0, -Math.cos(theta1), 0],
        [0, 1, 0, d1],
        [0, 0, 0, 1]
    ];

    const T5 = [
        [Math.cos(theta5), 0, -Math.sin(theta5), 0],
        [Math.sin(theta5), 0, Math.cos(theta5), 0],
        [0, -1, 0, d5],
        [0, 0, 0, 1]
    ];

    const T6 = [
        [Math.cos(theta6), -Math.sin(theta6), 0, 0],
        [Math.sin(theta6), Math.cos(theta6), 0, 0],
        [0, 0, 1, d6],
        [0, 0, 0, 1]
    ];

    const P45 = T5;
    const P56 = T6;
    const P46 = multiply(P45, P56);
    const P64 = inv(P46);
    const P10 = inv(T1);
    const P16 = multiply(P10, T);
    const P14 = multiply(P16, P64);
    console.log('Theta 5 ',theta5);
    console.log('T5 ',T5);
    console.log('P45 ',P45);
    console.log('P56 ',P56);
    console.log('P16 ',P16);
    console.log('P46 ',P46);
    console.log('P64 ',P64);
    console.log('P14 ',P14);
    const P14XY = Math.sqrt(Math.pow(P14[1][3], 2) + Math.pow(P14[0][3], 2));
    console.log('P14XY ',P14XY);

    const theta3 = Math.acos(((P14XY ** 2) - (a2 ** 2) - (a3 ** 2)) / (2 * a2 * a3));
    const theta2 = Math.atan2(-P14[1][3], -P14[0][3]) - Math.asin(-a3 * Math.sin(theta3) / P14XY);
    console.log('Theta 2',theta2)
    const T2 = [
        [Math.cos(theta2), -Math.sin(theta2), 0, a2 * Math.cos(theta2)],
        [Math.sin(theta2), Math.cos(theta2), 0, a2 * Math.sin(theta2)],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ];

    const T3 = [
        [Math.cos(theta3), -Math.sin(theta3), 0, a3 * Math.cos(theta3)],
        [Math.sin(theta3), Math.cos(theta3), 0, a3 * Math.sin(theta3)],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ];

    const P12 = T2;
    const P23 = T3;
    const P13 = multiply(P12, P23);
    const P31 = inv(P13);
    const P34 = multiply(P31, P14);
    console.log('T2',T2);
    console.log(P12);
    console.log(P13);
    console.log(P34);
    const theta4 = Math.atan2(P34[1][0], P34[0][0]);

    console.log("\ntheta1:", Math.round(theta1 * (180/Math.PI)));
    console.log("theta2:", Math.round(theta2 * (180/Math.PI)));
    console.log("theta3:", Math.round(theta3 * (180/Math.PI)));
    console.log("theta4:", Math.round(theta4 * (180/Math.PI)));
    console.log("theta5:", Math.round(theta5 * (180/Math.PI)));
    console.log("theta6:", Math.round(theta6 * (180/Math.PI)));

    return [theta1, theta2, theta3, theta4, theta5, theta6];
}


Math.degrees = function(radians) {
    return radians * (180 / Math.PI);
};

CInversa([0,-0.291,1.483,-90,0,-180]);

return (
    <View>
      {/* <Text>closeFormedIK</Text> */}
    </View>
  )
}

export default closeFormedIK