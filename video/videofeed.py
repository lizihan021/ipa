from flask import Flask, render_template, Response
import freenect
import cv2
import numpy as np
import sys

class Camera(object):
    def __init__(self):
        print('Camera init')
    def get_frame():
        array,_ = freenect.sync_get_video()
        array = cv2.cvtColor(array,cv2.COLOR_RGB2BGR)

        frame = array
        #cv2.imshow('RGB',frame)
        ret, jpeg = cv2.imencode('.jpg',frame)
        return jpeg.tobytes()


app = Flask(__name__, template_folder='/home/pi/Desktop/camera/templates')

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
    app.run(host='35.0.59.73', port=5003, threaded=True)
