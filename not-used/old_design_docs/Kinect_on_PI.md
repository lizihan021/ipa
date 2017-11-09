# Kinect on Raspberry Pi
This tutorial installs the necessary packages for getting easy access to the RGB and depth data from a Kinect sensor. Still having issue with some kinect models (i.e. 1473) and audio since MS changed the interface

## RGB and Depth
This assumes you are using a the standard Raspian Linux Distro.
If you don't know how to install packages on linux or build from source follow
this tutorial: http://www.mariolukas.de/2015/04/proof-of-concept-3d-scanner-with-kinect-and-raspberry-pi2/

1. Install required utilities packages (all listed here might not be necessary, but thorough)
- `sudo apt-get update`
- `sudo apt-get install build-essential pkg-config git-core git cmake cmake-curses-gui freeglut3 freeglut3-dev libxmu-dev libxi-dev libudev-dev`

2. Install required Python and OpenCV packages
- `sudo apt-get install python-dev ipython python-opencv python-numpy python-scipy`

3. Install libusb
- Option 1:
    - this package should be in the default apt repo now so doing `sudo apt-get install libusb-1.0-0-dev` should work
    - incase it doesn't see option 2
- Option 2:
    - Go to this link and download the latest source http://libusb.info/
    - Unpack the tarball and open the `INSTALL` file and follow the directions to make and install

4. Install libfreenect
- `git clone https://github.com/OpenKinect/libfreenect.git`
- Turn off BUILD_EXAMPLES
- Check the README or posted tutorial above on how to configure
- after make and installation navigate to `wrappers/python` of the libfreenect main directory
- `sudo python setup.py install`



Please just follow https://naman5.wordpress.com/2014/06/24/experimenting-with-kinect-using-opencv-python-and-open-kinect-libfreenect/ 

## Audio
Older models of the Kinect (before 1473) should work out of the box. 1473 requires firmware to be loaded to the Kinect using a script named `fwfetcher.py`. We are still working on this part of the tutorial
