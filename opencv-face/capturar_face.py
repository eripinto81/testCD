# sudo apt install python3-pip
# sudo pip3 install opencv-contrib-python

import numpy as np
import cv2
import os

classificador= cv2.CascadeClassifier("haarcascade-frontalface-default.xml")
classificadorOlho= cv2.CascadeClassifier("haarcascade-eye.xml")
camera= cv2.VideoCapture(0)

numeroAmostra= 10
amostra= 0

identificador= input('Informe ID: ')
largura, altura= 220, 220

caminhos= [os.path.join('base', f) for f in os.listdir('base')]
ids= []
for caminhoImagem in caminhos:
	id= int(caminhoImagem.split('.')[0].split('/')[1])
	ids.append(id)
# Last ID
codigo= int(max(ids)) + 1

while(True):
	conectado, imagem= camera.read()
	imagemCinza= cv2.cvtColor(imagem, cv2.COLOR_BGR2GRAY)
	faceDetectada= classificador.detectMultiScale(imagemCinza, 1.3, 5)
	for (x,y,l,a) in faceDetectada:
		cv2.rectangle(imagem, (x,y), (x+l, y+a), (0,0,255), 2)
		regiao= imagem[y:y+a, x:x+l]
		regiaoCinzaOlho= cv2.cvtColor(regiao, cv2.COLOR_BGR2GRAY)
		olhoDetectado= classificadorOlho.detectMultiScale(regiaoCinzaOlho)
		for (ox,oy,ol,oa) in olhoDetectado:
			cv2.rectangle(regiao, (ox, oy), (ox+ol, oy+oa), (0,255,0),2)
			# Detected eye
			if cv2.waitKey(1) & 0xFF == ord('q'):
				if np.average(imagemCinza) > 110:
					imagemFace= cv2.resize(imagemCinza[y:y+a, x:x+l], (largura, altura))
					cv2.imwrite("base/"+str(codigo)+"."+str(identificador)+"."+str(amostra)+".jpg", imagemFace)
					print("[Foto "+str(amostra)+" capturada com sucesso]")
					amostra= amostra +1
	cv2.imshow("Face", imagem)
	cv2.waitKey(1)
	if(amostra >= numeroAmostra):
		break
print("Captura finalizada!")
camera.release()
cv2.destroyAllWindows()