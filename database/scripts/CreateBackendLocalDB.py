# usage: python CreateDB.py
# example usage: python CreateBackendLocalDB.py --languages en it
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


# "postgres://claudio:gennaio@localHost:5432/dev"
# Connect to an existing database
try:
    conn = psycopg2.connect(user="claudio",
                            password="gennaio",
                            host="127.0.0.1",
                            port="5432",
                            database="dev")
    # Create a cursor to perform database operations
    curs = conn.cursor()
    # Print PostgreSQL details
    print("You are connected to PostgreSQL (local db)")

except (Exception) as error:
    print("Error while connecting to PostgreSQL", error)


curs.execute(
    '''
        DROP SCHEMA public CASCADE;
        CREATE SCHEMA public;
        '''
)


# initial cleanup
curs.execute('DROP TABLE IF EXISTS categories cascade')
curs.execute('DROP TABLE IF EXISTS topics cascade')
curs.execute('DROP TABLE IF EXISTS related cascade')
curs.execute('DROP TABLE IF EXISTS category_topics cascade')
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


# create category_topics table
curs.execute('''CREATE TABLE "category_topics" (
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

    # populate topics table
    for topic_item_path in os.listdir(topics_path):
        topic = os.path.basename(topic_item_path)
        # discard pesky hidden files
        if get_topic(topic, LANG_PREFIX):
            curs.execute('''INSERT INTO topics (id, ref_id, title, source, lang)
                        values (%s,%s,%s,%s,%s)''',
                         (get_hash(get_topic(topic, LANG_PREFIX), LANG_PREFIX), get_hash(get_topic(topic, "en")), get_topic(topic, LANG_PREFIX), DEF_SOURCE, LANG_PREFIX))

    # populate questions table
    for topic_item_path in os.listdir(topics_path):
        with open(topics_path + topic_item_path) as file_in:
            questions_list = []
            topic = os.path.basename(topic_item_path)
            if not topic.startswith("."):
                for line in file_in:
                    if get_topic(topic, LANG_PREFIX) and line not in questions_list:
                        questions_list.append(line)
                        hashed_id = get_hash(
                            line, get_topic(topic, LANG_PREFIX)+LANG_PREFIX)
                        curs.execute('''INSERT INTO questions  (id, topic_id, title, lang)
                                values (%s,%s,%s,%s)''',
                                     (hashed_id, get_hash(get_topic(topic, LANG_PREFIX), LANG_PREFIX), line, LANG_PREFIX))

    # fill related table with topics from related folder
    with open(related) as file_in:
        for line in file_in:
            topicsList = line.split()
            for topic in topicsList:
                # add every related topic to list
                if get_topic(topic, LANG_PREFIX):
                    for related_topic in topicsList:
                        if related_topic != topic and get_topic(related_topic, LANG_PREFIX):
                            try:
                                curs.execute('''INSERT INTO "related" (source_id, source_ref_id, dest_id, dest_ref_id, lang)
                                                values (%s,%s,%s,%s, %s)''',
                                             (get_hash(get_topic(topic, LANG_PREFIX), LANG_PREFIX), get_hash(get_topic(topic, "en")), get_hash(
                                                 get_topic(related_topic, LANG_PREFIX), LANG_PREFIX), get_hash(get_topic(related_topic, "en")), LANG_PREFIX))
                            except Exception as e:
                                continue
    # assign topics to each category
    # we take the list of associated topics after char ":" in category file

    # populate category_topics table
    with open(categories) as file_in:
        for line in file_in:
            categ = line.split()[0]
            topicsList = line[line.find(":")+1:].split()
            for topic in topicsList:
                if get_topic(topic, LANG_PREFIX) and get_category(categ, LANG_PREFIX):
                    print("77",  get_topic(topic, LANG_PREFIX),
                          get_category(categ, LANG_PREFIX))
                    curs.execute('''INSERT INTO "category_topics" (category_id, category_ref_id, topic_id, topic_ref_id,lang)
                                            values (%s, %s, %s,%s, %s)''',
                                 (get_hash(
                                     get_category(categ, LANG_PREFIX), LANG_PREFIX), get_hash(get_category(categ, "en")), (get_hash(get_topic(topic, LANG_PREFIX), LANG_PREFIX)), get_hash(get_topic(topic, "en")), LANG_PREFIX))


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

# add default user
curs.execute('''INSERT INTO users (id,username, email, password, type )
                    values (%s,%s,%s,%s,%s)''',
             (get_hash(ROOT_USERNAME), ROOT_USERNAME, ROOT_EMAIL, HASHED_ROOT_PASSWORD, "root"))

# iterate adding languages
for LANG_PREFIX in languages:
    curs.execute('''INSERT INTO user_languages (id, lang )
                        values (%s,%s)''',
                 (get_hash(ROOT_USERNAME), LANG_PREFIX))

# close communication with the PostgreSQL database server
curs.close()
# commit the changes
conn.commit()

print("Completed")
