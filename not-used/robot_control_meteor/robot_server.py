from pymongo import MongoClient
# import socket, sys, serial

def sendCommand(serial, input):
    cmd = ''
    for nums in input.split():
        cmd += chr(int(nums))

    serial.write(cmd)


if __name__ == "__main__":

    client = MongoClient("mongodb://admin:admin@ds149069.mlab.com:49069/ipa_robot")
    db = client.ipa_robot
    commands = db.commands


    while True:
        # ser = serial.Serial('/dev/ttyUSB0', 115200)
        prevCommand = ""

        while True:
            cursor = commands.find({'_id': 1});
            for x in cursor:
                command = x['command']

                if (command != prevCommand):
                    print command
                    # sendCommand(ser, command.decode())
                prevCommand = command

            # if not command:
            #     print("Connection terminated")
            #     break
            # else:
            #     sendCommand(ser, command.decode())

    print("Connection closed")
