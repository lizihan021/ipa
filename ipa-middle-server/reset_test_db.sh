rm model/robot.sqlite
sqlite3 model/robot.sqlite < sql/schema.sql
sqlite3 model/robot.sqlite < sql/data.sql
echo "reset finish!"
