#!/usr/bin/env python
# -*- coding: utf-8 -*-
# 28 July 2016
# Justin Parus & Anthony Tung
# CRO+MA
# IPA_Network_Drive_c.py Client Version
# takes in HOST ip address and attempts to connect


# Some code and ideas from http://www.irobot.com/~/media/MainSite/Files/About/STEM/Create/Create2_TetheredDrive.py
# Here is the liscense:
###########################################################################
# Copyright (c) 2015 iRobot Corporation
# http://www.irobot.com/
#
# Redistribution and use in source and binary forms, with or without
# modification, are permitted provided that the following conditions
# are met:
#
#   Redistributions of source code must retain the above copyright
#   notice, this list of conditions and the following disclaimer.
#
#   Redistributions in binary form must reproduce the above copyright
#   notice, this list of conditions and the following disclaimer in
#   the documentation and/or other materials provided with the
#   distribution.
#
#   Neither the name of iRobot Corporation nor the names
#   of its contributors may be used to endorse or promote products
#   derived from this software without specific prior written
#   permission.
#
# THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
# "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
# LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
# A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
# OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
# SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
# LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
# DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
# THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
# (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
# OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
###########################################################################

from tkinter import *
import os, sys, socket

HOST = ''   # will be set from CMD arguments
PORT = 1234
TEXTWIDTH = 40 # window width, in characters
TEXTHEIGHT = 16 # window height, in lines

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
    def __init__(self, socket):
        Tk.__init__(self)
        self.title("Network Drive")
        self.option_add('*tearOff', FALSE)

        self.menubar = Menu()
        self.configure(menu=self.menubar)

        createMenu = Menu(self.menubar, tearoff=False)
        self.menubar.add_cascade(label="Create", menu=createMenu)


        self.text = Text(self, height = TEXTHEIGHT, width = TEXTWIDTH, wrap = WORD)
        self.scroll = Scrollbar(self, command=self.text.yview)
        self.text.configure(yscrollcommand=self.scroll.set)
        self.text.pack(side=LEFT, fill=BOTH, expand=True)
        self.scroll.pack(side=RIGHT, fill=Y)

        self.text.insert(END, helpText)

        self.bind("<Key>", self.callbackKey)

        self.socket = socket

    # outputs command to GUI
    def output(self, command):
        self.text.insert(END, command + '\n')
        self.text.see(END)


    def sendCommand(self, command):
        try:
            self.socket.send(command.encode())
        except:
            print("Send failed")
            self.socket.close()
            sys.exit()

        self.output(command)


    def callbackKey(self, event):
        key = event.keysym.upper()

        if   key == 'UP':
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
        else:
            print("Not recognized")


if __name__ == "__main__":

    if len(sys.argv) != 2:
        print("Need one argument as HOST IP")
        sys.exit()
    else:
        HOST = sys.argv[1]

    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    try:
        sock.connect((HOST, PORT))
    except:
        print("Cannot connect")
        sys.exit()

    print("Connected")

    app = DriveApp(sock)
    app.mainloop()
