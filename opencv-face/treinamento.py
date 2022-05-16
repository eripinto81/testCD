import numpy as np
import cv2
import os

# num_components => eigenfaces
# threshold => distancia minima

eigenface= cv2.face.EigenFaceRecognizer_create(num_components=50)
fisherface= cv2.face.FisherFaceRecognizer_create()
lbph= cv2.face.LBPHFaceRecognizer_create(threshold=50)

def getImageComId():
	caminhos= [os.path.join('base', f) for f in os.listdir('base')]
	ids= []
	faces= []
	for caminhoImagem in caminhos:
		imagemFace= cv2.cvtColor(cv2.imread(caminhoImagem), cv2.COLOR_BGR2GRAY)
		id= int(caminhoImagem.split('.')[0].split('/')[1])
		ids.append(id)
		faces.append(imagemFace)
	return np.array(ids), faces

ids, faces= getImageComId()

print("Treinando...")

eigenface.train(faces, ids)
eigenface.write('classificadorEigen.yml')

fisherface.train(faces, ids)
fisherface.write('classificadorFisher.yml')

lbph.train(faces, ids)
lbph.write('classificadorLBPH.yml')

print('Treinamento concluído.')