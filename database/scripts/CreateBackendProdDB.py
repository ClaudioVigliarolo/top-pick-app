# usage: python CreateDB.py
# example usage: python CreateBackendProdDB.py --languages en it
# We insert the data from /data/PREFIX/ to the db
#!/usr/bin/python
import time
import sys
import os
import argparse
import psycopg2
import urllib.parse as up
from decouple import config
from constants.core import get_category
from constants.core import get_topic
from constants.core import get_hash


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


# initial cleanup
curs.execute('DROP TABLE IF EXISTS categories cascade')
curs.execute('DROP TABLE IF EXISTS topics cascade')
curs.execute('DROP TABLE IF EXISTS related cascade')
curs.execute('DROP TABLE IF EXISTS topic_categories cascade')
curs.execute('DROP TABLE IF EXISTS questions cascade')
curs.execute('DROP TABLE IF EXISTS reports cascade')
curs.execute('DROP TABLE IF EXISTS user_languages cascade')
curs.execute('DROP TABLE IF EXISTS users cascade')
curs.execute('DROP TABLE IF EXISTS tokens cascade')
curs.execute('DROP TABLE IF EXISTS languages cascade')


curs.execute('DROP TABLE IF EXISTS USER_STATS cascade')
curs.execute('DROP TABLE IF EXISTS CLIENT_STATS cascade')
curs.execute('DROP TABLE IF EXISTS REPORT_STATS cascade')
curs.execute('DROP TABLE IF EXISTS TO_TRANSLATE cascade')
curs.execute('DROP TABLE IF EXISTS MAINTENANCE cascade')


# create categories table
curs.execute('''CREATE TABLE "languages"
              ( "lang" VARCHAR(2) PRIMARY KEY)''')


# create categories table
curs.execute('''CREATE TABLE "categories"
              ( "title" VARCHAR(255) NOT NULL, "lang" VARCHAR(2) REFERENCES "languages" ("lang") , "timestamp" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, "id" INTEGER PRIMARY KEY,  "ref_id" INTEGER NOT NULL)''')

# create topics table
curs.execute('''CREATE TABLE topics
             ( "id" INTEGER PRIMARY KEY ,  "title" TEXT NOT NULL, "lang" VARCHAR(2) REFERENCES "languages" ("lang") , "source" TEXT NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,  "ref_id" INTEGER NOT NULL)''')


# create questions table
curs.execute('''CREATE TABLE "questions" (
	"id" INTEGER PRIMARY KEY,
	"title"	TEXT NOT NULL,
    "timestamp" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "lang" VARCHAR(2) REFERENCES "languages" ("lang") ,
    "topic_id" INTEGER REFERENCES "topics" ("id") on delete cascade

)''')


# create topic_categories table
curs.execute('''CREATE TABLE "topic_categories" (
    "id" SERIAL PRIMARY KEY,
	"category_id" INTEGER REFERENCES "categories" ("id") on delete cascade,
    "topic_id" INTEGER REFERENCES "topics" ("id") on delete cascade,
    "category_ref_id" INTEGER NOT NULL,
    "topic_ref_id"  INTEGER NOT NULL,
    "lang" VARCHAR(2) REFERENCES "languages" ("lang")

)''')


# create related topic table
curs.execute('''CREATE TABLE "related" (
    "id" SERIAL PRIMARY KEY,
    "source_id" INTEGER NOT NULL,
	"dest_id" INTEGER NOT NULL,
    "dest_ref_id" INTEGER NOT NULL,
    "source_ref_id" INTEGER NOT NULL,
	FOREIGN KEY("source_id") REFERENCES "topics" ("id") on delete cascade,
	FOREIGN KEY("dest_id") REFERENCES "topics" ("id") on delete cascade,
    "lang" VARCHAR(2) REFERENCES "languages" ("lang")
)''')


