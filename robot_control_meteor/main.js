/**
 * Created by aksha on 2/3/2017.
 */

RobotList = new Mongo.Collection('robots');

// If you want to test the app with a fake robot, uncomment below

// var robot = {
//         '_id': 1,
//         'type': 'robot',
//         'command': '131',
//         'message': 'Hello!'
// };
//
// RobotList.insert(robot);

if(Meteor.isClient){
    console.log('Robot control is running');

    // Define session that represents the message display
    // robotStatus: controller-end template that displays the current status of all robots
    // robotDisplay: user-end template that will be shows on iPad, which will display the current
    // message of the robot
    Template.body.helpers({
        showRobotDisplay() {
            return Session.get('showRobotDisplay');
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
        }
    })
}

if(Meteor.isServer){
    console.log('Robot control is connected');
}