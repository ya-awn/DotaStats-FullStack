import requests
r = requests.get("https://api.opendota.com/api/players/125687414/matches?limit=3")
for m in r.json():
    print(m.keys())
    print("player_slot:", m.get('player_slot'))
    print("radiant_win:", m.get('radiant_win'))
    print("---")