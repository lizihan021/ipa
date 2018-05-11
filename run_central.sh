# rm ipa-middle-server/model/robot.sqlite
# sqlite3 ipa-middle-server/model/robot.sqlite < ipa-middle-server/sql/schema.sql
# sqlite3 ipa-middle-server/model/robot.sqlite < ipa-middle-server/sql/data.sql
# echo "reset finish!"
cd ./ipa-middle-server/
node_modules/.bin/babel-node main.js
