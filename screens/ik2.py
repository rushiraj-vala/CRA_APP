import numpy as np
from numpy import linalg
from math import pi
from math import cos
from math import sin
from math import atan2
from math import acos
from math import sqrt
from math import asin

DH_matrix_UR3e = np.matrix([[0, pi / 2.0, 0.15185],
                            [-0.24355, 0, 0],
                            [-0.2132, 0, 0],
                            [0, pi / 2.0, 0.13105],
                            [0, -pi / 2.0, 0.08535],
                            [0, 0, 0.0921]])

DH_matrix_UR5e = np.matrix([[0, pi / 2.0, 0.1625],
                            [-0.425, 0, 0],
                            [-0.3922, 0, 0],
                            [0, pi / 2.0, 0.1333],
                            [0, -pi / 2.0, 0.0997],
                            [0, 0, 0.0996]])

DH_matrix_UR10e = np.matrix([[0, pi / 2.0, 0.1807],
                             [-0.6127, 0, 0],
                             [-0.57155, 0, 0],
                             [0, pi / 2.0, 0.17415],
                             [0, -pi / 2.0, 0.11985],
                             [0, 0, 0.11655]])

DH_matrix_UR16e = np.matrix([[0, pi / 2.0, 0.1807],
                             [-0.4784, 0, 0],
                             [-0.36, 0, 0],
                             [0, pi / 2.0, 0.17415],
                             [0, -pi / 2.0, 0.11985],
                             [0, 0, 0.11655]])

DH_matrix_UR3 = np.matrix([[0, pi / 2.0, 0.1519],
                           [-0.24365, 0, 0],
                           [-0.21325, 0, 0],
                           [0, pi / 2.0, 0.11235],
                           [0, -pi / 2.0, 0.08535],
                           [0, 0, 0.0819]])

DH_matrix_UR5 = np.matrix([[0, pi / 2.0, 0.089159],
                           [-0.425, 0, 0],
                           [-0.39225, 0, 0],
                           [0, pi / 2.0, 0.10915],
                           [0, -pi / 2.0, 0.09465],
                           [0, 0, 0.0823]])

DH_matrix_UR10 = np.matrix([[0, pi / 2.0, 0.1273],
                            [-0.612, 0, 0],
                            [-0.5723, 0, 0],
                            [0, pi / 2.0, 0.163941],
                            [0, -pi / 2.0, 0.1157],
                            [0, 0, 0.0922]])


def mat_transtorm_DH(DH_matrix, n, edges=np.matrix([[0], [0], [0], [0], [0], [0]])):
    n = n - 1
    t_z_theta = np.matrix([[cos(edges[n]), -sin(edges[n]), 0, 0],
                           [sin(edges[n]), cos(edges[n]), 0, 0],
                           [0, 0, 1, 0],
                           [0, 0, 0, 1]], copy=False)
    t_zd = np.matrix(np.identity(4), copy=False)
    t_zd[2, 3] = DH_matrix[n, 2]
    t_xa = np.matrix(np.identity(4), copy=False)
    t_xa[0, 3] = DH_matrix[n, 0]
    t_x_alpha = np.matrix([[1, 0, 0, 0],
                           [0, cos(DH_matrix[n, 1]), -sin(DH_matrix[n, 1]), 0],
                           [0, sin(DH_matrix[n, 1]), cos(DH_matrix[n, 1]), 0],
                           [0, 0, 0, 1]], copy=False)
    transform = t_z_theta * t_zd * t_xa * t_x_alpha
    return transform


def forward_kinematic_solution(DH_matrix, edges=np.matrix([[0], [0], [0], [0], [0], [0]])):
    t01 = mat_transtorm_DH(DH_matrix, 1, edges)
    t12 = mat_transtorm_DH(DH_matrix, 2, edges)
    t23 = mat_transtorm_DH(DH_matrix, 3, edges)
    t34 = mat_transtorm_DH(DH_matrix, 4, edges)
    t45 = mat_transtorm_DH(DH_matrix, 5, edges)
    t56 = mat_transtorm_DH(DH_matrix, 6, edges)
    answer = t01 * t12 * t23 * t34 * t45 * t56
    return answer


