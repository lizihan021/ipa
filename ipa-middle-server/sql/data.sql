INSERT INTO robots(ip, robotid, curnum)
VALUES ('12.13.14.15', 1, 0);

INSERT INTO robots(ip, robotid, curnum)
VALUES ('21.21.21.35', 2, 0);

INSERT INTO commands(command, colist)
VALUES ('turn left', '1');

INSERT INTO commands(command, colist)
VALUES ('turn left then right', '12');

INSERT INTO confuses(command)
VALUES ('turn right');