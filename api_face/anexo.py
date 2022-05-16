from flask import Flask, request, jsonify, send_from_directory, Blueprint
import os

anexo= Blueprint('anexo', __name__)

UPLOAD_DIRECTORY= "../upload"

if not os.path.exists(UPLOAD_DIRECTORY):
    os.makedirs(UPLOAD_DIRECTORY)

@anexo.route("/files")
def list_file():
    files= []
    for filename in os.listdir(UPLOAD_DIRECTORY):
        path= os.path.join(UPLOAD_DIRECTORY, filename)
        if os.path.isfile(path):
            files.append(filename)
    return jsonify(files)

@anexo.route("/files/<path:path>")
def get_file(path):
    return send_from_directory(UPLOAD_DIRECTORY, path, as_attachment=True)

