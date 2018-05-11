Intellectual Personal Assistant (IPA)
===

### 1. Introduction

Intellectual Personal Assistant (IPA) project is intended to build a crowd-sourcing robot platform to provided cheap and easy-to-use robot to researchers and the public. The platform enables crowd workers and AI algorithms to control robots remotely. The platform is composed of two parts: a middle server and a robot controller.

##### 1.1. Hardware Requirements:

Raspberry Pi 2/3, iRobot, Microsoft Kinect build 1404. 

### 2. How to install

On the Raspberry Pi (RPi), run: `./setup_system.sh`, which will install Kinect dependencies on RPi.

On your computer/server, first install `Node.js`, then run: `./setup_central.sh`, which will install middle server dependencies. 

### 3. How to use

To start the robot controller:

- If the IP address of your robot can be directly reached from the middle server, run `./robot-server/main.py open`. 
- Else run `./robot-server/main.py local`. (Choose local if you are not sure)

To start the middle server. run: `./run_central.sh`, 

### 4. Tech Spec

##### 4.1. Robot Controller

The robot controller is located at `./robot-server/main.py`. The script will first try to put the IP address of itself on a shared public database. Then the script will try to connect iRobot.

If the script is ran with argument `local`, it will connect itself to a database and listen to commands in the database. Middle server will update command in the database. If the argument is `open`, it will open port 3000 and directly listen to GET request from the port. 

By default the robot will **keep acting one operation until it receives another one**. This is a table of all possible actions:

| Number | GET URI (open) | Database (local) | Behaviour                  |
| ------ | -------------- | ---------------- | -------------------------- |
| 1      | /control/up    | up               | Move up                    |
| 2      | /control/down  | down             | Move down                  |
| 3      | /control/left  | left             | Turn left                  |
| 4      | /control/right | right            | Turn right                 |
| 5      | /control/beep  | beep             | Beep once                  |
| 6      | /control/stop  | stop             | Stop the current operation |
| 7      | /control/reset | reset            | Reset iRobot               |

##### 4.2. Robot Video Feedback

Under `open` mode, if everything works well and Kinect is connected to RPi, video feedback can be retrieved from URI `/video_feed`. **Video feedback under `local` mode is still in development.** 


##### 4.3. Middle server

The middle server resides in the `ipa-middle-server` folder. The middle server send the control command to the correct robot that user choose in the main page.

To use the middle server, go to `ipa-middle-server/sql` folder, change the `data.sql` script to configure the robot ip and initial commands, the schema is set as follows:

-`robots`: configure the robot ip and robot id
-`commands` configure the initial command that the robot can recognize, each command is format as "direction time direction time"
-`confuses`: configure the initial commands that the robot can not understand, normally set to be empty.

After this run
```
sh reset_test_db.sh
```



