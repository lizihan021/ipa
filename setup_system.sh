sudo apt-get -qq update
sudo apt-get -qq upgrade
sudo apt-get -qq install git-core cmake freeglut3-dev pkg-config build-essential libxmu-dev libxi-dev libusb-1.0-0-dev 
sudo apt-get -qq install python-opencv python-dev python-numpy cython
git clone https://github.com/OpenKinect/libfreenect.git

cd libfreenect
mkdir build
cd build
cmake -L ..
make
sudo make install
sudo ldconfig /usr/local/lib64/
sudo adduser $USER video
sudo adduser $USER plugdev

sudo echo '# ATTR{product}=="Xbox NUI Motor" 
SUBSYSTEM=="usb", ATTR{idVendor}=="045e", ATTR{idProduct}=="02b0", MODE="0666" 
# ATTR{product}=="Xbox NUI Audio" 
SUBSYSTEM=="usb", ATTR{idVendor}=="045e", ATTR{idProduct}=="02ad", MODE="0666" 
# ATTR{product}=="Xbox NUI Camera" 
SUBSYSTEM=="usb", ATTR{idVendor}=="045e", ATTR{idProduct}=="02ae", MODE="0666" 
# ATTR{product}=="Xbox NUI Motor" 
SUBSYSTEM=="usb", ATTR{idVendor}=="045e", ATTR{idProduct}=="02c2", MODE="0666" 
# ATTR{product}=="Xbox NUI Motor" 
SUBSYSTEM=="usb", ATTR{idVendor}=="045e", ATTR{idProduct}=="02be", MODE="0666" 
# ATTR{product}=="Xbox NUI Motor" 
SUBSYSTEM=="usb", ATTR{idVendor}=="045e", ATTR{idProduct}=="02bf", MODE="0666"' > /etc/udev/rules.d/51-kinect.rules
cd ../../
echo "Set a robot id (should be an int > 0): "
read answer
line="	robot_id = $answer "
printf '%s\n' H 106i "$line" . wq | ed -s robot-server/main.py