def inverse_kinematic_solution(DH_matrix, transform_matrix):

    theta = np.matrix(np.zeros((6, 8)))
    # theta 1
    T06 = transform_matrix
    P05 = T06 * np.matrix([[0.0], [0.0], [-DH_matrix[5, 2]], [1.0]])
    psi = atan2(P05[1], P05[0])
    phi = acos(DH_matrix[3, 2] / sqrt(P05[0] ** 2 + P05[1] ** 2))
    theta[0, 0:4] = round(psi + phi + pi / 2, 3)
    theta[0, 4:8] = round(psi - phi + pi / 2, 3)

    # theta 5
    for i in {0, 4}:

        th5cos = (T06[0, 3] * sin(theta[0, i]) - T06[1, 3] *
                  cos(theta[0, i]) - (DH_matrix[3, 2])) / DH_matrix[5, 2]

        if 1 > th5cos > -1:
            th5 = acos(th5cos)
        else:
            th5 = 0.0

        theta[4, i:i + 2] = round(th5, 2)
        theta[4, i + 2:i + 4] = round(-th5, 2)

    # theta 6
    for i in {0, 2, 4, 6}:
        # if sin(theta[4, i]) == 0:
        #     theta[5, i:i + 1] = 0 # any angle
        #     break
        T60 = linalg.inv(T06)
        T01 = mat_transtorm_DH(DH_matrix_UR10, 1, theta[:, i])
        T61 = T60*T01
        # th = atan2((-T60[1, 0] * sin(theta[0, i]) + T60[1, 1] * cos(theta[0, i])),
        #            (T60[0, 0] * sin(theta[0, i]) - T60[0, 1] * cos(theta[0, i])))
        ytan = -T61[1, 0]*sin(theta[0, i]) + T61[1, 1]*cos(theta[0, i])
        xtan = -(-T61[0, 0]*sin(theta[0, i]) + T61[0, 1]*cos(theta[0, i]))
        if sin(theta[4, i]) == 0:
            if ytan < 0:
                ytan = -float('inf')
            else:
                ytan = float('inf')
            if xtan < 0:
                xtan = -float('inf')
            else:
                xtan = float('inf')
        else:
            ytan = ytan/(sin(theta[4, i]))
            xtan = xtan/(sin(theta[4, i]))

        th = atan2(ytan, xtan)
        print('THH ~~~~~~~~~~~~:', th)
        theta[5, i:i + 2] = round(th, 2)

    # theta 3
    for i in {0, 2, 4, 6}:
        T01 = mat_transtorm_DH(DH_matrix, 1, theta[:, i])
        T45 = mat_transtorm_DH(DH_matrix, 5, theta[:, i])
        T56 = mat_transtorm_DH(DH_matrix, 6, theta[:, i])
        T14 = linalg.inv(T01) * T06 * linalg.inv(T45 * T56)
        P13 = T14 * np.matrix([[0], [-DH_matrix[3, 2]], [0], [1]])
        costh3 = ((P13[0] ** 2 + P13[1] ** 2 - DH_matrix[1, 0] ** 2 - DH_matrix[2, 0] ** 2) /
                  (2 * DH_matrix[1, 0] * DH_matrix[2, 0]))
        if 1 >= costh3 >= -1:
            th3 = acos(costh3)
        else:
            th3 = 0.0
        theta[2, i] = round(th3, 2)
        theta[2, i + 1] = round(-th3, 2)

    # theta 2,4
    for i in range(8):
        T01 = mat_transtorm_DH(DH_matrix, 1, theta[:, i])
        T45 = mat_transtorm_DH(DH_matrix, 5, theta[:, i])
        T56 = mat_transtorm_DH(DH_matrix, 6, theta[:, i])
        T14 = linalg.inv(T01) * T06 * linalg.inv(T45 * T56)
        P13 = T14 * np.matrix([[0], [-DH_matrix[3, 2]], [0], [1]])

        theta[1, i] = atan2(-P13[1], -P13[0]) - asin(-DH_matrix[2, 0]
                                                     * sin(theta[2, i]) / sqrt(P13[0] ** 2 + P13[1] ** 2))
        T32 = linalg.inv(mat_transtorm_DH(DH_matrix, 3, theta[:, i]))
        T21 = linalg.inv(mat_transtorm_DH(DH_matrix, 2, theta[:, i]))
        T34 = T32 * T21 * T14
        theta[3, i] = atan2(T34[1, 0], T34[0, 0])
    return theta


if __name__ == '__main__':
    ed = np.matrix([[0.000], [0.000], [0.000],
                   [0.000], [0.000], [0.000]])
    print("Current angles")
    print(ed)
    transform = forward_kinematic_solution(DH_matrix_UR10e, ed)
    # print("Forward")
    # print(transform)
    transform = np.array([[1, 0.0, 0.0, 1.18318],
                          [0.0, 0.0, -1, -0.29124],
                          [0.0, 1, 0.0, 0.06180],
                          [0.0, 0.0, 0.0, 1]])
    # transform = np.array([[-1, 0.0, 0.0, 0],
    #                       [0.0, 0.0, -1, -0.291],
    #                       [0.0, -1, 0.0, 1.480],
    #                       [0.0, 0.0, 0.0, 1]])

    print("Inverse")
    IKS = inverse_kinematic_solution(DH_matrix_UR10e, transform)
    print('Theta 1 :...', IKS[0, :]*(180/pi))
    print('Theta 5 :...', IKS[4, :]*(180/pi))
    print('Theta 6 :...', IKS[5, :]*(180/pi))
    # all solutions
    anggles = []

    # for i in range(8):
    #     anggles = np.matrix([[IKS[0, i]],        # first solution
    #                          [IKS[1, i]],        # first solution
    #                          [IKS[2, i]],        # first solution
    #                          [IKS[3, i]],        # first solution
    #                          [IKS[4, i]],        # first solution
    #                          [IKS[5, i]]])      # first solution
    #     transform = forward_kinematic_solution(DH_matrix_UR10e, anggles)
    #     # print('Angles:', anggles*(180/pi))
    #     # print("Forward")
    #     print(transform[0, 3], transform[1, 3], transform[2, 3])

    # for i in range(6):
    #     print(IKS[:, i]*(180/pi))        # first solution
