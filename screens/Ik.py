#!/usr/bin/python2

# UR5/UR10 Inverse Kinematics - Ryan Keating Johns Hopkins University


# ***** lib
import numpy as np
from numpy import linalg


import cmath
import math
from math import cos as cos
from math import sin as sin
from math import atan2 as atan2
from math import acos as acos
from math import asin as asin
from math import sqrt as sqrt
from math import pi as pi

global mat
mat = np.matrix


# ****** Coefficients ******


global d1, a2, a3, a7, d4, d5, d6
d1 = 0.1807
a2 = -0.6127
a3 = -0.57155
a7 = 0.075
d4 = 0.17415
d5 = 0.11985
d6 = 0.11655

global d, a, alph

# d = mat([0.089159, 0, 0, 0.10915, 0.09465, 0.0823]) ur5
d = mat([0.1807, 0, 0, 0.17415, 0.11985, 0.11655])  # ur10 mm
# a =mat([0 ,-0.425 ,-0.39225 ,0 ,0 ,0]) ur5
a = mat([0, -0.6127, -0.57155, 0, 0, 0])  # ur10 mm
# alph = mat([math.pi/2, 0, 0, math.pi/2, -math.pi/2, 0 ])  #ur5
alph = mat([pi/2, 0, 0, pi/2, -pi/2, 0])  # ur10


# ************************************************** FORWARD KINEMATICS

def AH(n, th, c):

    T_a = mat(np.identity(4), copy=False)
    T_a[0, 3] = a[0, n-1]
    T_d = mat(np.identity(4), copy=False)
    T_d[2, 3] = d[0, n-1]

    Rzt = mat([[cos(th[n-1, c]), -sin(th[n-1, c]), 0, 0],
               [sin(th[n-1, c]),  cos(th[n-1, c]), 0, 0],
               [0,               0,              1, 0],
               [0,               0,              0, 1]], copy=False)

    Rxa = mat([[1, 0,                 0,                  0],
               [0, cos(alph[0, n-1]), -sin(alph[0, n-1]),   0],
               [0, sin(alph[0, n-1]),  cos(alph[0, n-1]),   0],
               [0, 0,                 0,                  1]], copy=False)

    A_i = T_d * Rzt * T_a * Rxa

    return A_i


def HTrans(th, c):
    A_1 = AH(1, th, c)
    A_2 = AH(2, th, c)
    A_3 = AH(3, th, c)
    A_4 = AH(4, th, c)
    A_5 = AH(5, th, c)
    A_6 = AH(6, th, c)

    T_06 = A_1*A_2*A_3*A_4*A_5*A_6

    return T_06

# ************************************************** INVERSE KINEMATICS


def invKine(desired_pos):  # T60
    th = mat(np.zeros((6, 8)))
    P_05 = (desired_pos * mat([0, 0, -d6, 1]).T-mat([0, 0, 0, 1]).T)
    print('P05', P_05)

    # **** theta1 ****

    psi = atan2(P_05[1, 0], P_05[0, 0])
    print('Psi:', psi)
    phi = acos(d4 / sqrt(P_05[1, 0]*P_05[1, 0]
                         + P_05[0, 0]*P_05[0, 0]))
    print('Phi:', phi)
    # The two solutions for theta1 correspond to the shoulder
    # being either left or right
    th[0, 0:4] = pi/2 + psi + phi
    th[0, 4:8] = pi/2 + psi - phi
    th = th.real

    print('Theta 1:', th[0, :])

    # **** theta5 ****

    cl = [0, 4]  # wrist up or down
    for i in range(0, len(cl)):
        c = cl[i]
        T_10 = linalg.inv(AH(1, th, c))
        print('T06: \n', desired_pos)
        T_16 = T_10 * desired_pos
        th[4, c:c+2] = + acos((T_16[2, 3]-d4)/d6)
        th[4, c+2:c+4] = - acos((T_16[2, 3]-d4)/d6)

    th = th.real

    # **** theta6 ****
    # theta6 is not well-defined when sin(theta5) = 0 or when T16(1,3), T16(2,3) = 0.

    cl = [0, 2, 4, 6]
    print('Theta 5', th[4, :])
    for i in range(0, len(cl)):
        c = cl[i]
        T_10 = linalg.inv(AH(1, th, c))
        T_16 = linalg.inv(T_10 * desired_pos)
        th[5, c:c+2] = atan2((-T_16[1, 2]/sin(th[4, c])),
                             (T_16[0, 2]/sin(th[4, c])))

    th = th.real

    # **** theta3 ****
    cl = [0, 2, 4, 6]
    for i in range(0, len(cl)):
        c = cl[i]
        T_10 = linalg.inv(AH(1, th, c))
        T_65 = AH(6, th, c)
        T_54 = AH(5, th, c)
        T_14 = (T_10 * desired_pos) * linalg.inv(T_54 * T_65)
        P_13 = T_14 * mat([0, -d4, 0, 1]).T - mat([0, 0, 0, 1]).T
        t3 = cmath.acos((linalg.norm(P_13)**2 - a2**2 -
                        a3**2)/(2 * a2 * a3))  # norm ?
        th[2, c] = t3.real
        th[2, c+1] = -t3.real

    # **** theta2 and theta 4 ****

    cl = [0, 1, 2, 3, 4, 5, 6, 7]
    for i in range(0, len(cl)):
        c = cl[i]
        T_10 = linalg.inv(AH(1, th, c))
        T_65 = linalg.inv(AH(6, th, c))
        T_54 = linalg.inv(AH(5, th, c))
        T_14 = (T_10 * desired_pos) * T_65 * T_54
        P_13 = T_14 * mat([0, -d4, 0, 1]).T - mat([0, 0, 0, 1]).T

        # theta 2
        th[1, c] = -atan2(P_13[1], -P_13[0]) + \
            asin(a3 * sin(th[2, c])/linalg.norm(P_13))
        # theta 4
        T_32 = linalg.inv(AH(3, th, c))
        T_21 = linalg.inv(AH(2, th, c))
        T_34 = T_32 * T_21 * T_14
        th[3, c] = atan2(T_34[1, 0], T_34[0, 0])
    th = th.real

    return th


x = -1.183
y = -0.291
z = 0.060
rx = 90*(pi/180)
ry = 0*(pi/180)
rz = 0.0*(pi/180)

# x = 0.0
# y = -0.291
# z = 1.483
# rx = -90.25*(pi/180)
# ry = 0*(pi/180)
# rz = -180*(pi/180)

r1 = mat([[1, 0, 0],
          [0, math.cos(rx), -math.sin(rx)],
          [0, math.sin(rx), math.cos(rx)]])

r2 = mat([[math.cos(ry), 0, math.sin(ry)],
          [0, 1, 0],
          [-math.sin(ry), 0, math.cos(ry)]])

r3 = mat([[math.cos(rz), -math.sin(rz), 0],
          [math.sin(rz), math.cos(rz), 0],
          [0, 0, 1]])

r = r3*r2*r1

dPos = mat([[r[0, 0], r[0, 1], r[0, 2], x],
           [r[1, 0], r[1, 1], r[1, 2], y],
           [r[2, 0], r[2, 1], r[2, 2], z],
           [0, 0, 0, 1]])

# dPos[np.abs(dPos) < 0.001] = 0
print(dPos)

res = invKine(dPos)
res = res*(180/pi)
res[np.abs(res) < 0.01] = 0
res = np.ceil(res*1000)/1000

for i in range(6):
    print('{:0.3f}'.format(res[i, 0]))
