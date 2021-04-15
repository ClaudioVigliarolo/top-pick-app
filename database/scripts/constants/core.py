italianTopics = {
    "easter": "pasqua",
    "disabilities": "disabilità",
    "comics": "fumetti",
    "change": "cambiamenti",
    "chores": "faccende domestiche",
    "airplanes": "aereo",
    "cheating": "imbrogli",
    "clothes": "vestiti",
    "creativity": "creatività",
    "drugs": "droghe",
    "art": "arte",
    "celebrities": "celebrità",
    "death": "morte",
    "childhood": "infanzia",
    "education": "educazione",
    "entertainment": "intrattenimento",
    "business": "business",
    "body_language": "linguaggio del corpo",
    "adoption": "adozioni",
    "birthdays": "compleanni",
    "advice": "consigli",
    "conflict": "conflitti",
    "diet": "diete",
    "books": "libri",
    "basketball": "pallacanestro",
    "complaining": "lamentarsi",
    "beauty": "bellezza",
    "arguing": "litigi",
    "facebook": "facebook",
    "wishes": "desideri",
    "cities": "città",
    "colors": "colori",
    "animals": "animali",
    "disaster": "disastri",
    "corruption": "corruzione",
    "cars": "automobili",
    "advertising": "pubblicità",
    "environment": "ambiente",
    "beach": "spiaggia",
    "dreams": "sogni",
    "behaviour": "comportamento",
    "countries": "paesi",
    "crime": "criminalità",
    "bags": "borse",
    "dating": "appuntamenti",
    "community": "comunità",
    "children": "bambini",
    "charity": "beneficienza",
    "earthquakes": "terremoti",
    "university": "università",
    "culture": "culture",
    "dangers": "pericoli",
    "conversation": "conversazioni",
    "aging": "invecchiare"
}


englishTopics = {
    "all": "all",
    "computers": "computers",
    "easter": "easter",
    "disabilities": "disabilities",
    "comics": "comics",
    "change": "change",
    "chores": "chores",
    "airplanes": "airplanes",
    "university": "university",
    "cheating": "cheating",
    "clothes": "clothes",
    "creativity": "creativity",
    "drugs": "drugs",
    "art": "art",
    "celebrities": "celebrities",
    "death": "death",
    "childhood": "childhood",
    "education": "education",
    "entertainment": "entertainment",
    "business": "business",
    "body_language": "body language",
    "adoption": "adoption",
    "birthdays": "birthdays",
    "advice": "advice",
    "conflict": "conflict",
    "diet": "diet",
    "books": "books",
    "basketball": "basketball",
    "complaining": "complaining",
    "beauty": "beauty",
    "arguing": "arguing",
    "facebook": "facebook",
    "wishes": "wishes",
    "cities": "cities",
    "colors": "colors",
    "animals": "animals",
    "disaster": "disaster",
    "corruption": "corruption",
    "cars": "cars",
    "advertising": "advertising",
    "environment": "environment",
    "beach": "beach",
    "dreams": "dreams",
    "behaviour": "behaviour",
    "countries": "countries",
    "crime": "crime",
    "pets": "pets",
    "bags": "bags",
    "dating": "dating",
    "community": "community",
    "children": "children",
    "charity": "charity",
    "earthquakes": "earthquakes",
    "culture": "culture",
    "dangers": "dangers",
    "conversation": "conversation",
    "aging": "aging",
}


italianCategories = {
    "all": 'tutte',
    "languages": 'Lingue',
    "friends": 'Amici',
    "school": 'Scuola',
    "work": 'Lavoro',
    "relax": 'Relax',
    "fun": 'Divertimento',
    "romance": 'Amore',
}


englishCategories = {
    "all": 'all',
    "languages": 'languages',
    "friends": 'friends',
    "school": 'school',
    "work": 'work',
    "relax": 'relax',
    "fun": 'fun',
    "romance": 'romance',
}


def get_topic(word, lang):
    if lang == "it":
        return italianTopics[word] if word in italianTopics else False
    else:
        return englishTopics[word] if word in englishTopics else False


def get_category(word, lang):
    if lang == "it":
        return italianCategories[word] if word in italianCategories else False
    else:
        return englishCategories[word] if word in englishCategories else False


HASH_DIGITS = 8


def get_hash(string1, string2="*"):
    return (hash(string1+"*"+string2)) % (10 ** HASH_DIGITS)
