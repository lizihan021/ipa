rm ipa-middle-server/model/robot.sqlite
sqlite3 ipa-middle-server/model/robot.sqlite < ipa-middle-server/sql/schema.sql
sqlite3 ipa-middle-server/model/robot.sqlite < ipa-middle-server/sql/data.sql
echo "reset finish!"
