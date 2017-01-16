Robot_control_client.py
  Requires: Tkinter, sys, socket
  Prompts user to enter server IP address (i.e. IP address of the Pi on the robot you want to control)
  Establishes socket connection with server at IP address
  Creates a tkinter GUI 
  Receives keyboard inputs, translates them into Roomba commands, and sends commands to the server
Robot_server.py
  Requires: sockets, sys, serial
  Listens for attempts to connect to its IP address (i.e. the control client)
  Accepts connection, and continues listening for data
  Upon receiving data, checks if data is of a “command” object (something the Roomba can understand)
  If successful, sends command through serial port of Pi defined as /dev/ttyUSB0, hopefully to be received by the Roomba 
  Instructions:
  Make sure the computer you want to control from and the Pi of the robot you want to control are on the same network
  Run robot_server.py on a Pi connected to the Roomba through its serial USB port
  Run robot_control_client.py on the computer you which to control from and enter IP address of the server 
  Follow onscreen instructions 
