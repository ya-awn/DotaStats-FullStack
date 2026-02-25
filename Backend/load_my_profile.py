import requests
import mysql.connector
from datetime import datetime

def get_connection():
    return mysql.connector.connect(
        host='localhost', user='root', password='', database='DOTA_DB'
    )

def load_player_data(account_id, persona_name):
    conn = get_connection()
    cursor = conn.cursor()

    print(f"📡 Buscando partidas de {persona_name} ({account_id})...")
    # Usamos el endpoint de historial con límite de 20
    url = f"https://api.opendota.com/api/players/{account_id}/matches?limit=20"
    res = requests.get(url)

    if res.status_code == 200:
        matches = res.json()
        if not matches:
            print("⚠️ OpenDota no devolvió partidas. ¿Tu perfil es público?")
            return

        print(f"✅ Se encontraron {len(matches)} partidas.")

        for m in matches:
            match_id = m['match_id']
            # 1. Insertar Partida
            fecha_dt = datetime.fromtimestamp(m['start_time']) if m.get('start_time') else None
            cursor.execute("INSERT IGNORE INTO Matches (Match_id, Start_time, Duration) VALUES (%s, %s, %s)", 
                         (match_id, fecha_dt, m.get('duration')))

            # 2. Insertar tus Stats
            cursor.execute("""
                INSERT IGNORE INTO Match_Players (Match_id, Account_id, Hero_id, Kills, Deaths, Assists)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (match_id, account_id, m.get('hero_id'), m.get('kills'), m.get('deaths'), m.get('assists')))

            # 3. Insertar Perfil
            cursor.execute("INSERT IGNORE INTO Players (Account_id, Persona_Name) VALUES (%s, %s)", 
                         (account_id, persona_name))

        conn.commit()
        print(f"💾 ¡Datos de {persona_name} guardados en MySQL!")
    else:
        print(f"❌ Error API: {res.status_code}")

    cursor.close()
    conn.close()

if __name__ == "__main__":
    load_player_data(125687414, "faro")