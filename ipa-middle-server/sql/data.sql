INSERT INTO robots(ip, robotid)
VALUES ('12.13.14.15', 1);

INSERT INTO robots(ip, robotid)
VALUES ('21.21.21.35', 2);

INSERT INTO commands(command, colist)
VALUES ('turn left', '1');

INSERT INTO commands(command, colist)
VALUES ('turn left then right', '12');

INSERT INTO confuses(command)
VALUES ('turn right');
