# usage: python CreateDB.py
# example usage: python CreateAppDB.py --languages EN IT
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


ROOT_USERNAME = "claudio"
ROOT_EMAIL = "claudio.vigliarolo.dev@gmail.com"
HASHED_ROOT_PASSWORD = "$2a$08$DzlasehfyenoY953KgB6Z.13izu0cS1MhDeZcczTbycELeEngitYy"

# check if line is not empty
MIN_CHAR = 2
# topics source
DEF_SOURCE = "ESL, TopPicks"

# number of digits to hash questions
HASH_DIGITS = 10

languages = args.languages
print("Selected languages:")
print(languages)


# Connect to an existing database
#conn = connect('../../db/current.db')
conn = connect(
    '/Users/claudio/Desktop/top-pick/android/app/src/main/assets/www/db.db')

curs = conn.cursor()


# initial cleanup
curs.execute('DROP TABLE IF EXISTS categories')
curs.execute('DROP TABLE IF EXISTS topics')
curs.execute('DROP TABLE IF EXISTS related')
curs.execute('DROP TABLE IF EXISTS category_topics')
curs.execute('DROP TABLE IF EXISTS questions')


# create required tables

# create categories table
curs.execute('''CREATE TABLE "categories"
              ( "title" VARCHAR(255) NOT NULL, "lang" VARCHAR(2) NOT NULL, "id" INTEGER PRIMARY KEY)''')

# create topics table
curs.execute('''CREATE TABLE topics
             ( "id" INTEGER NOT NULL,  "title" TEXT NOT NULL, "lang" VARCHAR(2) NOT NULL, "source" TEXT NOT NULL,  PRIMARY KEY("id"))''')


# create questions table
curs.execute('''CREATE TABLE "questions" (
    "id" INTEGER PRIMARY KEY,
	"topic_id" INTEGER REFERENCES "topics" ("id"),
	"title"	TEXT,
	"liked"	NUMERIC DEFAULT 0,
	"user_modified" NUMERIC DEFAULT 0,
    "lang" VARCHAR(2) NOT NULL
)''')


# create category_topics table
curs.execute('''CREATE TABLE "category_topics" (
    "id" INTEGER PRIMARY KEY,
    "lang" VARCHAR(2) NOT NULL,
	"category_id" INTEGER REFERENCES "categories" ("id"),
    "topic_id" INTEGER REFERENCES "topics" ("id")
)''')


# create related topic table
curs.execute('''CREATE TABLE "related" (
    "id" INTEGER PRIMARY KEY,
    "source_id" INTEGER NOT NULL,
	"dest_id" INTEGER NOT NULL,
    "lang" VARCHAR(2) NOT NULL,
	FOREIGN KEY("source_id") REFERENCES "topics" ("id"),
	FOREIGN KEY("dest_id") REFERENCES "topics" ("id")
)''')

# close communication with the PostgreSQL database server
curs.close()
# commit the changes
conn.commit()

print("Completed")
