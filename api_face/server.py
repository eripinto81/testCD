import os 

os.system('sudo forever start -c python3 run.py --east ../opencv-text/frozen_east_text_detection.pb')
#os.system('sudo forever stop -c python3 run.py --east ../opencv-text/frozen_east_text_detection.pb')