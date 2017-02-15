# Connects to database and takes control of robot of _id: 1
from Tkinter import *
import sys
from pymongo import MongoClient

TEXTWIDTH = 40  # window width, in characters
TEXTHEIGHT = 16  # window height, in lines

helpText = """\
Supported Keys:
p\tPassive
s\tSafe
f\tFull
c\tClean
d\tDock
r\tReset
b\tBeep
Space\tStop
Arrows\tMotion -- Toggle based

If nothing happens after you connect, try pressing 'P' and then 'S' to get into safe mode.
"""

class DriveApp(Tk):
    def __init__(self):
        Tk.__init__(self)
        self.title("Network Drive")
        self.option_add('*tearOff', False)

        self.menubar = Menu(self)
        self.configure(menu=self.menubar)

        createMenu = Menu(self.menubar, tearoff=False)
        self.menubar.add_cascade(label="Create", menu=createMenu)

        self.text = Text(self, height=TEXTHEIGHT, width=TEXTWIDTH, wrap=WORD)
        self.scroll = Scrollbar(self, command=self.text.yview)
        self.text.configure(yscrollcommand=self.scroll.set)
        self.text.pack(side=LEFT, fill=BOTH, expand=True)
        self.scroll.pack(side=RIGHT, fill=Y)

        self.text.insert(END, helpText)

        self.bind("<Key>", self.callbackKey)

    # outputs command to GUI
    def output(self, command):
        self.text.insert(END, command + '\n')
        self.text.see(END)

    def sendCommand(self, command):
        try:
            roboCommand = command.encode()
            print roboCommand

            commands.update_one(
                {'_id': 1},
                {
                    "$set":{
                        'command': roboCommand
                    }
                }
            )
        except:
            print("Send failed")

            sys.exit()

        self.output(command)

    def sendMessage(self, message):
        try:
            print message

            commands.update_one(
                {'_id': 1},
                {
                    '$set':{
                        'message': message
                    }
                }
            )
        except:
            print("Send failed")

        self.output(message)

    def callbackKey(self, event):
        key = event.keysym.upper()

        if key == 'UP':
            self.sendCommand('145 1 244 1 244')
        elif key == 'DOWN':
            self.sendCommand('145 254 44 254 44')
        elif key == 'LEFT':
            self.sendCommand('145 0 200 255 56')
        elif key == 'RIGHT':
            self.sendCommand('145 255 56 0 200')
        elif key == 'P':
            self.sendCommand('128')
        elif key == 'S':
            self.sendCommand('131')
        elif key == 'F':
            self.sendCommand('132')
        elif key == 'R':
            self.sendCommand('7')
        elif key == 'D':
            self.sendCommand('143')
        elif key == 'B':
            self.sendCommand('140 3 1 64 16 141 3')
        elif key == 'SPACE':
            self.sendCommand('145 0 0 0 0')
        elif key == 'Q':
            self.sendMessage('Hello!')
        elif key == 'W':
            self.sendMessage('Goodbye!')
        else:
            print("Not recognized")


if __name__ == "__main__":

    try:
        client = MongoClient('mongodb://admin:admin@ds149069.mlab.com:49069/ipa_robot')
        db = client.ipa_robot
        commands = db.commands
        print("Connected")
    except:
        print("Unable to connect to database")
        sys.exit()

    try:
        commands.insert_one(
            {
                '_id': 1,
                'type': 'robot',
                'command': '131',
                'message': 'Hello!'
            }
        )
        print("New robot detected")

        app = DriveApp()
        app.mainloop()
    except:
        app = DriveApp()
        app.mainloop()


