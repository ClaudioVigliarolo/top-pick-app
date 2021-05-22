# usage: python CreateDB.py
# example usage: python update_1.py
# We insert the data from /data/PREFIX/ to the db
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
ROOT_USERNAME = config('ROOT_USERNAME')
ROOT_EMAIL = config('ROOT_EMAIL')
HASHED_ROOT_PASSWORD = config('HASHED_ROOT_PASSWORD')
# topics source
DEF_SOURCE = "ESL, TopPicks"


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
    curs = conn.cursor()
    print("You are connected to PostgreSQL")

except (Exception) as error:
    print("Error while connecting to PostgreSQL", error)


# for when the app is maintenance or we are adding topics
curs.execute('''CREATE TABLE MAINTENANCE 
    (
        "lang" VARCHAR(2) REFERENCES "languages" ("lang") PRIMARY KEY,
         value BOOLEAN NOT NULL
    )''')

# iterate adding languages
for LANG_PREFIX in languages:

    curs.execute('''INSERT INTO MAINTENANCE (lang, value)
                        values (%s,%s)''',
                 (LANG_PREFIX, False))


# close communication with the PostgreSQL database server
curs.close()
# commit the changes
conn.commit()

print("Completed")
