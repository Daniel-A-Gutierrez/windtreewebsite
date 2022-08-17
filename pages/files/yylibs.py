'''
Copyright (c) 2022 Windtree
YY Sensor library
version:1.0

YYHCSR04   Ultrasonic Sonar HCSR04
YYMG90     MG90 Servo
'''

from machine import Pin,PWM,Timer,time_pulse_us
from utime import sleep
import time
 
#HCSR04
class YYHCSR04:
    def __init__(self, trigger_pin=20, echo_pin=19, echo_timeout_us=500*2*30):
        self.echo_timeout_us = echo_timeout_us
        self.trigger = Pin(trigger_pin, mode=Pin.OUT, pull=None)
        self.trigger.value(0)
        self.echo = Pin(echo_pin, mode=Pin.IN, pull=None)
        
    def _send_pulse_and_wait(self):
        self.trigger.value(0)
        time.sleep_us(5)
        self.trigger.value(1)
        time.sleep_us(10)
        self.trigger.value(0)
        try:
            pulse_time = time_pulse_us(self.echo, 1, self.echo_timeout_us)
            return pulse_time
        except OSError as ex:
            if ex.args[0] == 110: 
                raise OSError('Out of range')
            raise ex

    def DistanceMM(self):
        pulse_time = self._send_pulse_and_wait()
        mm = pulse_time * 100 // 582
        return mm

    def DistanceCM(self):
        pulse_time = self._send_pulse_and_wait()
        cms = (pulse_time / 2) / 29.1
        return cms  

#MG90 Servo        
class YYMG90:
    m_angle = None
    m_min_angle = -90
    m_max_angle = 90
    def __init__(self,pin=12,min_angle=-90,max_angle=90):
        self.pwm = PWM(Pin(pin,Pin.OUT))
        self.pwm.freq(50)
        self.m_min_angle = min_angle
        self.m_max_angle = max_angle
    
    #Turn the servo
    #angle: -90~90
    #wait_time: After the steering gear is powered, wait for the rotation time
    #stop:Whether to stop power supply  1: After the waiting time ends, stop power supply  0: Do not stop power supply
    def Goto(self,angle,weit_time=0.3,stop=1):
        min_duty = 1838
        max_duty = 8194
        if angle < self.m_min_angle: angle=self.m_min_angle
        if angle > self.m_max_angle : angle=self.m_max_angle
        self.m_angle = angle
        #print(angle)
        angle = 180 - (90 + angle)
        duty_val= min_duty+round(angle*(max_duty-min_duty)/180)
        #print(duty_val)
        self.pwm.duty_u16(duty_val)
        if stop==1 :
            sleep(weit_time)
            self.pwm.duty_u16(0)
    
    #舵机停止供电
    def Stop(self):
        self.pwm.duty_u16(0)
    
    #获取舵机当天角度
    def Angle(self):
        return self.m_angle
        
    #分度转动舵机,执行前，应给舵机初始化角度
    #angle:转动角度
    #weit_time:上电后等待时间
    #step：分度的单位度数
    def GotoSlowly(self,angle,weit_time=0.08,step=3):
        if angle < self.m_min_angle: angle=self.m_min_angle
        if angle > self.m_max_angle : angle=self.m_max_angle
        step = step
        if angle<self.m_angle : step=-step
        for i in range(self.m_angle,angle+1,step):
            self.Goto(i,weit_time=weit_time)
            #print(i)
        self.Goto(angle) 