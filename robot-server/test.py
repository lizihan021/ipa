import unirest

def callback(response):
    print "code:"+ str(response.code)
# consume async get request
def consumeGETRequestASync(frame):
    params = {'id':"robot_id",'ip':"robot_ip", 'pic': "frame"}
    url = 'http://127.0.0.1:3000/api/uploadpicture'
    headers = {"Accept": "application/json"}
    unirest.post(url, headers = headers, params= params, callback = callback)

consumeGETRequestASync("frame")
