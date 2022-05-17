import mysql.connector 

def connection():
    mydb= mysql.connector.connect(
        host="localhost",
        user="root",
        port="3306",
        passwd="@itamarati30",
        database="monitoramento"
    )
    return mydb

# def connection():
#     mydb= mysql.connector.connect(
#         host="localhost",
#         user="ssp",
#         port="3306",
#         passwd="@SSP2019ra",
#         database="monitoramento"
#     )
#     return mydb