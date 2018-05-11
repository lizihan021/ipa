sudo echo 'network={
ssid="MGuest"
key_mgmt=NONE
disabled=0
}' >> /etc/wpa_supplicant/wpa_supplicant.conf

sudo echo '#!/bin/sh  
curl -d "buttonClicked=4&redirect_url=http://www.google.com&err_flag=0" -X POST http://1.1.1.1/login.html
' > /etc/network/if-up.d/mguest.sh