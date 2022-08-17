'''
Copyright (c) 2021 Windtree

date:2022.06.20
'''

from machine import Pin,PWM,Timer,time_pulse_us
from utime import sleep
import time

class YYMiniCar:
    #右边电机配置 Right motor configuration
    m_MOTOR_RIGHT_IN3 = 14 
    m_MOTOR_RIGHT_IN4 = 15 
    
    #左边电机 Left motor
    m_MOTOR_LEFT_IN1 = 12  
    m_MOTOR_LEFT_IN2 = 13  
    
    #电机速度 Motor speed
    m_SPEED_DUTY = 36500
    m_SPEED = 50
    
    def __init__(self,MOTOR_RIGHT_IN3=None,MOTOR_RIGHT_IN4=None,
                 MOTOR_LEFT_IN1=None,MOTOR_LEFT_IN2=None):
        if MOTOR_RIGHT_IN3 != None:
            self.m_MOTOR_RIGHT_IN3=MOTOR_RIGHT_IN3
        if MOTOR_RIGHT_IN4 != None:
            self.m_MOTOR_RIGHT_IN4=MOTOR_RIGHT_IN4
        if MOTOR_LEFT_IN1 != None:
            self.m_MOTOR_LEFT_IN1=MOTOR_LEFT_IN1
        if MOTOR_LEFT_IN2 != None:
            self.m_MOTOR_LEFT_IN2=MOTOR_LEFT_IN2
        self.m_PWM_RIGHT3 = PWM(Pin(self.m_MOTOR_RIGHT_IN3))
        self.m_PWM_RIGHT3.freq(50)
        self.m_PWM_RIGHT4 = PWM(Pin(self.m_MOTOR_RIGHT_IN4))
        self.m_PWM_RIGHT4.freq(50)
        self.m_PWM_LEFT1 = PWM(Pin(self.m_MOTOR_LEFT_IN1))
        self.m_PWM_LEFT1.freq(50)
        self.m_PWM_LEFT2 = PWM(Pin(self.m_MOTOR_LEFT_IN2))
        self.m_PWM_LEFT2.freq(50)
        
    def GPIOSet(self,pin,value):
        if value >= 1:Pin(pin, Pin.OUT).on()
        else:Pin(pin, Pin.OUT).off()
        
    #速度转换成pwn duty, speed：0~100
    def SpeedToDuty(self,speed):
        smin = 10000
        smax = 65000
        if speed < 0:speed=0
        elif speed > 100:speed=100
        duty = smin + round(((smax-smin) * speed) / 100)
        return duty
    
    #设置小车行驶速度 speed:0~100
    def SetSpeed(self,speed=50):
        if speed>=100 : speed=100
        elif speed<0:speed=0
        self.m_SPEED = speed
        self.m_SPEED_DUTY = self.SpeedToDuty(speed)
    
    # 向前
    def Forward(self,speed=False,time_dur=0):
        if speed > 0  :
            self.m_SPEED = speed
            self.m_SPEED_DUTY = self.SpeedToDuty(speed)
        self.m_PWM_RIGHT4.duty_u16(self.m_SPEED_DUTY)
        self.m_PWM_RIGHT3.duty_u16(0)
        self.m_PWM_LEFT1.duty_u16(self.m_SPEED_DUTY)
        self.m_PWM_LEFT2.duty_u16(0)
        
        if time_dur>0 :
            sleep(time_dur)
            self.Stop()
    # 后退
    def Backward(self,speed=False,time_dur=0):
        if speed > 0  :
            self.m_SPEED_DUTY = self.SpeedToDuty(speed)
        
        self.m_PWM_RIGHT3.duty_u16(self.m_SPEED_DUTY)
        self.m_PWM_RIGHT4.duty_u16(0)
        self.m_PWM_LEFT2.duty_u16(self.m_SPEED_DUTY)
        self.m_PWM_LEFT1.duty_u16(0)
        
        if time_dur>0 :
            sleep(time_dur)
            self.Stop()
    
    #左转 speed:速度 time_dur:时间,<=0：一直转
    def TurnLeft(self,speed=-1,time_dur=0):
        if speed < 0 : speed = self.m_SPEED
        if speed >100 : speed = 100
        
        self.m_PWM_RIGHT4.duty_u16(self.SpeedToDuty(speed))
        self.m_PWM_RIGHT3.duty_u16(0)
        self.m_PWM_LEFT2.duty_u16(0)
        self.m_PWM_LEFT1.duty_u16(0)
        
        if time_dur>0 :
            sleep(time_dur)
            self.Stop()
            
    #左转 speed:速度 time_dur:时间,<=0：一直转
    def TurnLeftWhirl(self,speed=-1,time_dur=0):
        if speed < 0 : speed = self.m_SPEED
        if speed >100 : speed = 100
        
        self.m_PWM_RIGHT4.duty_u16(self.SpeedToDuty(speed))
        self.m_PWM_RIGHT3.duty_u16(0)
        self.m_PWM_LEFT2.duty_u16(self.SpeedToDuty(speed))
        self.m_PWM_LEFT1.duty_u16(0)
        
        if time_dur>0 :
            sleep(time_dur)
            self.Stop()
    
    #右转 speed:速度 time_dur:时间,<=0：一直转
    def TurnRightWhirl(self,speed=-1,time_dur=0):
        if speed < 0 : speed = self.m_SPEED
        if speed >100 : speed = 100
        
        self.m_PWM_RIGHT3.duty_u16(self.SpeedToDuty(speed))
        self.m_PWM_RIGHT4.duty_u16(0)
        self.m_PWM_LEFT1.duty_u16(self.SpeedToDuty(speed))
        self.m_PWM_LEFT2.duty_u16(0)
        
        if time_dur>0 :
            sleep(time_dur)
            self.Stop()
    
    #右转 speed:速度 time_dur:时间,<=0：一直转
    def TurnRight(self,speed=-1,time_dur=0):
        if speed < 0 : speed = self.m_SPEED
        if speed >100 : speed = 100
        
        self.m_PWM_RIGHT3.duty_u16(0)
        self.m_PWM_RIGHT4.duty_u16(0)
        self.m_PWM_LEFT1.duty_u16(self.SpeedToDuty(speed))
        self.m_PWM_LEFT2.duty_u16(0)
        
        if time_dur>0 :
            sleep(time_dur)
            self.Stop()
      
    #停止
    def Stop(self):
        self.m_PWM_RIGHT3.duty_u16(0)
        self.m_PWM_RIGHT4.duty_u16(0)
        self.m_PWM_LEFT1.duty_u16(0)
        self.m_PWM_LEFT2.duty_u16(0)
        
    #获取当前速度 Gets the current speed
    def GetSpeed(self):
        return self.m_SPEED
    
    #小车转到指定的航行角度 The trolley turns to the specified sailing angle
    def TurnToHeading(self,objheading,y5883,uart=False):
        pc = 2.5
        obj = objheading
        disR = 0
        disL = 0
        count=0
        while True:
            heading,degrees, minutes = y5883.heading()
            now = heading
            if obj >= now :
                disR = obj-now
            else :
                disR =360-(now-obj)
            disL = 360-disR
    
            if disL<pc or disR<pc:
                self.Stop()
                print('ok')
                break
    
            print('disR:%s ; disL:%s'%(disR,disL))
            if count%20 == 0 and uart != False :
                uart.write('R:%s L:%s\n'%(disR,disL))
            if disL<disR :
                self.TurnLeftWhirl(speed=10)
                print('toL')
            else:
                self.TurnRightWhirl(speed=10)
                print('toR')
            sleep(0.1)
            count = count+1
            if count >10000 : count=0
        