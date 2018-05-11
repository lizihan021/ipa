INSERT INTO robots(ip, robotid)
VALUES ('12.13.14.15', 1);

INSERT INTO robots(ip, robotid)
VALUES ('21.21.21.35', 2);


-- the first number represents the command (text)
-- the second number represents the time for this command 
INSERT INTO commands(command, colist)
VALUES ('turn left', 'left 1');

INSERT INTO commands(command, colist)
VALUES ('turn left then right', 'left 1 right 1');


-- the command that the middle server does not recognize
INSERT INTO confuses(command)
VALUES ('turn right');
