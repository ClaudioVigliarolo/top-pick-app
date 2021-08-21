# usage: python CreateDB.py
# example usage: python CreateAppDB.py
# We insert the data from /data/PREFIX/ to the db
#!/usr/bin/python
import time
import sys
import os
import argparse
from sqlite3 import connect
from constants.core import get_category
from constants.core import get_topic
from constants.core import get_hash

# Instantiate the parser
parser = argparse.ArgumentParser()
parser.add_argument(
    "--languages",
    nargs="*",  # expects ≥ 0 arguments
    type=str,
    default=["EN", "IT"],  # default list if no arg value
)

args = parser.parse_args()

# Connect to an existing database
#conn = connect('../../db/current.db')
conn = connect(
    '/Users/claudio/Documents/_PROJECTS/top-pick/android/app/src/main/assets/www/db.db')

curs = conn.cursor()


# initial cleanup
curs.execute('DROP TABLE IF EXISTS categories')
curs.execute('DROP TABLE IF EXISTS topics')
curs.execute('DROP TABLE IF EXISTS related')
curs.execute('DROP TABLE IF EXISTS topic_categories')
curs.execute('DROP TABLE IF EXISTS questions')
curs.execute('DROP TABLE IF EXISTS version')


# create required tables

# create categories table
curs.execute('''CREATE TABLE "categories"
              ( "title" VARCHAR(255) NOT NULL, "ref_id" INTEGER NOT NULL,  "lang" VARCHAR(2) NOT NULL, "id" INTEGER PRIMARY KEY)''')

# create topics table
curs.execute('''CREATE TABLE topics
	
             ( "id" INTEGER NOT NULL,  "ref_id" INTEGER NOT NULL, "title" TEXT NOT NULL, "timestamp" DATETIME DEFAULT CURRENT_TIMESTAMP, "type"	NUMERIC DEFAULT 0,  "level" NUMERIC DEFAULT 1, "lang" VARCHAR(2) NOT NULL, "source" TEXT NOT NULL,  PRIMARY KEY("id"))''')


# create questions table
curs.execute('''CREATE TABLE "questions" (
    "id" INTEGER PRIMARY KEY,
	"topic_id" INTEGER REFERENCES "topics" ("id"),
	"title"	TEXT,
    "n" INTEGER NOT NULL DEFAULT 0,
	"liked"	NUMERIC DEFAULT 0,
	"user_modified" NUMERIC DEFAULT 0,
    "lang" VARCHAR(2) NOT NULL
)''')

#

# create topic_categories table
curs.execute('''CREATE TABLE "topic_categories" (
    "id" INTEGER PRIMARY KEY,
    "category_id" INTEGER REFERENCES "categories" ("id") on delete cascade,
    "topic_id" INTEGER REFERENCES "topics" ("id") on delete cascade,
	"category_ref_id" INTEGER NOT NULL,
    "topic_ref_id" INTEGER NOT NULL,
    "lang" VARCHAR(2) NOT NULL
)''')


# create related topic table
curs.execute('''CREATE TABLE "related" ( 
    "id" INTEGER PRIMARY KEY,
    "source_id" INTEGER NOT NULL,
	"dest_id" INTEGER NOT NULL,
    "source_ref_id" INTEGER NOT NULL,
	"dest_ref_id" INTEGER NOT NULL,
    "lang" VARCHAR(2) NOT NULL
)''')


# create related topic table
curs.execute('''CREATE TABLE "version" ( 
    "version" INTEGER NOT NULL
)''')

# create related topic table
curs.execute('''CREATE INDEX topics_by_id ON topics (id);''')

curs.execute('''CREATE INDEX topics_by_timestamp ON topics (timestamp);''')


curs.execute('insert into version (version) values (?)', (2,))


# close communication with the PostgreSQL database server
curs.close()
# commit the changes
conn.commit()

print("Completed")
