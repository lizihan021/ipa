import freenect
import cv2
import numpy as np

class Camera(object):
    def get_frame():
        array,_ = freenect.sync_get_video()
        array = cv2.cvtColor(array,cv2.COLOR_RGB2BGR)

        frame = array
        #cv2.imshow('RGB',frame)
        ret, jpeg = cv2.imencode('.jpg',frame)
        return jpeg.tobytes()

    def get_depth():
        array,_ = freenect.sync_get_depth()
        array = array.astype(np.uint8)
        return array

