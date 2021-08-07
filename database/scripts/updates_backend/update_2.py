# usage: python update_2.py
# example usage: python update_2.py
# description: we add the source of the topics
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
NEW_SOURCE = "The Internet TESL Journal"

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
    # Print PostgreSQL details
    print("You are connected to PostgreSQL (local db)")

except (Exception) as error:
    print("Error while connecting to PostgreSQL", error)


update_query = """UPDATE topics set source = %s"""
curs.execute(update_query, (NEW_SOURCE,))

# close communication with the PostgreSQL database server
curs.close()
# commit the changes
conn.commit()

print("Completed")
