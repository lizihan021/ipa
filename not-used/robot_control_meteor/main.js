/**
 * Created by aksha on 2/3/2017.
 */
RobotList = new Mongo.Collection('commands');

// If you want to test the app with a fake robot, uncomment below

// let robot = {
//         '_id': '1',
//         'type': 'robot',
//         'command': '131',
//         'message': 'Hello!'
// };

// RobotList.insert(robot);

if(Meteor.isClient){
    console.log('Robot control is running');

    // Define sessions that represents the message display, and the control interface
    // robotStatus: controller-end template that displays the current status of all robots
    // robotDisplay: user-end template that will be shows on iPad, which will display the current
    // message of the robot
    // robotControl: controls interface for a particular robot
    Template.body.helpers({
        showRobotDisplay() {
            return Session.get('showRobotDisplay');
        },
        showRobotControls() {
            return Session.get('showRobotControls');
        }
    });

    // Functions for robotStatus

    Template.robotStatus.helpers({
        'summary': function(){
            return RobotList.find();
        }
    });

    Template.robotStatus.events({

        'click button.user': function() {
            event.preventDefault();
            Session.set('showRobotDisplay', true);
        },
        'click button.control': function() {
            event.preventDefault();
            Session.set('showRobotControls', true);
        }
    });

    // Functions for robotDisplay

    Template.robotDisplay.helpers({
        'messages': function(){
            return RobotList.find();
        }
    });

    Template.robotDisplay.events({
        'click button.status': function() {
            event.preventDefault();
            Session.set('showRobotDisplay', false);
        }
    });

    // Functions for robotControls

    Template.robotControl.helpers({
        'controls': function(){
            let control = document.getElementById('controls');
            control.addEventListener('keydown', function(event){Controls.readControls(event)}, true);
        }
    });
}

if(Meteor.isServer){
    console.log('Robot control is connected');
}