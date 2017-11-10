sudo echo 'network={
ssid="MGuest"
key_mgmt=NONE
disabled=0
}' >> /etc/wpa_supplicant/wpa_supplicant.conf

sudo echo '#!/bin/sh  
LOG="/var/log/iface_startup1.log"  
date >>$LOG
 echo "iface: $IFACE" >> $LOG  
if [ "$IFACE" = wlan0 ]; then 
	echo "wlan0 up, accepting MGuest conditions" >> $LOG 
	curl -d "buttonClicked=4&redirect_url=http://www.google.com&err_flag=0" -X POST http://1.1.1.1/login.html > /tmp/MGuestLogin.html 
fi
' > /etc/network/if-up.d/mguest.sh