from flask import Flask, request, jsonify, Blueprint

ocr= Blueprint('ocr', __name__)

# import the necessary packages
from imutils.object_detection import non_max_suppression
from imutils.video import VideoStream
from imutils.video import FPS
from datetime import datetime
from PIL import Image

import pytesseract
import numpy as np
import argparse
import imutils
import time
import cv2
import sys
import os

# copiar imagem
def crop(image_path, coords, saved_location):
  image_obj= Image.open(image_path)
  cropped_image= image_obj.crop(coords)
  cropped_image.save(saved_location)
  cropped_image.show()

# verificar se numero
def isNumber(string):
	if string == '0' or string == '1' or string == '2' or string == '3' or string == '4' or string == '5' or string == '6' or string == '7' or string == '8' or string == '9':
		return True
	else:
		return False

# construct the argument parser and parse the arguments
ap= argparse.ArgumentParser()
ap.add_argument("-east", "--east", type=str, required=True, help="path to input EAST text detector")
ap.add_argument("-v", "--video", type=str, help="path to optinal input video file")
ap.add_argument("-c", "--min-confidence", type=float, default=0.5, help="minimum probability required to inspect a region")
ap.add_argument("-w", "--width", type=int, default=320,	help="resized image width (should be multiple of 32)")
ap.add_argument("-e", "--height", type=int, default=320, help="resized image height (should be multiple of 32)")
args= vars(ap.parse_args())

def decode_predictions(scores, geometry):
	# grab the number of rows and columns from the scores volume, then
	# initialize our set of bounding box rectangles and corresponding
	# confidence scores
	(numRows, numCols)= scores.shape[2:4]
	rects= []
	confidences= []

	# loop over the number of rows
	for y in range(0, numRows):
		# extract the scores (probabilities), followed by the
		# geometrical data used to derive potential bounding box
		# coordinates that surround text
		scoresData= scores[0, 0, y]
		xData0= geometry[0, 0, y]
		xData1= geometry[0, 1, y]
		xData2= geometry[0, 2, y]
		xData3= geometry[0, 3, y]
		anglesData= geometry[0, 4, y]

		# loop over the number of columns
		for x in range(0, numCols):
			# if our score does not have sufficient probability,
			# ignore it
			if scoresData[x] < args["min_confidence"]:
				continue

			# compute the offset factor as our resulting feature
			# maps will be 4x smaller than the input image
			(offsetX, offsetY)= (x * 4.0, y * 4.0)

			# extract the rotation angle for the prediction and
			# then compute the sin and cosine
			angle= anglesData[x]
			cos= np.cos(angle)
			sin= np.sin(angle)

			# use the geometry volume to derive the width and height
			# of the bounding box
			h= xData0[x] + xData2[x]
			w= xData1[x] + xData3[x]

			# compute both the starting and ending (x, y)-coordinates
			# for the text prediction bounding box
			endX= int(offsetX + (cos * xData1[x]) + (sin * xData2[x]))
			endY= int(offsetY - (sin * xData1[x]) + (cos * xData2[x]))
			startX= int(endX - w)
			startY= int(endY - h)

			# add the bounding box coordinates and probability score
			# to our respective lists
			rects.append((startX, startY, endX, endY))
			confidences.append(scoresData[x])

	# return a tuple of the bounding boxes and associated confidences
	return (rects, confidences)

