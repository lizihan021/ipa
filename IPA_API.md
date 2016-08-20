# API for IPA Robot

## Drive API
Simple python API to allow effective control of iRobot Create 2. The API was
designed with the following motivations:
 - controlled by AI or a Crowd
 - unpredictable nature of controlling robots in any environment
 -

### Protocol
Functions Provided:
 - `forward(distance)`
 - `backward(distance)`
 - `right(degrees)`
 - `left(degrees)`
 - `stop()`

The arguments of the functions `forward(), backward(), right(), left()` are
optional. When called with no argument the robot will operate the respective
command until the `stop()` function is called. This allows for effective use of
the camera depth data as well as protection against random error due to robot or
environment. Any command can be instantly overridden with another command.

The API is rooted in python right now because that is how far we have gotten. If
we move to a web interface with a server it might be useful to think about using
a REST API or raw sockets. For example moving the API abstraction to the robot
and just sending calls in JSON, or moving the abstraction closer to the server
and sending raw commands over the internets.

## Sensory API
## Peripheral Control API
