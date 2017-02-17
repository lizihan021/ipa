/**
 * Created by aksha on 2/17/2017.
 */

Controls = {
    readControls: function (event) {
        switch (event.keyCode) {
            case 37:    //LEFT
                this.sendCommand('145 0 200 255 56');
                console.log('Command send: left');
                break;
            case 38:    //UP
                this.sendCommand('145 1 244 1 244');
                console.log('Command send: forward');
                break;
            case 39:    //RIGHT
                this.sendCommand('145 255 56 0 200');
                console.log('Command send: right');
                break;
            case 40:    //DOWN
                this.sendCommand('145 254 44 254 44');
                console.log('Command send: back');
                break;
            case 32:    //SPACE
                this.sendCommand('145 0 0 0 0');
                console.log('Command send: stop');
                break;
            case 80:    //p
                this.sendCommand('128');
                console.log('Command send: passive mode');
                break;
            case 83:    //s
                this.sendCommand('131');
                console.log('Command send: safe mode');
                break;
            case 66:    //b
                this.sendCommand('140 3 1 64 16 141 3');
                console.log('Command send: beep');
                break;
            case 81:    //q
                this.sendMessage('Hello!');
                console.log('Message send: hello');
                break;
            case 87:    //w
                this.sendMessage('Goodbye!');
                console.log('Message send: goodbye');
                break;
        }
    },
    sendCommand: function (command) {
        RobotList.update(
            {
                '_id': '1'
            },
            {
                $set:{'command': command}
            }
        );
    },
    sendMessage: function (message) {
        RobotList.update(
            {
                '_id': '1'
            },
            {
                $set:{'message': message}
            }
        )
    }
};