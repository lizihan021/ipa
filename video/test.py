from flask import Flask, render_template, Response
from pymongo import MongoClient
import numpy as np
import sys
import socket
# import freenect
# import cv2

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
        'message': str(robot_ip)
    })
except:
    commands.update_one(
        {'_id': 1},
        {
            '$set':{
                'message': str(robot_ip)
            }
        }
    )