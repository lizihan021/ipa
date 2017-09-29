from flask import Flask, render_template, Response
from pymongo import MongoClient
import numpy as np
import sys
import socket

# import freenect
# import cv2

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

if __name__ == '__main__':
    # Try to connect the ip server
    port = 3000
    try:
        client = MongoClient("mongodb://admin:admin@ds149069.mlab.com:49069/ipa_robot")
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
    try:
        commands.insert_one({
            '_id': 1,
            'type': 'robot',
            'command': '131',
            'message': str(robot_ip)+":"+str(port)
        })
    except:
        commands.update_one(
            {'_id': 1},
            {
                '$set':{
                    'message': str(robot_ip)+":"+str(port)
                }
            }
        )


    app.run(host='0.0.0.0', port=port, threaded=True)