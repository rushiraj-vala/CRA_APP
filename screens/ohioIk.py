import numpy as np
from math import pi
import math
import cmath

T06 = []


DH_UR = np.matrix([[0, pi / 2.0, 0.1807],
                   [-0.6127, 0, 0],
                   [-0.57155, 0, 0],
                   [0, pi / 2.0, 0.17415],
                   [0, -pi / 2.0, 0.11985],
                   [0, 0, 0.11655]])

BT0 = np.array([[1, 0, 0, 0],
                [0, 1, 0, 0],
                [0, 0, 1, 0.1807],
                [0, 0, 0, 1]])

SixT_TP = np.array([[1, 0, 0, 0],
                    [0, 1, 0, 0],
                    [0, 0, 1, 0.11655],
                    [0, 0, 0, 1]])

TBTP = np.array([[-1, 0.0, 0.0, 0],
                [0.0, 0.0, -1, -0.291],
                [0.0, -1, 0.0, 1.300],
                [0.0, 0.0, 0.0, 1]])

T06 = np.linalg.inv(BT0)*TBTP*np.linalg.inv(SixT_TP)
T06 = TBTP

# Theta 1
E1 = T06[1, 3]  # Y6
F1 = -T06[0, 3]  # -X6
G1 = DH_UR[3, 2]  # d4

a = cmath.sqrt(E1*E1+F1*F1-G1*G1)
print('a', a)
phi1 = (-F1+a.real) / (G1-E1)
phi2 = (-F1-a.real) / (G1-E1)

theta1_1 = 2*math.atan(phi1)
theta1_2 = 2*math.atan(phi2)

print(theta1_1*(180/pi), theta1_2*(180/pi))
