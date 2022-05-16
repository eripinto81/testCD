# git clone https://github.com/flask-restful/flask-restful.git

# cd flask-restful

# sudo apt install python3-pip

# sudo pip3 install setuptools

# sudo python3 setup.py develop

# sudo pip3 install flask-restful

# sudo pip3 install mysql-connector

# sudo pip3 install -U flask-cors

# sudo pip3 install pytesseract

# sudo apt install tesseract-ocr

# sudo pip3 install imutils

# sudo pip3 install geopy

# sudo apt-get install espeak

# sudo pip3 install opencv-contrib-python

# sudo pip3 install --upgrade setuptools

# sudo pip3 install wheel

# sudo apt-get install -y --fix-missing build-essential cmake gfortran git wget curl graphicsmagick libgraphicsmagick1-dev libatlas-base-dev libavcodec-dev libavformat-dev libgtk2.0-dev libjpeg-dev liblapack-dev libswscale-dev pkg-config python3-dev python3-numpy software-properties-common zip

# git clone https://github.com/davisking/dlib.git

# cd dlib

# sudo python3 setup.py install

# git clone https://github.com/ageitgey/face_recognition.git

# cd face_recognition

# sudo python3 setup.py install

# sudo pip3 install face_recognition

# sudo pip3 install git+https://github.com/ageitgey/face_recognition_models

# sudo pip3 install gevent

# sudo npm install forever -g

# sudo python3 -m pip install tornado

from flask import Flask, render_template, Response, request, stream_with_context, session, current_app
from multiprocessing.pool import ThreadPool
from gevent.pywsgi import WSGIServer
from multiprocessing import Queue
from flask_cors import CORS
import multiprocessing

import threading
import requests
import database
import anexo
import face
import ocr

app= Flask(__name__, instance_relative_config=True)

''' CONFIGURAR API '''
ip_api_face= 'localhost'
# ip_api_web= f'https://www.segurancaam.com.br:8081'
ip_api_web= f'http://localhost:8081'

''' CONFIGURAR ACESSO PORTA '''
headers= {'x-access-token': 'bb57810aa6acb1887ccecfc6809ecb67'}
login= 'admin'
senha= 'admin'
session= None

listar_thread= []

@app.route('/reload_thread_camera', methods=["GET"])
def reloadThread():
    for thread in listar_thread:
        thread.terminate()
        thread.join()
    return "200"

@app.route('/abrir_porta')
def abrirPorta():
    ip_porta= request.args.get('ip')

    ''' CONFIGURAR PORTA '''
    config_porta= { 'ip': ip_porta, 'login': login, 'senha': senha }
    porta= requests.post(f'{ip_api_web}/conectar_porta', headers=headers, data=config_porta)
    session= porta.json()['body']['session']
    
    if session != None:
        abre_porta= { 'ip': ip_porta, 'session': session }
        abrir_porta= requests.post(f'{ip_api_web}/abrir_porta', headers=headers, data=abre_porta)

        if porta.json()['statusCode'] == 200:
            return '1'
        else:
            return '0'
    else:
        return '0'

''' THREAD DO STREAM DE RECONHECIMENTO FACIAL '''
def getStreamFace(camera, host_camera, ip_api_web, IP_PORTA, CAMERA_QUE_ABRE_PORTA, headers, session):
    t= ThreadPool(1)
    async_result= t.apply_async(face.onFacial, (camera, host_camera, ip_api_web, IP_PORTA, CAMERA_QUE_ABRE_PORTA, headers, session))
    stream= async_result.get()
    listar_thread.append(t)
    return stream

''' OBTER DADOS PARA RECONHECIMENTO FACIAL '''
@app.route('/face')
def faceTemplate():
    user= request.args.get('user')
    password= request.args.get('password')
    host= request.args.get('host')
    port= request.args.get('port')
    ip_porta= request.args.get('ip_porta')
    ip_camera= request.args.get('ip_camera')
    return render_template('face.html', user=user, password=password, host=host, port=port, ip_porta=ip_porta, ip_camera=ip_camera)

