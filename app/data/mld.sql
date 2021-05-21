BEGIN;
SET client_encoding = 'UTF8';

DROP TABLE IF EXISTS "league", "registration", "card";

-- Table Ligue 
CREATE TABLE "league" (
    "id" SERIAL PRIMARY KEY,
    "game_week" INTEGER NOT NULL,
    "duration" TEXT NOT NULL,
    "open_date" TIMESTAMPTZ,
    "close_date" TIMESTAMPTZ,
    "max_places" INTEGER NOT NULL DEFAULT 500,
    "registered_places" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT '',
    "open" BOOLEAN NOT NULL
);

-- Table Inscription 
CREATE TABLE "registration" (
    "id" SERIAL PRIMARY KEY,
    "manager_name" TEXT NOT NULL DEFAULT '',
    "manager_id" TEXT NOT NULL DEFAULT '',
    "manager_picture" TEXT NOT NULL DEFAULT '',
    "total_score" INTEGER NOT NULL DEFAULT 0,
    "league_id" INTEGER NOT NULL REFERENCES "league" ("id") ON DELETE CASCADE
);

-- Table Carte
CREATE TABLE "card" (
    "id" SERIAL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "picture_url" TEXT NOT NULL,
    "registration_id" INTEGER NOT NULL REFERENCES "registration" ("id") ON DELETE CASCADE
);


COMMIT;