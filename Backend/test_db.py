import mysql.connector

# 1) Conexión: datos para entrar a tu MariaDB/MySQL
conn = mysql.connector.connect(
    host="localhost",
    user="root",          # cámbialo si usas otro usuario
    password="",          # cámbialo si tienes password
    database="DOTA_DB"
)

# 2) Cursor: objeto para ejecutar SQL
cursor = conn.cursor()

# 3) Ejecutamos una consulta simple
cursor.execute("SHOW TABLES;")

# 4) Leemos resultados
tables = cursor.fetchall()
print("Tablas en DOTA_DB:")
for t in tables:
    print("-", t[0])

# 5) Cerramos (siempre)
cursor.close()
conn.close()