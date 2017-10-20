import sys, serial

helpText = """\
Supported Keys:
p\tPassive
s\tSafe
f\tFull
c\tClean
d\tDock
r\tReset
b\tBeep
Space\tStop
Arrows\tMotion -- Toggle based

If nothing happens after you connect, 
try pressing 'P' and then 'S' to get into safe mode.
"""

def sendCommand(serial, input):
    cmd = ''
    for nums in input.split():
        cmd += chr(int(nums))

    serial.write(cmd)

command_dict = \
{
	'UP': '145 1 244 1 244',
	'DOWN': '145 254 44 254 44',
	'LEFT': '145 0 200 255 56',
	'RIGHT': '145 255 56 0 200',
	'P': '128',
	'S': '131',
	'F': '132',
	'R': '7',
	'D': '143',
	'B': '140 3 1 64 16 141 3',
	'SPACE': '145 0 0 0 0'
}


print 'HI'