# loop over frames from the video stream
def onOCR(cam, host):
  # initialize the original frame dimensions, new frame dimensions,
  # and ratio between the dimensions
  (W, H)= (None, None)
  (newW, newH)= (args["width"], args["height"])
  (rW, rH)= (None, None)

  # define the two output layer names for the EAST detector model that
  # we are interested -- the first is the output probabilities and the
  # second can be used to derive the bounding box coordinates of text
  layerNames= ["feature_fusion/Conv_7/Sigmoid", "feature_fusion/concat_3"]

  # load the pre-trained EAST text detector
  print("[INFO] loading EAST text detector...")
  net= cv2.dnn.readNet(args["east"])

  # if a video path was not supplied, grab the reference to the web cam
  if not args.get("video", False):
    print("[INFO] starting video stream...")
    vs= VideoStream(src=cam).start()
    time.sleep(1.0)

  # otherwise, grab a reference to the video file
  else:
    vs= cv2.VideoCapture(args["video"])

  # start the FPS throughput estimator
  fps= FPS().start()

  print('Loading ocr...', cam)

  # instante atual
  data_e_hora_atual= datetime.now()
  tempo_atual= data_e_hora_atual.strftime('%Y/%m/%d %H:%M:%S')

  imagem_original= f"../tmp/imagem_original-{str(host)}.png"
  imagem_original_ocr= f"../tmp/imagem_original_ocr-{str(host)}.png"
  font= cv2.FONT_HERSHEY_DUPLEX
  bordaMargem= 5

  while True:
    # grab the current frame, then handle if we are using a
    # VideoStream or VideoCapture object
    frame= vs.read()

    # check to see if we have reached the end of the stream
    if frame is not None:

      frame= frame[1] if args.get("video", False) else frame

      # resize the frame, maintaining the aspect ratio
      frame= imutils.resize(frame, width=1000)
      frame_copia= frame.copy()

      # if our frame dimensions are None, we still need to compute the
      # ratio of old frame dimensions to new frame dimensions
      if W is None or H is None:
        (H, W)= frame.shape[:2]
        rW= W / float(newW)
        rH= H / float(newH)

      # resize the frame, this time ignoring aspect ratio
      frame= cv2.resize(frame, (newW, newH))

      # construct a blob from the frame and then perform a forward pass
      # of the model to obtain the two output layer sets
      blob= cv2.dnn.blobFromImage(frame, 1.0, (newW, newH), (123.68, 116.78, 103.94), swapRB=True, crop=False)
      net.setInput(blob)
      (scores, geometry)= net.forward(layerNames)

      # decode the predictions, then  apply non-maxima suppression to
      # suppress weak, overlapping bounding boxes
      (rects, confidences)= decode_predictions(scores, geometry)
      boxes= non_max_suppression(np.array(rects), probs=confidences)

      # loop over the bounding boxes
      for (startX, startY, endX, endY) in boxes:
        # scale the bounding box coordinates based on the respective
        # ratios
        startX= int(startX * rW)
        startY= int(startY * rH)
        endX= int(endX * rW)
        endY= int(endY * rH)

        # draw the bounding box on the frame
        cv2.imwrite(imagem_original, frame_copia)
        crop(imagem_original, (startX-bordaMargem, startY-bordaMargem, endX+bordaMargem, endY+bordaMargem), imagem_original_ocr)
        OCR= pytesseract.image_to_string(imagem_original_ocr)
        
        # exemplos de modelo
        placas= ['PLA0000', 'BEE4R22', 'BOM5978', 'BRA3R52', 'AAA3333']

        # anTiGo padrao de placa
        if(len(OCR) == 8):
          if(not isNumber(OCR[0])):
            if(not isNumber(OCR[1])):
              if(not isNumber(OCR[2])):
                if(isNumber(OCR[4])):
                  if(isNumber(OCR[5])):
                    if(isNumber(OCR[6])):
                      if(isNumber(OCR[7])):
                        # draw a label with a name below the face
                        cv2.rectangle(frame_copia, (startX-bordaMargem, startY-bordaMargem), (endX+bordaMargem, endY+bordaMargem), (0, 0, 0), 2)
                        cv2.putText(frame_copia, OCR, (startX + 6, startY - 6), font, 1.0, (255, 255, 255), 1)
                        print(OCR)
        # else:
          # draw a label with a name below the face
          # if("\n".join(s for s in placas if OCR.lower() in s.lower()) and OCR != ''):
          #   print('Placa Encontrada')
        
        # nOVo padrao de placa
        if(len(OCR) == 7):
          if(not isNumber(OCR[0])):
            if(not isNumber(OCR[1])):
              if(not isNumber(OCR[2])):
                if(isNumber(OCR[3])):
                  if(not isNumber(OCR[4])):
                    if(isNumber(OCR[5])):
                      if(isNumber(OCR[6])):
                        # draw a label with a name below the face
                        cv2.rectangle(frame_copia, (startX-bordaMargem, startY-bordaMargem), (endX+bordaMargem, endY+bordaMargem), (0, 0, 0), 2)
                        cv2.putText(frame_copia, OCR, (startX + 6, startY - 6), font, 1.0, (255, 255, 255), 1)
                        print(OCR)
        # else:
          # draw a label with a name below the face
          # if("\n".join(s for s in placas if OCR.lower() in s.lower()) and OCR != ''):
          #   print('Placa Encontrada')

      # update the FPS counter
      fps.update()

      # capture frame-by-frame
      # read the camera frame
      ret, buffer= cv2.imencode('.jpg', frame_copia)
      frame_copia= buffer.tobytes()

      yield (b'--frame\r\n'
          b'Content-Type: image/jpeg\r\n\r\n' + frame_copia + b'\r\n')  
          # concat frame one by one and show result
          
    else:
            print('Frame não encontrado, reiniciando...')
            if not args.get("video", False):
              print("[INFO] starting video stream...", cam)
              vs= VideoStream(src=cam).start()
            else:
              vs= cv2.VideoCapture(args["video"])