''' EXECUTAR RECONHECIMENTO FACIAL '''
@app.route('/video_face/<user>/<password>/<host>/<port>/<ip_porta>/<ip_camera>')
def video_face(user, password, host, port, ip_porta, ip_camera):
    print('Streaming face...')
    
    camera_ip= user+':'+password+'@'+host+':'+port
    
    camera= "rtsp://"+camera_ip+"/cam/realmonitor?channel=1&subtype=0"
    
    if str(port) != '554':
        ''' CONECTAR PORTA '''
        # config_porta= { 'ip': ip_porta, 'login': login, 'senha': senha }
        # porta= requests.post(f'{ip_api_web}/conectar_porta', headers=headers, data=config_porta)
        # if porta.json()['statusCode'] == 200:
        #     session= porta.json()['body']['session']
        return Response(getStreamFace(int(port), host, ip_api_web, ip_porta, ip_camera, headers, None), mimetype='multipart/x-mixed-replace; boundary=frame')
    else:
        ''' CONECTAR PORTA '''
        # config_porta= { 'ip': ip_porta, 'login': login, 'senha': senha }
        # porta= requests.post(f'{ip_api_web}/conectar_porta', headers=headers, data=config_porta)
        # if porta.json()['statusCode'] == 200:
        #     session= porta.json()['body']['session']
        return Response(getStreamFace(camera, host, ip_api_web, ip_porta, ip_camera, headers, None), mimetype='multipart/x-mixed-replace; boundary=frame')

''' THREAD DO STREAM DE OCR '''
def getStreamOCR(camera, host):
    t= ThreadPool(1)
    async_result= t.apply_async(ocr.onOCR, (camera, host))
    stream= async_result.get()
    listar_thread.append(t)
    return stream

''' OBTER DADOS PARA OCR '''
@app.route('/ocr')
def ocrTemplate():
    user= request.args.get('user')
    password= request.args.get('password')
    host= request.args.get('host')
    port= request.args.get('port')
    return render_template('ocr.html', user=user, password=password, host=host, port=port)

''' EXECUTAR OCR '''
@app.route('/video_ocr/<user>/<password>/<host>/<port>')
def video_ocr(user, password, host, port):
    print('Streaming ocr...')
    
    camera_ip= user+':'+password+'@'+host+':'+port
    camera= "rtsp://"+camera_ip+"/cam/realmonitor?channel=1&subtype=0"

    if str(port) != '554':
        return Response(getStreamOCR(int(port), host), mimetype='multipart/x-mixed-replace; boundary=frame')
    else:
        return Response(getStreamOCR(camera, host), mimetype='multipart/x-mixed-replace; boundary=frame')

CORS(app)

app.register_blueprint(anexo.anexo)
app.register_blueprint(face.face)
app.register_blueprint(ocr.ocr)

listar_thread_background= []

def reloadThreadBackground():
    for thread in listar_thread_background:
        if thread.is_alive():
            thread.terminate()
            thread.join()

''' EXECUTAR RECONHECIMENTO EM BACKGROUND '''
@app.route('/backgound_thread_camera', methods=["GET"])
def executarBackground():
    # Reiniciar as threads
    reloadThreadBackground()

    # Connect database
    mydb= database.connection()
    cursor= mydb.cursor(buffered=True,dictionary=True)

    # Query database
    sql= "SELECT * FROM camera"
    cursor.execute(sql, [])
    myresult= cursor.fetchall()

    for camera in myresult:
        ''' executar thread em background das cameras '''
        login= camera['login']
        senha= camera['senha']
        host= camera['host']
        porta= camera['porta']

        camera_ip= login+':'+senha+'@'+host+':'+porta
        camera= "rtsp://"+camera_ip+"/cam/realmonitor?channel=1&subtype=0"
        if str(porta) != '554':
            t= multiprocessing.Process(target=face.onFacialBackground, args=(int(porta), host, ip_api_web, 0, 0, headers, None))
            t.start()
            listar_thread_background.append(t)
        else:
            t= multiprocessing.Process(target=face.onFacialBackground, args=(camera, host, ip_api_web, 0, 0, headers, None))
            t.start()
            listar_thread_background.append(t)
    return "200"
    #API_CAMERA= f'{ip_api_face}:8082/face?user={login}&password={senha}&host={host}&port={porta}&ip_porta=0&ip_camera=0'

from tornado.wsgi import WSGIContainer
from tornado.httpserver import HTTPServer
from tornado.ioloop import IOLoop

if __name__ == '__main__':
    app.secret_key= b'_5#y2L"F4Q8z\n\xec]/'    
    
    #app.run(debug=True, host=ip_api_face, port=8082, threaded=True)

    http_server= HTTPServer(WSGIContainer(app))
    http_server.listen(int(8082),address="0.0.0.0")
    IOLoop.instance().start()

    # http_server= HTTPServer(WSGIContainer(app), ssl_options={"certfile": "/etc/letsencrypt/live/www.segurancaam.com.br/fullchain.pem", "keyfile": "/etc/letsencrypt/live/www.segurancaam.com.br/privkey.pem"})
    # http_server.listen(int(8082),address="0.0.0.0")
    # IOLoop.instance().start()

# python3 run.py --east ../opencv-text/frozen_east_text_detection.pb