sleep 6
curl -d "buttonClicked=4&redirect_url=http://www.google.com&err_flag=0" -X POST http://1.1.1.1/login.html
python ./robot-server/main.py