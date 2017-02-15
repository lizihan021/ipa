<h2>Robot_control.py</h2>
  <ul>
  <li>Requires: Tkinter, sys, pymongo</li>
  <li>Connects to a mongo database, with URI specified within the code (currently hosted on mlab, contact Akshay for details)</li>
  <li>Attempts to insert a new document representing a robot, with _id=1 (will continue if already exists)</li>
  <li>Creates a tkinter GUI </li>
  <li>Receives keyboard inputs, translates them into Roomba commands, and sends commands to the document's 'command' value</li>
  <li>Can also use 'Q' and 'W' to send a prescripted message to teh docment's 'message' value</li>
  </ul>
<h2>Robot_server.py</h2>
  <ul>
  <li>Requires: pymong, sys, serial</li>
  <li>Connects to same mongo db as above</li>
  <li>Checks for existence of robot document of _id=1, and loops to check for changes in its values</li>
  <li>When a change occurs to the 'command' value, sends command through serial port of Pi defined as /dev/ttyUSB0, hopefully to be received by the Roomba </li>
  </ul>
<h2>Instructions:</h2>
  <ul>
  <li>Run robot_server.py on a Pi, which should be connected to the Roomba through its USB port</li>
  <li>Run robot_control.py on the computer you which to control from</li>
  <li>Follow onscreen instructions </li>
  </ul>

