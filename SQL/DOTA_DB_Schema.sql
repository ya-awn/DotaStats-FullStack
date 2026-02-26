-- ESTE S-- ESTE SCRIPT SOLO SE EJECUTA 1 VEZ
CREATE DATABASE IF NOT EXISTS DOTA_DB;
USE DOTA_DB;

-- Informacion sobre los heroes
CREATE TABLE Heroes(
Hero_id INT PRIMARY KEY ,
Name VARCHAR(250),
Localized_Name VARCHAR(100),
Primary_Attr VARCHAR(100)
);

-- Informacion sobre los jugadores
CREATE TABLE Players(
Account_id BIGINT PRIMARY KEY,
Persona_Name VARCHAR(250),
Avatar_url varchar(250)
);

-- Informacion sobre las partidas
CREATE TABLE Matches(
Match_id BIGINT PRIMARY KEY,
Start_time DATETIME,
Duration INT,
Radiant_win boolean,
Game_Mode VARCHAR(100)
);

-- informacion de estadisticas de la partida del jugador
CREATE TABLE Match_Players(
id INT AUTO_INCREMENT PRIMARY KEY,
Match_id BIGINT,
Account_id BIGINT,
Hero_id INT,
Kills INT,
Deaths INT,
Assists INT,
FOREIGN KEY (Match_id) REFERENCES Matches(Match_id),
FOREIGN KEY (Account_id) REFERENCES Players(Account_id),
FOREIGN KEY (Hero_id) REFERENCES Heroes(Hero_id)
);

CREATE TABLE Match_Players_Detail (
    id INT AUTO_INCREMENT PRIMARY KEY,
    Match_id BIGINT,
    Account_id BIGINT,
    net_worth INT,
    hero_damage INT,
    tower_damage INT,
    hero_healing INT,
    gold_per_min INT,
    xp_per_min INT,
    FOREIGN KEY (Match_id) REFERENCES Matches(Match_id),
    FOREIGN KEY (Account_id) REFERENCES Players(Account_id),
    INDEX idx_detail_account (Account_id),
    INDEX idx_detail_match (Match_id)
);

CREATE INDEX idx_match_start_time ON Matches(Start_time);
CREATE INDEX idx_match_players_account ON Match_Players(Account_id);
CREATE INDEX idx_match_players_hero ON Match_Players(Hero_id);

-- Añadimos una columna para la "key" que usaremos para las imágenes
ALTER TABLE Heroes ADD COLUMN Image_Key VARCHAR(100);

-- Limpiamos los nombres para obtener solo el nombre del héroe (ej: 'ringmaster')
-- Esto quita el prefijo 'npc_dota_hero_'
UPDATE Heroes 
SET Image_Key = REPLACE(Name, 'npc_dota_hero_', '');

-- 1. Agregar player_slot a Match_Players
ALTER TABLE Match_Players 
ADD COLUMN player_slot INT;

-- 2. Agregar net_worth para calcular MVP (el que más net_worth tuvo)
ALTER TABLE Match_Players 
ADD COLUMN net_worth INT;

















