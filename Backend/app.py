from flask import Flask, jsonify
from flask_cors import CORS
import mysql.connector
import requests

app = Flask(__name__)
CORS(app)

OPENDOTA_API = "https://api.opendota.com/api"

def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="DOTA_DB",
    )

def get_hero_image(localized_name):
    name = localized_name.lower().replace(" ", "_").replace("-", "")
    return f"https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/{name}.png"

def sincronizar_partidas(account_id, conn, cursor):
    """Descarga las últimas 20 partidas de OpenDota y las guarda en la DB."""
    url = f"{OPENDOTA_API}/players/{account_id}/matches?limit=20"
    response = requests.get(url, timeout=10)
    if response.status_code != 200:
        return

    partidas = response.json()

    for p in partidas:
        match_id = p.get("match_id")
        hero_id = p.get("hero_id")
        kills = p.get("kills", 0)
        deaths = p.get("deaths", 0)
        assists = p.get("assists", 0)
        start_time = p.get("start_time")
        duration = p.get("duration", 0)
        radiant_win = p.get("radiant_win")
        player_slot = p.get("player_slot", 0)
        is_radiant = player_slot < 128
        won = 1 if (is_radiant == radiant_win) else 0

        # Insertar partida si no existe
        cursor.execute("""
            INSERT IGNORE INTO Match_Players (Match_id, Account_id, Hero_id, Kills, Deaths, Assists, player_slot, Won)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, (match_id, account_id, hero_id, kills, deaths, assists, player_slot, won))
        
        # Insertar jugador si no existe
        cursor.execute("""
            INSERT IGNORE INTO Players (Account_id) VALUES (%s)
        """, (account_id,))

        # Insertar en Match_Players si no existe
        cursor.execute("""
            INSERT IGNORE INTO Match_Players (Match_id, Account_id, Hero_id, Kills, Deaths, Assists, Won)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (match_id, account_id, hero_id, kills, deaths, assists, won))

    conn.commit()


@app.route("/")
def home():
    return jsonify({"mensaje": "Servidor de Dota 2 activo"})


@app.route("/api/jugador/<int:account_id>")
def get_jugador_stats(account_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # Sincronizar con OpenDota primero
        sincronizar_partidas(account_id, conn, cursor)

        # Partidas recientes con resultado e imagen
        query_partidas = """
            SELECT
                mp.Match_id,
                mp.Hero_id,
                h.Localized_Name,
                mp.Kills,
                mp.Deaths,
                mp.Assists,
                mp.Won,
                m.Start_time,
                CASE
                    WHEN (mp.Kills + mp.Assists) >= 20 AND mp.Deaths <= 3 THEN 1
                    ELSE 0
                END AS is_mvp
            FROM Match_Players mp
            JOIN Heroes h ON mp.Hero_id = h.Hero_id
            JOIN Matches m ON mp.Match_id = m.Match_id
            WHERE mp.Account_id = %s
            ORDER BY m.Start_time DESC
            LIMIT 20
        """
        cursor.execute(query_partidas, (account_id,))
        partidas = cursor.fetchall()

        for p in partidas:
            p["won"] = bool(p["Won"])
            p["is_mvp"] = bool(p.get("is_mvp", 0))
            p["image"] = get_hero_image(p["Localized_Name"])

        # Stats por héroe (winrate, KDA, etc.)
        query_heroes = """
            SELECT
                h.Localized_Name AS heroe,
                COUNT(*) AS total_partidas,
                SUM(mp.Won) AS wins,
                COUNT(*) - SUM(mp.Won) AS losses,
                ROUND(AVG(mp.Kills), 1) AS avg_kills,
                ROUND(AVG(mp.Deaths), 1) AS avg_deaths,
                ROUND(AVG(mp.Assists), 1) AS avg_assists,
                SUM(CASE WHEN (mp.Kills + mp.Assists) >= 20 AND mp.Deaths <= 3 THEN 1 ELSE 0 END) AS mvp_count
            FROM Match_Players mp
            JOIN Heroes h ON mp.Hero_id = h.Hero_id
            WHERE mp.Account_id = %s
            GROUP BY h.Localized_Name
            ORDER BY total_partidas DESC
            LIMIT 10
        """
        cursor.execute(query_heroes, (account_id,))
        heroes_stats = cursor.fetchall()

        for h in heroes_stats:
            h["image"] = get_hero_image(h["heroe"])

        cursor.close()
        conn.close()

        return jsonify({
            "account_id": account_id,
            "total_partidas_cargadas": len(partidas),
            "partidas": partidas,
            "heroes_stats": heroes_stats,
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/stats/top-heroes")
def get_top_heroes():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        query = """
            SELECT
                mp.Hero_id,
                h.Localized_Name AS heroe,
                COUNT(*) AS veces_jugado,
                ROUND(AVG(mp.Kills), 2) AS promedio_kills,
                ROUND(AVG(mp.Deaths), 2) AS promedio_muertes,
                ROUND(AVG(mp.Assists), 2) AS promedio_assists
            FROM Match_Players mp
            JOIN Heroes h ON mp.Hero_id = h.Hero_id
            GROUP BY mp.Hero_id, h.Localized_Name
            ORDER BY veces_jugado DESC
            LIMIT 10
        """
        cursor.execute(query)
        stats = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify(stats)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)