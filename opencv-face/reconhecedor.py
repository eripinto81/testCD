import cv2

detectorFace= cv2.CascadeClassifier("haarcascade-frontalface-default.xml")

# reconhecedor= cv2.face.EigenFaceRecognizer_create(40, 8000)
# reconhecedor.read("classificadorEigen.yml")

# reconhecedor= cv2.face.FisherFaceRecognizer_create(3, 2000)
# reconhecedor.read("classificadorFisher.yml")

reconhecedor= cv2.face.LBPHFaceRecognizer_create()
reconhecedor.read("classificadorLBPH.yml")

largura, altura= 220, 220
font= cv2.FONT_HERSHEY_COMPLEX_SMALL
camera= cv2.VideoCapture(0)

identificador= None

while(True):
    conectado, imagem= camera.read()
    imagemCinza= cv2.cvtColor(imagem, cv2.COLOR_BGR2GRAY)
    faceDetectada= detectorFace.detectMultiScale(imagemCinza, 1.3, 5)
    for (x, y, l, a) in faceDetectada:
        imagemFace= cv2.resize(imagemCinza[y:y+a, x:x+l], (largura, altura))
        cv2.rectangle(imagem, (x, y), (x+l, y+a), (0, 0, 255), 2)
        id, confianca= reconhecedor.predict(imagemFace)
        if id == 1:
            identificador= "DUIVILLY"
            print(identificador)
        elif id == 2:
            identificador= "ALESSANDRA"
            print(identificador)
        else:
            identificador= "Not found!"
        cv2.putText(imagem, str(identificador), (x, y+(a+30)), font, 2, (0, 0, 255))
        cv2.putText(imagem, str(confianca), (x, y+(a+50)), font, 1, (0, 0, 255))
    cv2.imshow("Face", imagem)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break
camera.release()
