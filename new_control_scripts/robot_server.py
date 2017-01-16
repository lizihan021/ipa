import socket, sys, serial

HOST = socket.gethostbyname(socket.gethostname())
PORT = 8888

print('Host is: ' + HOST)

def sendCommand(serial, input):
    cmd = ''
    for nums in input.split():
        cmd += chr(int(nums))

    serial.write(cmd)


if __name__ == "__main__":

    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    try:
        sock.bind((HOST, PORT))
    except:
        print("Cannot bind")
        sys.exit()

    sock.listen(1)

    while True:
        print("Bound and Listening")
        conn, addr = sock.accept()  # blocking
        print("Connected to " + str(addr))

        ser = serial.Serial('/dev/ttyUSB0', 115200)

        while True:
            command = conn.recv(4096)
            if not command:
                print("Connection terminated")
                break
            else:
                sendCommand(ser, command.decode())

    sock.close()
    ser.close()
    print("Connection closed")
