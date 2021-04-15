# usage: python CreateDB.py
# example usage: python ControlTables.py
# We insert the data from /data/PREFIX/ to the db
#!/usr/bin/python
import time
import sys
import os
import argparse
import psycopg2
import urllib.parse as up
from decouple import config
from constants.core import get_hash


DB_URL = config('DB_URL')

# Connect to an existing database
try:
    url = up.urlparse(DB_URL)
    conn = psycopg2.connect(database=url.path[1:],
                            user=url.username,
                            password=url.password,
                            host=url.hostname,
                            port=url.port)
    curs = conn.cursor()
    print("You are connected to PostgreSQL")

except (Exception) as error:
    print("Error while connecting to PostgreSQL", error)


# initial cleanup
curs.execute('DROP TABLE IF EXISTS UPDATES cascade')
curs.execute('DROP TABLE IF EXISTS STATS_INTERNAL cascade')
curs.execute('DROP TABLE IF EXISTS STATS_EXTERNAL cascade')


#id, client_id, timestamp, lang

# create reports table
curs.execute('''CREATE TABLE UPDATES 
    (
        "id" SERIAL PRIMARY KEY,
        "client_id"  INTEGER  NOT NULL,
        "lang" VARCHAR(2) NOT NULL,
        "timestamp" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
         FOREIGN KEY("client_id") REFERENCES "users" ("id") on delete cascade
    )''')

# internal statistics
curs.execute('''CREATE TABLE STATS_INTERNAL 
    (
        "id" SERIAL PRIMARY KEY,
        "client_id"  INTEGER  NOT NULL,
        "action"  INTEGER  NOT NULL,
        "lang" VARCHAR(2) NOT NULL,
        "timestamp" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY("client_id") REFERENCES "users" ("id") on delete cascade

    )''')


# external statistics
curs.execute('''CREATE TABLE STATS_EXTERNAL 
    (
        "id" SERIAL PRIMARY KEY,
        "client_id"  INTEGER  NOT NULL,
        "action"  INTEGER  NOT NULL,
        "lang" VARCHAR(2) NOT NULL,
        "timestamp" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )''')

# close communication with the PostgreSQL database server
curs.close()
# commit the changes
conn.commit()

print("Completed")
