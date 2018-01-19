rm ipa_middle_server/model/robot.sqlite
sqlite3 ipa_middle_server/model/robot.sqlite < ipa_middle_server/sql/schema.sql
sqlite3 ipa_middle_server/model/robot.sqlite < ipa_middle_server/sql/data.sql
echo "reset finish!"
