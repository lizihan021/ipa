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


def callback(response):
    print "code:"+ str(response.code)
# consume async get request
def consumeGETRequestASync(frame):
    params = {'id':robot_id,'ip':robot_ip, 'pic': frame}
    url = 'http://sjtusaa.website/api/uploadpicture'
    headers = {"Accept": "application/json"}
    # call get service with headers and params
    unirest.post(url, headers = headers, params= params, callback = callback)

# the server app
app = Flask(__name__, template_folder='templates')

@app.route('/')
def index():
    return render_template('index.html')

def someFunc(f):
    r = requests.post('http://35.0.30.117:3000/api/Upload', files={'imgUploader': f})
    f.close()

# get video stream 
def gen():
    while True:
        try:
            time.sleep(0.1)
            array,_ = freenect.sync_get_video()
            array = cv2.cvtColor(array,cv2.COLOR_RGB2BGR)
            output = array
            ret, jpeg = cv2.imencode('.jpg',output)
            frame = jpeg.tostring()
            text_file = open("Output.jpg", "w")
            text_file.write(frame)
            thread.start_new_thread(someFunc, (text_file))

            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')
        except KeyboardInterrupt:
            break
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + b'\r\n\r\n')


@app.route('/video_feed')
def video_feed():
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
