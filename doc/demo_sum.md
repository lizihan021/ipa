#### Meeting Summary & Future Work for IPA Platform

Dec / 7 2017

#### Meeting Summary

- System Structure
- Demo on controlling, video, and macro.

#### Future Work

1. Take RGBD pictures and store them on middle server with some sampling rate.

   (Eg. Store last 5 min's pictures with sampling rate of 1 pic/sec). 

2. Then provide API for getting stored pictures.

   (Eg. Give me most recent three RGB/Depth/RGBD pictures).

3. Search into https://github.com/mpromonet/v4l2rtspserver to stream video out of local WiFi. (For crowds driving robots)

4. Improve user interface (both controlling page and macro labeling page).

**Appendix:**

To make the robot easy to use, we already have:

- Robot system setup script: install all dependencies and libraries on RPi.
- MGuest script: auto connect to MGuest (no need to open a browser and click a button).
- Server system setup script: install all dependencies and libraries on central server.

We are going to:

- Make those scripts auto run at after boot. 