# iterate creating tables
for LANG_PREFIX in languages:

    # should be contained in categories file
    DEF_CATEG = get_category("all", LANG_PREFIX)

    # topics path
    topics_path = "../data/" + LANG_PREFIX + "/topics/"

    # file containing categories
    categories = "../data/" + LANG_PREFIX + "/categories/categories"

    # file containing related
    related = "../data/" + LANG_PREFIX + "/related/related"

    curs.execute('''INSERT INTO languages (lang)
                    values (%s)''',
                 (LANG_PREFIX,))

    # populate categories table
    with open(categories) as file_in:
        for line in file_in:
            categ = line.split()[0]
            if get_category(categ, LANG_PREFIX):
                curs.execute('INSERT INTO categories' +
                             '(title, id, ref_id, lang) VALUES (%s,%s,%s,%s)', (get_category(
                                 categ, LANG_PREFIX), get_hash(get_category(categ, LANG_PREFIX), LANG_PREFIX),  get_hash(get_category(categ, "en")), LANG_PREFIX))


curs.execute('''CREATE TABLE "reports" 
    (
        "id" SERIAL PRIMARY KEY,
        "client_id"  INTEGER  NOT NULL,
        "question_id" INTEGER  UNIQUE NOT NULL,
        "reason" TEXT  NOT NULL ,
        "lang" VARCHAR(2) REFERENCES "languages" ("lang") ,
        "timestamp" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
         FOREIGN KEY("question_id") REFERENCES "questions" ("id") on delete cascade
    )''')

# create reports table
curs.execute('''CREATE TABLE users
     (
        "id" INTEGER PRIMARY KEY,
        "username" TEXT NOT NULL unique,
        "email" TEXT NOT NULL unique,
        "password" TEXT NOT NULL,
        "type" TEXT NOT NULL
    )''')


# create reports table
curs.execute('''CREATE TABLE tokens
    (
        "id" INTEGER NOT NULL,
        "token" TEXT NOT NULL,
        FOREIGN KEY("id") REFERENCES "users" ("id"),
        PRIMARY KEY("id","token")

    )''')

# create reports table
curs.execute('''CREATE TABLE user_languages
    (
        "id" INTEGER NOT NULL,
        "lang" VARCHAR(2) REFERENCES "languages" ("lang") ,
         FOREIGN KEY("id") REFERENCES "users" ("id") on delete cascade,
         PRIMARY KEY("id","lang")
    )''')

# create reports table
curs.execute('''CREATE TABLE CLIENT_STATS
    (
        "id" SERIAL PRIMARY KEY,
        "client_id"  INTEGER  NOT NULL,
        "lang" VARCHAR(2) REFERENCES "languages" ("lang") ,
        "timestamp" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )''')


# create reports table
curs.execute('''CREATE TABLE REPORT_STATS
    (
        "id" SERIAL PRIMARY KEY,
        "lang" VARCHAR(2) REFERENCES "languages" ("lang") ,
        "timestamp" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )''')


# create reports table
curs.execute('''CREATE TABLE USER_STATS
    (
        "id" SERIAL PRIMARY KEY,
        "user_id"  INTEGER  NOT NULL,
        "lang" VARCHAR(2) REFERENCES "languages" ("lang") ,
        "action"  INTEGER  NOT NULL,
        "timestamp" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY("user_id") REFERENCES "users" ("id") on delete cascade
    )''')


# external statistics
curs.execute('''CREATE TABLE TO_TRANSLATE 
    (
        "id" SERIAL PRIMARY KEY,
        "ref_id"  INTEGER REFERENCES "topics" ("id") on delete cascade,
        "source_lang" VARCHAR(2) REFERENCES "languages" ("lang"),
        "dest_lang" VARCHAR(2) REFERENCES "languages" ("lang")
        
    )''')

# for when the app is maintenance or we are adding topics
curs.execute('''CREATE TABLE MAINTENANCE 
    (
        "lang" VARCHAR(2) REFERENCES "languages" ("lang") PRIMARY KEY,
         value BOOLEAN NOT NULL
    )''')

# add default user
curs.execute('''INSERT INTO users (id,username, email, password, type )
                    values (%s,%s,%s,%s,%s)''',
             (get_hash(ROOT_USERNAME), ROOT_USERNAME, ROOT_EMAIL, HASHED_ROOT_PASSWORD, "root"))

# iterate adding languages
for LANG_PREFIX in languages:
    curs.execute('''INSERT INTO user_languages (id, lang )
                        values (%s,%s)''',
                 (get_hash(ROOT_USERNAME), LANG_PREFIX))

    curs.execute('''INSERT INTO MAINTENANCE (lang, value)
                        values (%s,%s)''',
                 (LANG_PREFIX, False))

# close communication with the PostgreSQL database server
curs.close()
# commit the changes
conn.commit()

print("Completed")
