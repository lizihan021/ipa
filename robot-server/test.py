import requests
import thread

def someFunc():
	with open('a.jpg', 'rb') as f:
		r = requests.post('http://127.0.0.1:3000/api/Upload', files={'imgUploader': f})

thread.start_new_thread(someFunc, ())

a = raw_input("fda")
