from flask import Flask, request, jsonify, Blueprint, Response, render_template, url_for
from datetime import datetime
import face_recognition
import numpy as np
import database
import requests
import imutils
import cv2
import sys
import os

UPLOAD_DIRECTORY= "../tmp"

if not os.path.exists(UPLOAD_DIRECTORY):
    os.makedirs(UPLOAD_DIRECTORY)

face= Blueprint('face', __name__)

# def reproduzirvoz(args, palavra):
#     os.system(f"espeak -vpt --stdout {palavra} | aplay")
#     return None

''' BUSCAR PESSOA POR FOTO '''
def buscarPessoaArquivo(frame):
    return None

@face.route("/upload_busca", methods=["POST"])
def getFACE():
    R= "200"
    if request.method == 'POST':
        # Receber o arquivo
        file= request.files['file']
        file.save(os.path.join(UPLOAD_DIRECTORY, file.filename))
        # Processar o arquivo
        imagemConsulta= cv2.imread(UPLOAD_DIRECTORY+'/'+file.filename)
        R= buscarPessoaArquivo(imagemConsulta)
        # Remover arquivo
        os.remove(UPLOAD_DIRECTORY+'/'+file.filename)
    return jsonify(R), 200

''' ABRIR UMA PORTA '''
def abrirPorta(ip_api, ip_porta, headers, session):
    if session != None:
        abre_porta= { 'ip': ip_porta, 'session': session }
        abrir_porta= requests.post(f'{ip_api}/abrir_porta', headers=headers, data=abre_porta)
        print('Porta Status: '+str(abrir_porta.json()))
    print('abrindo a porta...')
    return session

''' REGISTRAR LOG DE MONITORAMENTO '''
def adicionarLog(ip_api, nome, cpf, status_pessoa, distancia, data_instante, camera):
    # Connect database
    mydb= database.connection()
    cursor= mydb.cursor(buffered=True, dictionary=True)
    sql= "INSERT INTO log_monitoramento (nome, cpf, status_pessoa, distancia, data_instante, camera) VALUES (%s, %s, %s, %s, %s, %s)"
    val= (nome, cpf, status_pessoa, distancia, data_instante, camera)
    cursor.execute(sql, val)
    mydb.commit()
    # Reload logs client
    headers = {'x-access-token': 'bb57810aa6acb1887ccecfc6809ecb67'}
    r= requests.get(f'{ip_api}/reload_monitoramento', headers=headers)
    #print(r.status_code)
    return cursor.rowcount
''' end '''

