# usage: python update_6.py
# example usage: python update_6.py
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
    # Create a cursor to perform database operations
    curs = conn.cursor()
    # Print PostgreSQL details
    print("You are connected to PostgreSQL (local db)")

except (Exception) as error:
    print("Error while connecting to PostgreSQL", error)


update_query = """ALTER TABLE USER_STATS ADD COLUMN n INTEGER NOT NULL DEFAULT 1; """

curs.execute(update_query)

# close communication with the PostgreSQL database server
curs.close()
# commit the changes
conn.commit()

print("Completed")
