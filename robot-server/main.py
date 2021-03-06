from flask import Flask, render_template, Response, g
from flask import request
import numpy as np
import socket
import urllib2
from pymongo import MongoClient

import freenect
import unirest
import cv2
import sys, serial, time
import requests
import thread
import tempfile

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
# control code that will be send to robot 
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

command_to_control = \
{
    "up": "UP",
    "down": "DOWN",
    "left": "LEFT",
    "right": "RIGHT",
    "beep": "B",
    "stop": "SPACE",
}

def get_serial():
    try:
        ser = serial.Serial('/dev/ttyUSB0', 115200)
        sendCommand(ser, command_dict['P'])
        sendCommand(ser, command_dict['S'])
        sendCommand(ser, command_dict['B'])
        print("Success on USB0!")
        return ser
    except:
        try:
            ser = serial.Serial('/dev/ttyUSB1', 115200)
            sendCommand(ser, command_dict['P'])
            sendCommand(ser, command_dict['S'])
            sendCommand(ser, command_dict['B'])
            print("Success on USB1!")
            return ser
        except:
            print("Fail to find robot!")
            return None
    

def control_time(ser, command, sleep_time = 0.4):
    if command == "reset":
        sendCommand(ser, command_dict['P'])
        sendCommand(ser, command_dict['S'])
        sendCommand(ser, command_dict['B'])
    else:
        if command in command_to_control:
            # add move discrate here
            sendCommand(ser, command_dict[command_to_control[command]])
            # time.sleep(sleep_time)
            # sendCommand(ser, command_dict["SPACE"])

# send commands to robot through serial
def sendCommand(serial, input):
    cmd = ''
    for nums in input.split():
        cmd += chr(int(nums))
    serial.write(cmd)


# the server app
app = Flask(__name__, template_folder='templates')

@app.route('/')
def index():
    return render_template('index.html')


# get video stream 
def gen():
    folder = "robot-server/robot_img/"
    counter = 0
    while True:
        try:
            time.sleep(2)
            img_array, timestamp = freenect.sync_get_video()
            img_array = cv2.cvtColor(img_array,cv2.COLOR_RGB2BGR)
            ret, jpeg = cv2.imencode('.jpg', img_array)
            cv2.imwrite(folder + str(timestamp) + 'image.png', img_array)

            depth_array, _ = freenect.sync_get_depth()
            depth_array = depth_array.astype(np.uint8)
            cv2.imwrite(folder + str(timestamp) + 'depth.png', depth_array)
            
            print folder + str(timestamp) + 'depth.png'

            r = requests.post('http://35.0.21.172:3000/api/Upload', \
                files=[('imgUploader', open(folder + str(timestamp) + "image.png", "rb")), \
                       ('imgUploader', open(folder + str(timestamp) + "depth.png", "rb"))])
            #thread.start_new_thread(someFunc, (jpeg,))

            frame = jpeg.tostring()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')
        except KeyboardInterrupt:
            break
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + b'\r\n\r\n')


@app.route('/video_feed')
def video_feed():
    print("teste")
    return Response(gen(),mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/control/<command>')
def control(command):
    # print(reqeust.args.get('time'))
    control_time(ser, command) #, reqeust.args.get('time'))
    return str(command) #reqeust.args.get('time'))

if __name__ == '__main__':
    #####
    robot_id = 1
    #####
    # for insertion.
    if len(sys.argv) < 2:
        print "Useage: python main.py [open/local]"
        exit(0)
    port = 3000

    unirest.timeout(3)
    # Try to get local ip
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.connect(("8.8.8.8", 80))
    robot_ip = s.getsockname()[0]
    s.close()
    print "ip:", robot_ip
    # try to put ip on the server
    print("Try to put ip on the server")
    try:
        urllib2.urlopen("http://www.sjtusaa.website/setip/"+str(robot_id)+'/'+robot_ip)
        print("Success")
    except:
        print("Fail to put ip on server.")
    ########################################
    if sys.argv[1] == "open":
        print("Trying to start serial:")
        ser = get_serial()

        print("Trying to start server:")
        try:
            app.run(host="0.0.0.0", port=port, threaded=True)
        except KeyboardInterrupt:
            ser.close()
    #########################################
    elif sys.argv[1] == "local":
        print("Try to connect to Mongo")
        try:
            client = MongoClient("mongodb://admin:admin@ds127936.mlab.com:27936/ipa_robot")
            db = client.ipa_robot
            commands = db.commands
            print("Success!")
        except:
            print("Unable to connect to database")
            sys.exit()

        print("Try to update Mongo")
        post = {'_id': robot_id, 'type': 'robot', 'command': 'stop', 'message': 'Hello!' }
        try:
            commands.insert_one(post)
        except:
            try:
                commands.update_one({'_id':robot_id}, {"$set": post}, upsert=False)
                print("robot exist")
            except:
                print("fail")

        while True:
            ser = get_serial()

            while True:
                cursor = commands.find({'_id': robot_id})

                for x in cursor:
                    command = x['command']
                    if (command != "stop"):
                        control_time(ser, command.decode(), 0.4)
                        commands.update_one({'_id':robot_id}, {"$set": post}, upsert=False)
