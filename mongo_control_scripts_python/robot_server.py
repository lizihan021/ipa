# Connects to database and reads current command
# of robot of _id 1

from pymongo import MongoClient
import sys, serial

def sendCommand(serial, input):
    cmd = ''
    for nums in input.split():
        cmd += chr(int(nums))

    serial.write(cmd)


if __name__ == "__main__":

    try:
        client = MongoClient("mongodb://admin:admin@ds149069.mlab.com:49069/ipa_robot")
        db = client.ipa_robot
        commands = db.commands
    except:
        print("Unable to connect to database")
        sys.exit()


    while True:
        ser = serial.Serial('/dev/ttyUSB0', 115200)
        prevCommand = ""

        while True:
            # update cursor with current status of robot
            cursor = commands.find({'_id': 1})

            # read current command, and send to roomba
            for x in cursor:
                command = x['command']

                if (command != prevCommand):
                    print command
                    sendCommand(ser, command.decode())
                prevCommand = command

    print("Connection closed")
