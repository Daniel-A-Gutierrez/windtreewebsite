import math

speed_min = 10
def GetCommand(buf):
    global speed_min
    x=0
    y=0
    ret = [-1,-1]
    #buf must have a length of at least 4.
    if len(buf)<4:return ret
    
    #if spt contains exactly 1 "P"
    spt = buf.split('P')
    if len(spt)==2: #左摇杆 left stick
        #the character after P should be a number. 
        x=int(spt[1])-128
        spt1=spt[0].split('W')
        #there should be a W in buf before the P.
        #if there is, our Y value follows it.
        if len(spt1)==2:
            y=0-(int(spt1[1])-128)
            
        #set up a deadzone for the joystick
        if math.fabs(x) <= 10 : x=0
        if math.fabs(y) <= 10 : y=0
        
        # return 0,-1 for a joystick that is centered
        if x==0 and y==0:
            return [0,-1]
        
        if math.fabs(x)>math.fabs(y):
            if x>0:
                ret[0]=6 #right
            else:
                ret[0]=8 #left
            ret[1]= math.ceil(speed_min+math.fabs(x)*(100-speed_min)/128)
        else:
            if y>0:
                ret[0]=5 #up
            else:
                ret[0]=7 #down
            ret[1] = math.ceil(speed_min+math.fabs(y)*(100-speed_min)/128)
        return ret
    
    #if spt contains exactly 1 "S"
    spt = buf.split('S')
    if len(spt)==2: #右摇杆 right stick
        x=int(spt[1])-128
        spt1=spt[0].split('Q')
        if len(spt1)==2:
            y=0-(int(spt1[1])-128)
            
        #create joystick deadzone
        if math.fabs(x) <= 10 : x=0
        if math.fabs(y) <= 10 : y=0
        if x==0 and y==0:
            return [-1,-1]
        if math.fabs(x)>math.fabs(y):
            if x>0:
                ret[0]=14 #right
            else:
                ret[0]=16 #left
            ret[1]= math.ceil(math.fabs(x))
        else:
            if y>0:
                ret[0]=13 #up
            else:
                ret[0]=15 #down
            ret[1] = math.ceil(math.fabs(y))
        return ret
    return ret

def DecodeCMD(uart,cmd):
    cmds=[-1,-1]
    buff=''
    if cmd=='W' or cmd=='Q':
        buff = cmd
        while 1:
            if uart.any():
                b=uart.read(1).decode()
                if b=='\n':
                    break
                buff = buff+ b
        buff = buff.strip()
        if len(buff)>=4:
            return GetCommand(buff)
        else:
            pass
    elif cmd == 'A': cmds[0]=25 #l button fwd
    elif cmd == 'B': cmds[0]=27 #l button bak
    elif cmd == 'C': cmds[0]=28 #l button left
    elif cmd == 'D': cmds[0]=26 #l button right
    elif cmd == 'E': cmds[0]=0 # stop
    elif cmd == 'I': cmds[0]=13 #firing angle increase
    elif cmd == 'L': cmds[0]=14 #firing angle increment
    elif cmd == 'J': cmds[0]=15 #firing angle decrease
    elif cmd == 'K': cmds[0]=16 #firing angle decrement
    elif cmd == 'M': cmds[0]=12 #fire
    elif cmd == 'F': cmds[0]=9 #small left turn
    elif cmd == 'N': cmds[0]=10 #small right turn
    else:
        print(cmd)
    return cmds

