#https://www.youtube.com/watch?v=d7oFD-zQpuQ - useful vid
#drive script using an l293d type motor controller.
from machine import Pin, Signal, PWM
from time import sleep_ms
BACKWARD = False
FORWARD = True

LBAK = PWM(Pin(15))   
LFWD = PWM(Pin(18))
RFWD = PWM(Pin(21))    
RBAK = PWM(Pin(22)) 

LBAK.freq(50)
LFWD.freq(50)
RFWD.freq(50)
RBAK.freq(50)

LBAK.duty(0)
LFWD.duty(0)
RFWD.duty(0)
RBAK.duty(0)

SPEED = 1.0


def SetSpeed(speed):
    global SPEED
    if(SPEED >= 0.0 and SPEED <=1.0 ):
        SPEED = speed
    else:
        print("SPEED must be between 0 and 1 - was " , SPEED)

#throttle must be between 0 and 1
def SetLeft(forward : bool):
    if(SPEED >= 0.0 and SPEED <=1.0 ):
        power = int(SPEED*1023)
        if(forward):
            LFWD.duty(power)
            LBAK.duty(0)
        else:
            LFWD.duty(0)
            LBAK.duty(power)
    else:
        print("SPEED must be between 0 and 1 - was " , SPEED)
#throttle must be between 0 and 1
def SetRight(forward : bool):
    if(SPEED >= 0.0 and SPEED <=1.0 ):
        power = int(SPEED*1023)
        if(forward):
            RFWD.duty(power)
            RBAK.duty(0)
        else:
            RFWD.duty(0)
            RBAK.duty(power)
    else:
        print("SPEED must be between 0 and 1 - was " , SPEED)

def Left(duration=0):
    if(SPEED==0.0):
        SetSpeed(1.0)
    SetLeft(BACKWARD)
    SetRight(FORWARD)
    sleep_ms(duration)

def Right(duration=0):
    if(SPEED==0.0):
        SetSpeed(1.0)
    SetLeft(FORWARD)
    SetRight(BACKWARD)
    sleep_ms(duration)

def Backward(duration=0):
    if(SPEED==0.0):
        SetSpeed(1.0)
    SetLeft(BACKWARD)
    SetRight(BACKWARD)
    sleep_ms(duration)

def Forward(duration=0):
    if(SPEED==0.0):
        SetSpeed(1.0)
    SetLeft(FORWARD)
    SetRight(FORWARD)
    sleep_ms(duration)

def Stop(duration=0):
    SetSpeed(0.0)
    SetLeft(FORWARD)
    SetRight(FORWARD)
    sleep_ms(duration)

if(__name__=="__main__"):
    for i in range(1):
        Forward(1000)
        Stop(100)
        Backward(1000)
        Stop(100)
        Left(1000)
        Stop(100)
        #sleep_ms(1000) # it turns out lightsleep turns off all the pins.
        Right(1000)
        Stop(100)
        Stop()