# 🎮 Dota 2 Match Explorer (Full-Stack)

Este es un proyecto Full-Stack desarrollado para consultar y almacenar estadísticas de partidas de Dota 2 utilizando la API de OpenDota. Permite buscar jugadores por su ID, visualizar sus últimas partidas y analizar estadísticas de héroes desde una base de datos local.

## 🚀 Tecnologías Utilizadas

*   **Frontend**: React.js + Vite + Axios (Interfaz moderna y rápida).
*   **Backend**: Python + Flask (API REST para comunicación con la DB).
*   **Base de Datos**: MariaDB / MySQL (Almacenamiento persistente de partidas y héroes).
*   **API Externa**: [OpenDota API](https://docs.opendota.com/) (Fuente de datos en tiempo real).

## 🛠️ Características

*   **Buscador de Jugadores**: Consulta partidas reales desde la base de datos local.
*   **Sincronización**: Scripts en Python para extraer datos de la API y guardarlos en SQL.
*   **Dashboard Visual**: Interfaz limpia con React para visualizar KDA y héroes.
*   **Optimización SQL**: Uso de Índices y Joins complejos para consultas rápidas.

## 📦 Instalación y Uso

1.  **Base de Datos**: Ejecutar el script SQL en `SQL/DOTA_DB_Schema.sql` para crear las tablas.
2.  **Backend**:
    ```bash
    cd Backend
    python -m venv venv
    source venv/bin/activate  # En Linux
    pip install flask flask-cors mysql-connector-python requests
    python app.py
    ```
3.  **Frontend**:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

## 📸 Vista Previa
![Dashboard Screenshot](https://tu-url-de-imagen-aqui.com)

---
Desarrollado por [Kenyi Meza](https://github.com/ya-awn) - Estudiante de Tecnicatura en Programación.