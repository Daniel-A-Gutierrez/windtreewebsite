'''
Copyright 2022 Windtree
date:2022.06.20
version:1.2B
'''
from yyminicar import YYMiniCar
from utime import sleep
from yylibs import YYMG90
from machine import Pin,UART
import yyjoystick
import tm1637

#击球舵机类型 "Batting servo type"
# 1:数字360舵机 "digital 360 servo"
# 2：模拟360舵机(默认) "analog 360 servo"
mg_shoot_type=2

#电机驱动
#4-绿 5-蓝 6-棕 7-灰 8-白 9-黑
#Motor driven #4- Green 5- Blue 6- Brown 7- Gray 8- White 9- Black
car_speed_default=80
car = YYMiniCar(MOTOR_RIGHT_IN3=20,MOTOR_RIGHT_IN4=21,
                 MOTOR_LEFT_IN1=19,MOTOR_LEFT_IN2=18)
car.SetSpeed(car_speed_default)
car.Stop()

#Infrared sensing (gray to green)
#红外传感(灰转绿)

p_ir = Pin(6,Pin.IN)

#Shooting angle steering gear, the higher the value, the higher the angle (orange)
#射击角度舵机,值越大，角度越高(橙)
mg_turn = YYMG90(11,min_angle=-55,max_angle=-20)
mg_turn_fix = 105 #显示的角度修正
mg_turn_def_angle = -50 #默认位置
 
#Batting servo (yellow) The higher the value, the faster it is
#击球舵机(黄)
#值越大速度越快
mg_shoot_min_angle=-50
mg_shoot_max_angle=0
mg_shoot_angle=-40
if mg_shoot_type==1:
    mg_shoot_min_angle=15
    mg_shoot_max_angle=50
    mg_shoot_angle=40
mg_shoot = YYMG90(14,min_angle=mg_shoot_min_angle,max_angle=mg_shoot_max_angle) 
mg_shoot.Stop()

#Control handles 0- Brown 1- Red
#控制手柄
#0-棕  1-红  
joystick =  UART(1,9600, tx=Pin(4), rx=Pin(5))
#数码显示管
#13-绿  14-紫
tm9830x = tm1637.TM1637(clk=Pin(17),dio=Pin(16))
tm9830x.show('8888')
sleep(0.3)
tm9830x.show('    ')

#Displays the firing angle
#显示射击角度
def Show(n):
    global mg_turn_fix
    tm9830x.show('A-'+str(n+mg_turn_fix))

#Displays the speed of the car
#显示车速
def ShowSpeed(speed):
    s = ''
    if speed>=100: s='99'
    elif speed<10: s='0'+str(speed)
    else: s=str(speed)
    tm9830x.show('S-'+s)

#Perform the shooting
#执行射击
def Shoot():
    global mg_shoot_angle
    car.Stop()
    mg_shoot.Goto(mg_shoot_angle,stop=0)
    sleep(0.3)
    while p_ir.value()==1:
        sleep(0.01)
    mg_shoot.Stop()
    joystick.read()

mg_turn.Goto(mg_turn_def_angle)
Show(mg_turn.Angle())
cmd_now = 0

while 1:
    if joystick.any():
        try:
            read_cmd= joystick.read(1).decode()
            cmds=yyjoystick.DecodeCMD(joystick,read_cmd)
            cmd_now=cmds[0]
            print(cmds)
        except:
            cmd_now=0
            
    #Left stick driving controls
    #左摇杆控制行驶
    if cmd_now == 0:#停止 stop
        car.Stop()
        Show(mg_turn.Angle())
    elif cmd_now == 5:#前进 fwd
        car.SetSpeed(cmds[1])
        car.Forward()
        ShowSpeed(car.GetSpeed())
    elif cmd_now ==7:#后退 backward
        car.SetSpeed(cmds[1])
        car.Backward()
        ShowSpeed(car.GetSpeed())
    elif cmd_now == 6:#右转 right
        car.TurnRightWhirl(speed=cmds[1])
        ShowSpeed(cmds[1])
    elif cmd_now == 8:#左转 left
        car.TurnLeftWhirl(speed=cmds[1])
        ShowSpeed(cmds[1])
    
    #The left button driving controls
    #左按键控制行驶
    elif cmd_now == 25:#前进
        car.Forward(speed=car_speed_default)
    elif cmd_now ==27:#后退
        car.Backward(speed=car_speed_default)
    elif cmd_now == 26:#右转
        car.TurnRightWhirl(speed=car_speed_default)
    elif cmd_now == 28:#左转
        car.TurnLeftWhirl(speed=car_speed_default)
    
    #The upper button on the front fine-tune the nose angle
    #前方上按键微调车头角度
    elif cmd_now == 9: #微量左转 Turn left slightly
        car.TurnLeft(time_dur=0.02,speed=car_speed_default)
    elif cmd_now == 10: #微量右转 Turn right slightly
        car.TurnRight(time_dur=0.02,speed=car_speed_default)
    
    elif cmd_now == 12: #射击 shoot
        Shoot()
    
    #The right stick and buttons control the firing angle of the steering gear
    #右摇杆和按键控制射击角度舵机
    elif cmd_now == 13: #射击角度加大 The firing angle is increased
        mg_turn.Goto(mg_turn.Angle()+2,weit_time=0.03)
        Show(mg_turn.Angle())
    elif cmd_now == 15: #射击角度减少 The firing angle is reduced
        mg_turn.Goto(mg_turn.Angle()-2,weit_time=0.03)
        Show(mg_turn.Angle())
    elif cmd_now==14: #射击角度加大1度 The firing angle is increased by 1 degree
        mg_turn.Goto(mg_turn.Angle()+1,weit_time=0.03)
        Show(mg_turn.Angle())
    elif cmd_now==16: #射击角度减少1度 The firing angle is reduced by 1 degree
        mg_turn.Goto(mg_turn.Angle()-1,weit_time=0.03)
        Show(mg_turn.Angle())
 
    cmd_now=None
    sleep(0.005)
    