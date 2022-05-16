from flask import Flask, request, jsonify, Blueprint
import face_recognition
import numpy as np
import cv2
import os
import multiprocessing
import sys

# Create arrays of known face encodings and their names
known_face_encodings= []
known_face_names= [] 

import config
mydb= config.connection()
## show collums
mycursor= mydb.cursor(buffered=True,dictionary=True)

UPLOAD_DIRECTORY= "../tmp"

if not os.path.exists(UPLOAD_DIRECTORY):
    os.makedirs(UPLOAD_DIRECTORY)

face= Blueprint('face', __name__)

def reconhecer(frame):
    # Query database
    sql= "SELECT a.nome_arquivo, rp.nome_pessoa, s.nome_situacao FROM registro_pessoa AS rp LEFT JOIN anexo AS a ON a.id_pessoa=rp.id_pessoa LEFT JOIN situacao AS s ON s.id=rp.fk_id_situacao"
    mycursor.execute(sql, [])
    myresult= mycursor.fetchall()
    for registro in myresult:
        # Load a second sample picture and learn how to recognize it.
        face_image= face_recognition.load_image_file("../upload/"+registro['nome_arquivo'])
        face_encoding= face_recognition.face_encodings(face_image)
        if len(face_encoding) > 0:
            face_encoding= face_encoding[0]
            known_face_encodings.append(face_encoding)
            known_face_names.append(registro['nome_pessoa']+' - '+registro['nome_situacao'])
    # Query face
    # Initialize some variables
    face_locations= []
    face_encodings= []
    face_names= []

    # Resize frame of video to 1/4 size for faster face recognition processing
    small_frame= cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)

    # Convert the image from BGR color (which OpenCV uses) to RGB color (which face_recognition uses)
    rgb_small_frame= small_frame[:, :, ::-1]

    # Only process every other frame of video to save time
    # Find all the faces and face encodings in the current frame of video
    face_locations= face_recognition.face_locations(rgb_small_frame)
    face_encodings= face_recognition.face_encodings(rgb_small_frame, face_locations)

    for face_encoding in face_encodings:
        # See if the face is a match for the known face(s)
        matches= face_recognition.compare_faces(known_face_encodings, face_encoding)
        name= "Unknown"

        # Or instead, use the known face with the smallest distance to the new face
        face_distances= face_recognition.face_distance(known_face_encodings, face_encoding)
        best_match_index= np.argmin(face_distances)
        if matches[best_match_index]:
            name= known_face_names[best_match_index]

        face_names.append(name)
    return face_names

@face.route("/upload_busca", methods=["POST"])
def getFACE():
    R= "200"
    if request.method == 'POST':
        # Recebe o arquivo
        file= request.files['file']
        file.save(os.path.join(UPLOAD_DIRECTORY, file.filename))
        # Processar arquivo
        img= cv2.imread(UPLOAD_DIRECTORY+'/'+file.filename)
        R= reconhecer(img)
        # Remover arquivo
        os.remove(UPLOAD_DIRECTORY+'/'+file.filename)
    return jsonify(R), 200

def onwebcam():
    # Get a reference to webcam #0 (the default one)
    video_capture= cv2.VideoCapture(0)

    # Create arrays of known face encodings and their names
    known_face_encodings= []
    known_face_names= []

    # Query database
    sql= "SELECT a.nome_arquivo, rp.nome_pessoa, s.nome_situacao FROM registro_pessoa AS rp LEFT JOIN anexo AS a ON a.id_pessoa=rp.id_pessoa LEFT JOIN situacao AS s ON s.id=rp.fk_id_situacao"
    mycursor.execute(sql, [])
    myresult= mycursor.fetchall()
    for registro in myresult:
        if(registro['nome_arquivo'] != None):
            # Load a second sample picture and learn how to recognize it.
            face_image= face_recognition.load_image_file("../upload/"+registro['nome_arquivo'])
            face_encoding= face_recognition.face_encodings(face_image)
            if len(face_encoding) > 0 and registro['nome_situacao'] != 'ABSORVIDO':
                face_encoding= face_encoding[0]
                known_face_encodings.append(face_encoding)
                known_face_names.append(registro['nome_pessoa']+' - '+registro['nome_situacao'])
    
    # Initialize some variables
    face_locations= []
    face_encodings= []
    face_names= []
    process_this_frame= True

    while len(known_face_encodings) > 0:
        # Grab a single frame of video
        ret, frame= video_capture.read()

        # Resize frame of video to 1/4 size for faster face recognition processing
        small_frame= cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)

        # Convert the image from BGR color (which OpenCV uses) to RGB color (which face_recognition uses)
        rgb_small_frame= small_frame[:, :, ::-1]

        # Only process every other frame of video to save time
        if process_this_frame:
            # Find all the faces and face encodings in the current frame of video
            face_locations= face_recognition.face_locations(rgb_small_frame)
            face_encodings= face_recognition.face_encodings(rgb_small_frame, face_locations)

            face_names= []
            for face_encoding in face_encodings:
                # See if the face is a match for the known face(s)
                matches= face_recognition.compare_faces(known_face_encodings, face_encoding)
                name= "Unknown"

                # # If a match was found in known_face_encodings, just use the first one.
                # if True in matches:
                #     first_match_index = matches.index(True)
                #     name = known_face_names[first_match_index]

                # Or instead, use the known face with the smallest distance to the new face
                face_distances= face_recognition.face_distance(known_face_encodings, face_encoding)
                best_match_index= np.argmin(face_distances)
                if matches[best_match_index]:
                    name= known_face_names[best_match_index]

                face_names.append(name)

        process_this_frame= not process_this_frame

        # Display the results
        for (top, right, bottom, left), name in zip(face_locations, face_names):
            # Scale back up face locations since the frame we detected in was scaled to 1/4 size
            top *= 4
            right *= 4
            bottom *= 4
            left *= 4

            # Draw a box around the face
            cv2.rectangle(frame, (left, top), (right, bottom), (0, 0, 255), 2)

            # Draw a label with a name below the face
            cv2.rectangle(frame, (left, bottom - 35), (right, bottom), (0, 0, 255), cv2.FILLED)
            font= cv2.FONT_HERSHEY_DUPLEX
            cv2.putText(frame, name, (left + 6, bottom - 6), font, 1.0, (255, 255, 255), 1)

        # Display the resulting image
        cv2.imshow('Facial', frame)

        # Hit 'q' on the keyboard to quit!
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

process= multiprocessing.Process(target=onwebcam)
@face.route("/webcamstart", methods=["GET"])
def webcamstart():
    R= "200"
    if request.method == 'GET':
        print('Starting webcam...')
        process.start()
        process.join()
    return jsonify(R), 200

@face.route("/webcamstop", methods=["GET"])
def webcamstop():
    R= "200"
    if request.method == 'GET':
        print('Stoping webcam...')
        process.terminate()  
        process.join()
        sys.stdout.flush()
        # kill the process!
    return jsonify(R), 200