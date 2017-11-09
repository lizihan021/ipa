# Power
**check the spread sheet in slack for latest decisions**

So I have been thinking more about the whole soldering/splicing issue vs using an external battery. We have a lot of devices to power and the roomba’s unregulated voltage supply has a `200mA` fuse. So we might actually need an external battery. The power level of it depending how many devices we want to run off of it. We might have to do a little soldering even if we get an external battery to just make the connectors work out but it will be a lot easier then access the roomba's power supplied through the miniDin.

## Devices to power:
 - Kinect                             12v @ 1A
 - Projector (has built in speaker)   12v @ 1A
 - RaspberryPi 3                       5v @ 2A

 - Speakers (the models we have rn have their own battery)
 - Microphone (incase kinect model 1473 won't work)

## Projector
One good option but *expensive* might be:
https://www.amazon.com/AAXA-Projector-1280x800-Resolution-Mini-VGA/dp/B005Q2EGG6/ref=pd_cp_229_1?ie=UTF8&psc=1&refRID=0FCTYF8DZBP02B46QQDE
After doing some research I think the key to our projector will be lumens. Current model is only 33
So really we don't need one as expensive as above. Any improvement in lumens will be good
http://www.aaxatech.com/products/p2_pico_projector.htm
 - > 800x600 *native* resolution
 - > 33 lumens
 - built in Speakers
 - power by USB         
 - has internal battery (could just keep plugged in at all times)

*Not sure if we can beat that while being on USB power...*

## Battery
https://www.amazon.com/XTPower-MP-10000-External-10000mAh-included/dp/B00935L44E/ref=sr_1_2?ie=UTF8&qid=1469049436&sr=8-2&keywords=portable+battery+pack+with+dc
Outputs:
 - USB                                5v @ 2.1A       --> Pi
 - USB                                5v @ 2.1A       --> Projector / Speakers
 - DC nipple                          9v - 12v @ 2A   --> Kinect

Pi USB (need to be careful here not to drain too much)
 - 1: Kinect (might need powered USB hub but in our testing when the device comes up it works fine, LOL)
 - 2: Microphone (if needed)
 - 3:
 - 4:
