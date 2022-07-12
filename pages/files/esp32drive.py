#pins 0-5 for drive control
from machine import Pin, Signal, PWM, lightsleep
from time import sleep_ms
BACKWARD = False
FORWARD = True

LBAK = Signal(15,Pin.OUT)    
LFWD = Signal(18,Pin.OUT)
RFWD = Signal(21,Pin.OUT)    
RBAK = Signal(22,Pin.OUT) 

LPOW = PWM(Pin(19))
LPOW.freq(50)
LPOW.duty(0) #esp32 requires just "duty" from 0-1023
RPOW = PWM(Pin(23))
RPOW.freq(50)
RPOW.duty(0)

def LeftDir(forward : bool):
    if(forward):
        LFWD.on()
        LBAK.off()
    else:
        LFWD.off()
        LBAK.on()

def RightDir(forward : bool):
    if(forward):
        RFWD.on()
        RBAK.off()
    else:
        RFWD.off()
        RBAK.on()
        

def Throttle(frac):
    #'''sets the pwm duty cycle of both wheels to input, where input is 0-1.0'''
    if(frac >= 0.0 and frac <=1.0 ):
        duty = frac * (1023)
        LPOW.duty( int(duty))
        RPOW.duty( int(duty))
    else:
        print("duty cycle must be between 0 and 1")

def Left():
    LeftDir(BACKWARD)
    RightDir(FORWARD)
    Throttle(.5)

def Right():
    LeftDir(FORWARD)
    RightDir(BACKWARD)
    Throttle(.5)

def Backward():
    LeftDir(BACKWARD)
    RightDir(FORWARD)
    Throttle(1.0)

def Forward():
    LeftDir(FORWARD)
    RightDir(FORWARD)
    Throttle(1.0)

def Stop():
    Throttle(0.0)

if(__name__=="__main__"):
    led = Pin(2, Pin.OUT)
    s = Signal(led)
    for i in range(4):
        Left()
        sleep_ms(1000) # it turns out lightsleep turns off all the pins.
        Right()
        sleep_ms(1000)
        #Forward()
        #lightsleep(500)
        #Left()
        #lightsleep(300)
        #print("looped")
    Stop()
