# usage: python update_7.py
# example usage: python update_7.py
# description: we add a column for order in questions' topics
#!/usr/bin/python
import time
import sys
import os
import argparse
import psycopg2
import urllib.parse as up
from decouple import config

# Instantiate the parser
parser = argparse.ArgumentParser()
parser.add_argument(
    "--languages",
    nargs="*",  # expects ≥ 0 arguments
    type=str,
    default=["en", "it", "fr", "es"],  # default list if no arg value
)

args = parser.parse_args()

DB_URL = config('DB_URL')

languages = args.languages
print("Selected languages:")
print(languages)


# Connect to an existing database
try:
    print(DB_URL)
    url = up.urlparse(DB_URL)

    conn = psycopg2.connect(database=url.path[1:],
                            user=url.username,
                            password=url.password,
                            host=url.hostname,
                            port=url.port)
    '''

    conn = psycopg2.connect(user="claudio",
                            password="gennaio",
                            host="127.0.0.1",
                            port="5432",
                            database="dev")
    '''

    # Create a cursor to perform database operations
    curs = conn.cursor()
    # Print PostgreSQL details
    print("You are connected to PostgreSQL (local db)")

except (Exception) as error:
    print("Error while connecting to PostgreSQL", error)


curs.execute('DROP TABLE IF EXISTS clients cascade')
curs.execute('DROP TABLE IF EXISTS client_questions cascade')
curs.execute('DROP TABLE IF EXISTS client_topics cascade')

# internal statistics
curs.execute('''CREATE TABLE clients
    (
        "id" SERIAL PRIMARY KEY,
        "key" INTEGER UNIQUE NOT NULL,
        "client_id" TEXT UNIQUE NOT NULL, 
        "last_sync" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )''')

curs.execute('''CREATE TABLE client_topics
(
     "u_id" SERIAL PRIMARY KEY,
     "id" INTEGER NOT NULL,
     "ref_id" INTEGER NOT NULL, 
     "title" TEXT NOT NULL, 
     "timestamp" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
     "type"	NUMERIC DEFAULT 0, 
     "level" NUMERIC DEFAULT 1, 
     "lang" VARCHAR(2) NOT NULL, 
     "source" TEXT NOT NULL, 
     "user_modified" NUMERIC DEFAULT 1, 
     "client_key" INTEGER REFERENCES "clients" ("key") on delete cascade
    )''')


curs.execute('''CREATE TABLE client_questions
    (
        "id" INTEGER PRIMARY KEY,
        "topic_id" INTEGER NOT NULL,
        "title"	TEXT,
        "n" INTEGER NOT NULL DEFAULT 0,
        "liked"	INTEGER DEFAULT 0,
        "lang" VARCHAR(2) NOT NULL,
        "user_modified" INTEGER DEFAULT 1,
        "client_key" INTEGER REFERENCES "clients" ("key") on delete cascade
    )''')


# close communication with the PostgreSQL database server
curs.close()
# commit the changes
conn.commit()

print("Completed")
