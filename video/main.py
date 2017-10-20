from flask import Flask, render_template, Response, g
from pymongo import MongoClient
import numpy as np
import socket

import freenect
import cv2
import sys, serial, time

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

def sendCommand(serial, input):
    cmd = ''
    for nums in input.split():
        cmd += chr(int(nums))
    serial.write(cmd)

app = Flask(__name__, template_folder='templates')

@app.route('/')
def index():
    return render_template('index.html')


def gen():
    while True:
        array,_ = freenect.sync_get_video()
        array = cv2.cvtColor(array,cv2.COLOR_RGB2BGR)
        output = array
        ret, jpeg = cv2.imencode('.jpg',output)
        frame = jpeg.tostring()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')

@app.route('/video_feed')
def video_feed():
    return Response(gen(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/control/up')
def control_up():
    sendCommand(ser, command_dict['UP'])
    time.sleep(0.4)
    sendCommand(ser, command_dict['SPACE'])
    return ''
@app.route('/control/down')
def control_down():
    sendCommand(ser, command_dict['DOWN'])
    return ''
@app.route('/control/right')
def control_right():
    sendCommand(ser, command_dict['RIGHT'])
    return ''
@app.route('/control/left')
def control_left():
    sendCommand(ser, command_dict['LEFT'])
    return ''
@app.route('/control/reset')
def control_reset():
    ser = serial.Serial('/dev/ttyUSB0', 115200)
    sendCommand(ser, command_dict['P'])
    sendCommand(ser, command_dict['S'])
    sendCommand(ser, command_dict['B'])
    return ''
@app.route('/control/stop')
def control_stop():
    sendCommand(ser, command_dict['SPACE'])
    return ''
@app.route('/control/beep')
def control_beep():
    sendCommand(ser, command_dict['B'])
    return ''

if __name__ == '__main__':
    # Try to connect the ip server
    port = 3000
    try:
        client = MongoClient("mongodb://admin:admin@ds149069.mlab.com:49069/ipa_robot",\
                            serverSelectionTimeoutMS=3000)
        db = client.ipa_robot
        commands = db.commands
    except:
        print("Unable to connect to database")
        sys.exit()

    # Try to get local ip
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.connect(("8.8.8.8", 80))
    robot_ip = s.getsockname()[0]
    s.close()
    print "ip:", robot_ip
    # try to put ip on the server
    print("Try to put ip on the server")
    try:
        commands.insert_one({
            '_id': 1,
            'type': 'robot',
            'command': '131',
            'message': str(robot_ip)+":"+str(port)
        })
    except:
        try:
            commands.update_one(
                {'_id': 1},
                {
                    '$set':{
                        'message': str(robot_ip)+":"+str(port)
                    }
                }
            )
        except:
            print("fail to put ip on server.")

    print("Trying to start serial:")
    ser = serial.Serial('/dev/ttyUSB0', 115200)
    sendCommand(ser, command_dict['P'])
    sendCommand(ser, command_dict['S'])
    sendCommand(ser, command_dict['B'])

    print("Trying to start server:")
    app.run(host="0.0.0.0", port=port, threaded=True)