''' PROCESSAMENTO DE RECONHECIMENTO FACIAL '''
def onFacial(cam, host_camera, ip_api, ip_porta, ip_camera, headers, session):
    # Get a reference to webcam #0 (the default one)
    video_capture= cv2.VideoCapture(cam)

    # Caso camera exista
    if video_capture.isOpened():

        # Create arrays of known face encodings and their names
        known_face_encodings= []
        known_face_names= []

        # Connect database
        mydb= database.connection()
        cursor= mydb.cursor(buffered=True,dictionary=True)

        # Query database
        sql= "SELECT rp.*, hr.data_entrada, hr.data_saida, hr.observacao, s.nome_situacao AS situacao, a.nome_arquivo, hr.id AS id_historico FROM historico_registro AS hr LEFT JOIN registro_pessoa AS rp ON rp.id_pessoa=hr.id_pessoa LEFT JOIN anexo AS a ON a.id_pessoa=rp.id_pessoa LEFT JOIN situacao AS s ON s.id=rp.fk_id_situacao GROUP BY hr.id ORDER BY hr.data_entrada DESC"
        cursor.execute(sql, [])
        myresult= cursor.fetchall()

        for registro in myresult:
            if(registro['nome_arquivo'] != None):
                # Load a second sample picture and learn how to recognize it.
                face_image= face_recognition.load_image_file("../upload/"+registro['nome_arquivo'])
                face_encoding= face_recognition.face_encodings(face_image)
                if len(face_encoding) > 0:
                    face_encoding= face_encoding[0]
                    known_face_encodings.append(face_encoding)
                    known_face_names.append([registro['nome_pessoa'], registro['cpf_pessoa'], registro['fk_id_situacao']])
        
        # Initialize some variables
        largura, altura= 200, 200
        process_this_frame= True
        f= '%Y-%m-%d %H:%M:%S'
        max_distance= 0.43
        registro_pessoa= []
        face_locations= []
        face_encodings= []
        face_names= []
        peoples= []

        print('Loading facial:', cam)

        detectorFace= cv2.CascadeClassifier("../opencv-face/haarcascade-frontalface-default.xml")

        while True:

            # Grab a single frame of video
            ret, frame= video_capture.read()

            # Check to see if we have reached the end of the stream
            if frame is not None:

                frame= imutils.resize(frame, width=1000)
                faceDetectada= detectorFace.detectMultiScale(frame, 1.3, 5)

                for (x, y, l, a) in faceDetectada:
                    imagemFace= cv2.resize(frame[y:y+a, x:x+l], (largura, altura))

                    # Resize frame of video to 1/4 size for faster face recognition processing
                    small_frame= cv2.resize(imagemFace, (0, 0), fx=0.35, fy=0.35)

                    # Convert the image from BGR color (which OpenCV uses) to RGB color (which face_recognition uses)
                    rgb_small_frame= small_frame[:, :, ::-1]
                    cv2.imwrite(UPLOAD_DIRECTORY+"/face.png", rgb_small_frame)

                    # Draw a box around the face
                    cv2.rectangle(frame, (x, y), (x+l, y+a), (255, 255, 255), 2)

                    # Only process every other frame of video to save time
                    if process_this_frame and len(known_face_encodings) > 0:

                        # Find all the faces and face encodings in the current frame of video
                        face_locations= face_recognition.face_locations(rgb_small_frame)
                        face_encodings= face_recognition.face_encodings(rgb_small_frame, face_locations)

                        for face_encoding in face_encodings:

                            # See if the face is a match for the known face(s)
                            matches= face_recognition.compare_faces(known_face_encodings, face_encoding)
                            people= None

                            # Or instead, use the known face with the smallest distance to the new face
                            face_distances= face_recognition.face_distance(known_face_encodings, face_encoding)
                            best_match_index= np.argmin(face_distances)

                            if matches[best_match_index]:
                                # Distance face
                                if face_distances[best_match_index] < max_distance:
                                    people= known_face_names[best_match_index]
                                    
                            # Instante atual
                            data_e_hora_atual= datetime.now()
                            tempo_atual= data_e_hora_atual.strftime('%Y-%m-%d %H:%M:%S')
                            data_extenso= data_e_hora_atual.strftime('%Y-%m-%d')
                            hora_extenso= data_e_hora_atual.strftime('%H')
                            minuto_extenso= data_e_hora_atual.strftime('%M')
                            segundo_extenso= data_e_hora_atual.strftime('%S')

                            #diff_time= (datetime.strptime(tempo_atual, f) - datetime.strptime(f'{data_registro}', f)).total_seconds()

                            # Mostrar pessoa encontrada
                            if people is not None:

                                # Draw a label with a name below the face
                                font= cv2.FONT_HERSHEY_DUPLEX
                                cv2.putText(frame, people[0], (x + 6, y - 6), font, 1.0, (255, 255, 255), 1)

                                cpf= people[1]
                                log= f'{cpf}, {face_distances[best_match_index]}, {tempo_atual}, {cam}'

                                # Primeiro registro
                                if len(peoples) == 0:
                                    peoples.append([log, len(peoples)])

                                    # Guardar registro
                                    registro_pessoa.append(log)

                                    # Insert database
                                    infor= log.split(',')
                                    adicionarLog(ip_api, people[0], cpf, people[2], infor[1], infor[2], infor[3])

                                    # Abrir uma porta
                                    if face_distances[best_match_index] < max_distance:
                                        # Somente se a porta estiver permitida e a pessoa estiver permitida
                                        if host_camera == ip_camera and people[2] == 1:
                                            abrirPorta(ip_api, ip_porta, headers, session)

                                # Novo registro
                                existe_registro= 0
                                for p in peoples:
                                    registro= p[0].split(',')
                                    if cpf == registro[0]:
                                        existe_registro= existe_registro +1

                                if existe_registro == 0:
                                    peoples.append([log, len(peoples)])

                                    # Guardar registro
                                    registro_pessoa.append(log)

                                    # Insert database
                                    infor= log.split(',')
                                    adicionarLog(ip_api, people[0], cpf, people[2], infor[1], infor[2], infor[3])

                                    # Abrir uma porta
                                    if face_distances[best_match_index] < max_distance:
                                        # Somente se a porta estiver permitida e a pessoa estiver permitida
                                        if host_camera == ip_camera and people[2] == 1:
                                            abrirPorta(ip_api, ip_porta, headers, session)

                                # Novo registro no tempo
                                for p in peoples:
                                    registro= p[0].split(',')
                                    data= registro[2][1:]
                                    registro_data_extenso= data.split(' ')[0]
                                    registro_hora_extenso= data.split(' ')[1]

                                    if registro[0] == cpf: # and registro_data_extenso == data_extenso: # somente em uma data
                                        if (registro_hora_extenso.split(':')[1] != minuto_extenso) or (registro_hora_extenso.split(':')[1] == minuto_extenso and registro_hora_extenso.split(':')[0] != hora_extenso):
                                            # Remover do minuto (sobrescrever)
                                            peoples[p[1]]= [log, p[1]]

                                            # Guardar registro
                                            registro_pessoa.append(log)

                                            # Insert database
                                            infor= log.split(',')
                                            adicionarLog(ip_api, people[0], cpf, people[2], infor[1], infor[2], infor[3])

                                            # Abrir uma porta
                                            if face_distances[best_match_index] < max_distance:
                                                # Somente se a porta estiver permitida e a pessoa estiver permitida
                                                if host_camera == ip_camera and people[2] == 1:
                                                    abrirPorta(ip_api, ip_porta, headers, session)

                                            break

                    process_this_frame= not process_this_frame

                # Capture frame-by-frame
                ret, buffer= cv2.imencode('.jpg', frame)
                frame= buffer.tobytes()
                yield (b'--frame\r\n'
                    b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')  
                    # Concat frame one by one and show result

            else:
                print('Frame não encontrado, reiniciando...')
                video_capture= cv2.VideoCapture(cam)

''' PROCESSAMENTO DE RECONHECIMENTO FACIAL EM BACKGROUND '''
'''
def onFacialBackground(cam, host_camera, ip_api, ip_porta, ip_camera, headers, session):
    # Get a reference to webcam #0 (the default one)
    video_capture= cv2.VideoCapture(cam)

    # Caso camera exista
    if video_capture.isOpened():

        # Create arrays of known face encodings and their names
        known_face_encodings= []
        known_face_names= []

        # Connect database
        mydb= database.connection()
        cursor= mydb.cursor(buffered=True,dictionary=True)

        # Query database
        sql= "SELECT rp.*, hr.data_entrada, hr.data_saida, hr.observacao, s.nome_situacao AS situacao, a.nome_arquivo, hr.id AS id_historico FROM historico_registro AS hr LEFT JOIN registro_pessoa AS rp ON rp.id_pessoa=hr.id_pessoa LEFT JOIN anexo AS a ON a.id_pessoa=rp.id_pessoa LEFT JOIN situacao AS s ON s.id=rp.fk_id_situacao GROUP BY hr.id ORDER BY hr.data_entrada DESC"
        cursor.execute(sql, [])
        myresult= cursor.fetchall()

        for registro in myresult:
            if(registro['nome_arquivo'] != None):
                # Load a second sample picture and learn how to recognize it.
                face_image= face_recognition.load_image_file("../upload/"+registro['nome_arquivo'])
                face_encoding= face_recognition.face_encodings(face_image)
                if len(face_encoding) > 0:
                    face_encoding= face_encoding[0]
                    known_face_encodings.append(face_encoding)
                    known_face_names.append([registro['nome_pessoa'], registro['cpf_pessoa'], registro['fk_id_situacao']])
        
        # Initialize some variables
        largura, altura= 200, 200
        process_this_frame= True
        f= '%Y-%m-%d %H:%M:%S'
        max_distance= 0.43
        registro_pessoa= []
        face_locations= []
        face_encodings= []
        face_names= []
        peoples= []

        print('Loading facial background:', cam)

        detectorFace= cv2.CascadeClassifier("../opencv-face/haarcascade-frontalface-default.xml")

        while True:

            # Grab a single frame of video
            ret, frame= video_capture.read()

            # Check to see if we have reached the end of the stream
            if frame is not None:

                frame= imutils.resize(frame, width=1000)
                faceDetectada= detectorFace.detectMultiScale(frame, 1.3, 5)

                for (x, y, l, a) in faceDetectada:
                    imagemFace= cv2.resize(frame[y:y+a, x:x+l], (largura, altura))

                    # Resize frame of video to 1/4 size for faster face recognition processing
                    small_frame= cv2.resize(imagemFace, (0, 0), fx=0.35, fy=0.35)

                    # Convert the image from BGR color (which OpenCV uses) to RGB color (which face_recognition uses)
                    rgb_small_frame= small_frame[:, :, ::-1]
                    cv2.imwrite(UPLOAD_DIRECTORY+"/face.png", rgb_small_frame)

                    # Draw a box around the face
                    cv2.rectangle(frame, (x, y), (x+l, y+a), (255, 255, 255), 2)

                    # Only process every other frame of video to save time
                    if process_this_frame and len(known_face_encodings) > 0:

                        # Find all the faces and face encodings in the current frame of video
                        face_locations= face_recognition.face_locations(rgb_small_frame)
                        face_encodings= face_recognition.face_encodings(rgb_small_frame, face_locations)

                        for face_encoding in face_encodings:

                            # See if the face is a match for the known face(s)
                            matches= face_recognition.compare_faces(known_face_encodings, face_encoding)
                            people= None

                            # Or instead, use the known face with the smallest distance to the new face
                            face_distances= face_recognition.face_distance(known_face_encodings, face_encoding)
                            best_match_index= np.argmin(face_distances)

                            if matches[best_match_index]:
                                # Distance face
                                if face_distances[best_match_index] < max_distance:
                                    people= known_face_names[best_match_index]
                                    
                            # Instante atual
                            data_e_hora_atual= datetime.now()
                            tempo_atual= data_e_hora_atual.strftime('%Y-%m-%d %H:%M:%S')
                            data_extenso= data_e_hora_atual.strftime('%Y-%m-%d')
                            hora_extenso= data_e_hora_atual.strftime('%H')
                            minuto_extenso= data_e_hora_atual.strftime('%M')
                            segundo_extenso= data_e_hora_atual.strftime('%S')

                            #diff_time= (datetime.strptime(tempo_atual, f) - datetime.strptime(f'{data_registro}', f)).total_seconds()

                            # Mostrar pessoa encontrada
                            if people is not None:

                                # Draw a label with a name below the face
                                font= cv2.FONT_HERSHEY_DUPLEX
                                cv2.putText(frame, people[0], (x + 6, y - 6), font, 1.0, (255, 255, 255), 1)

                                cpf= people[1]
                                log= f'{cpf}, {face_distances[best_match_index]}, {tempo_atual}, {cam}'

                                # Primeiro registro
                                if len(peoples) == 0:
                                    peoples.append([log, len(peoples)])

                                    # Guardar registro
                                    registro_pessoa.append(log)

                                    # Insert database
                                    infor= log.split(',')
                                    adicionarLog(ip_api, people[0], cpf, people[2], infor[1], infor[2], infor[3])

                                    # Abrir uma porta
                                    if face_distances[best_match_index] < max_distance:
                                        # Somente se a porta estiver permitida e a pessoa estiver permitida
                                        if host_camera == ip_camera and people[2] == 1:
                                            abrirPorta(ip_api, ip_porta, headers, session)

                                # Novo registro
                                existe_registro= 0
                                for p in peoples:
                                    registro= p[0].split(',')
                                    if cpf == registro[0]:
                                        existe_registro= existe_registro +1

                                if existe_registro == 0:
                                    peoples.append([log, len(peoples)])

                                    # Guardar registro
                                    registro_pessoa.append(log)

                                    # Insert database
                                    infor= log.split(',')
                                    adicionarLog(ip_api, people[0], cpf, people[2], infor[1], infor[2], infor[3])

                                    # Abrir uma porta
                                    if face_distances[best_match_index] < max_distance:
                                        # Somente se a porta estiver permitida e a pessoa estiver permitida
                                        if host_camera == ip_camera and people[2] == 1:
                                            abrirPorta(ip_api, ip_porta, headers, session)

                                # Novo registro no tempo
                                for p in peoples:
                                    registro= p[0].split(',')
                                    data= registro[2][1:]
                                    registro_data_extenso= data.split(' ')[0]
                                    registro_hora_extenso= data.split(' ')[1]

                                    if registro[0] == cpf: # and registro_data_extenso == data_extenso: # somente em uma data
                                        if (registro_hora_extenso.split(':')[1] != minuto_extenso) or (registro_hora_extenso.split(':')[1] == minuto_extenso and registro_hora_extenso.split(':')[0] != hora_extenso):
                                            # Remover do minuto (sobrescrever)
                                            peoples[p[1]]= [log, p[1]]

                                            # Guardar registro
                                            registro_pessoa.append(log)

                                            # Insert database
                                            infor= log.split(',')
                                            adicionarLog(ip_api, people[0], cpf, people[2], infor[1], infor[2], infor[3])

                                            # Abrir uma porta
                                            if face_distances[best_match_index] < max_distance:
                                                # Somente se a porta estiver permitida e a pessoa estiver permitida
                                                if host_camera == ip_camera and people[2] == 1:
                                                    abrirPorta(ip_api, ip_porta, headers, session)

                                            break

                    process_this_frame= not process_this_frame

                # Capture frame-by-frame
                
            else:
                print('Frame não encontrado do background, reiniciando... ', cam)
                video_capture= cv2.VideoCapture(cam)
'''