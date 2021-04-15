import AsyncStorage from '@react-native-community/async-storage';
import SQLite, {SQLiteDatabase} from 'react-native-sqlite-storage';
import DeviceInfo from 'react-native-device-info';

import {
  JSONresponse,
  Category,
  Topic,
  CategoryTopic,
  Question,
  Related,
} from '../interfaces/Interfaces';
import NetInfo from '@react-native-community/netinfo';

import keys from '../../database/keys/keys';
import {updateTopics} from './api';

const NO_DATE = 'Sun May 11,2014';
const NO_LANGUAGE = 'en';
const SQL_MAX_TUPLES = 900;

const db = SQLite.openDatabase(
  {
    name: 'db.db',
    location: 'default',
    createFromLocation: 1,
  },
  () => {},
  () => {},
);

export const getDB = (): SQLiteDatabase => {
  const db = SQLite.openDatabase(
    {
      name: 'db.db',
      location: 'default',
      createFromLocation: 1,
    },
    () => {},
    () => {},
  );
  return db;
};

export const isFirstLaunch = async (): Promise<boolean> => {
  try {
    const hasLaunched = await AsyncStorage.getItem(keys.HAS_LAUNCHED);
    if (hasLaunched === null) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const setFirstLaunch = async () => {
  try {
    AsyncStorage.setItem(keys.HAS_LAUNCHED, 'true');
  } catch (error) {
    console.log(error);
  }
};

export const setFirstUpdate = async () => {
  try {
    AsyncStorage.setItem(keys.HAS_UPDATED, 'true');
  } catch (error) {
    console.log(error);
  }
};

export const isFirstUpdate = async (): Promise<boolean> => {
  try {
    const hasLaunched = await AsyncStorage.getItem(keys.HAS_UPDATED);
    if (hasLaunched === null) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

//check if the language has been used at some point in the past, if no => it means the user has to download the topics from the server
export const isUsedLanguage = async (lang: string): Promise<boolean> => {
  try {
    const usedLanguages = await AsyncStorage.getItem(keys.USED_LANGUAGES);
    if (usedLanguages !== null) {
      const usedLanguagesArr: string[] = JSON.parse(usedLanguages);
      if (usedLanguagesArr.includes(lang)) {
        //the language hash already been used, return true, proceed
        return true;
      }
    }
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const setUsedLanguage = async (lang: string): Promise<void> => {
  try {
    let usedLanguagesArr: string[] = [];
    const usedLanguages = await AsyncStorage.getItem(keys.USED_LANGUAGES);
    console.log('UUUUUUUUUUUUUU', usedLanguages);
    if (usedLanguages !== null) {
      usedLanguagesArr = JSON.parse(usedLanguages);
      if (!usedLanguagesArr.includes(lang)) {
        //the language hash already been used, return true, proceed
        usedLanguagesArr.push(lang);
      }
    } else {
      //create array with first element
      usedLanguagesArr.push(lang);
    }

    await AsyncStorage.setItem(
      keys.USED_LANGUAGES,
      JSON.stringify(usedLanguagesArr),
    );
  } catch (error) {
    // Error saving data
  }
};

export const isAutomaticUpdate = async (): Promise<boolean> => {
  try {
    const isAutomaticUpdate = await AsyncStorage.getItem(keys.SETTINGS_UPDATE);
    console.log('my new isAutomaticUpdate', isAutomaticUpdate);
    return isAutomaticUpdate == 'true' ? true : false;
  } catch (error) {
    // Handle errors here
    return false;
  }
};

export function hashCode(str: string): number {
  const id = str
    .split('')
    .reduce(
      (prevHash, currVal) =>
        ((prevHash << 5) - prevHash + currVal.charCodeAt(0)) | 0,
      0,
    );
  console.log('my id' + id);
  return id;
}

export const readTheme = async (): Promise<string> => {
  try {
    const theme = await AsyncStorage.getItem(keys.THEME_KEY);
    if (theme === null || theme == 'light') {
      return 'light';
    } else {
      return 'dark';
    }
  } catch (e) {
    console.log('Failed to fetch the data from storage');
    return 'light';
  }
};

export const getLastUpdate = async (): Promise<string> => {
  try {
    const date = await AsyncStorage.getItem(keys.LAST_UPDATE_KEY);
    if (date === null) {
      return NO_DATE;
    } else {
      return date;
    }
  } catch (e) {
    console.log('Failed to fetch date from storage');
    return NO_DATE;
  }
};

const isValidDate = (date: string) => !isNaN(new Date(date).getDate());

export const setLastUpdate = async (
  serverUpdateDate: string,
): Promise<void> => {
  try {
    if (isValidDate(serverUpdateDate))
      await AsyncStorage.setItem(
        keys.LAST_UPDATE_KEY,
        isValidDate(serverUpdateDate) ? serverUpdateDate : Date(),
      );
  } catch (e) {
    console.log('Failed to fetch date from storage');
  }
};

export const setAppContentUpdated = async (val: boolean): Promise<void> => {
  AsyncStorage.setItem(keys.LANGUAGE_KEY, JSON.stringify(val));
};
export const getStoredLanguage = async (): Promise<string> => {
  try {
    const currentLanguage = await AsyncStorage.getItem(keys.LANGUAGE_KEY);
    if (currentLanguage === null) {
      return NO_LANGUAGE;
    } else {
      return currentLanguage;
    }
  } catch (e) {
    console.log('Failed to fetch date from storage');
    return NO_LANGUAGE;
  }
};

export const generateDB = async (
  data: JSONresponse,
  LANG: string,
): Promise<boolean> => {
  console.log('start generate');
  try {
    //delete all categories
    await db.transaction((tx) => {
      tx.executeSql(`delete from categories where lang = "${LANG}"`);
    });

    //insert new categories
    await bulkInsertCategories(data.categories, LANG);

    //delete all topics
    await db.transaction((tx) => {
      tx.executeSql(`delete from topics where lang = "${LANG}"`);
    });

    //insert new topics
    await bulkInsertTopics(data.topics, LANG);

    //delete category topics table
    await db.transaction((tx) => {
      tx.executeSql(`delete from category_topics where lang = "${LANG}"`);
    });

    //insert new category topics table
    await bulkInsertCategoryTopics(data.category_topics, LANG);

    //delete related table
    await db.transaction((tx) => {
      tx.executeSql(`delete from related where lang = "${LANG}"`);
    });

    //insert new related table
    await bulkInsertRelated(data.related, LANG);

    //delete questions table
    await db.transaction((tx) => {
      tx.executeSql(
        `delete from questions WHERE user_modified IN (0) AND lang = "${LANG}"`,
      );
    });
    //insert new questions
    await bulkInsertQuestions(data.questions, LANG);

    console.log('FINISH BULLKKKK');
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

const bulkInsertTopics = async (topics: Topic[], LANG: string) => {
  let bigqery = '';
  let parameters: (string | number)[] = [];
  return new Promise<void>(async (resolve, reject) => {
    await db.transaction((tx) => {
      topics.forEach((el: Topic, i: number) => {
        bigqery += '(?,?,?,?)';
        parameters.push(el.id, el.title, el.source, LANG);
        if (parameters.length == SQL_MAX_TUPLES || i == topics.length - 1) {
          tx.executeSql(
            'INSERT INTO topics  (id,title,source,lang) VALUES ' +
              bigqery +
              ';',
            parameters,
            (tx, results) => {
              console.log('ok topics');
              resolve();
            },
            (err) => {
              console.log(err);
              reject();
            },
          ),
            // reset the varriables
            (parameters = []);
          bigqery = '';
        } else bigqery += ',';
      });
    });
  });
};

const bulkInsertQuestions = async (questions: Question[], LANG: string) => {
  let bigqery = '';
  let parameters: (string | number)[] = [];
  return new Promise<void>(async (resolve, reject) => {
    await db.transaction((tx) => {
      questions.forEach((el: Question, i: number) => {
        bigqery += '(?,?,?,?)';
        parameters.push(el.id, el.topic_id, el.title, LANG);
        if (parameters.length == SQL_MAX_TUPLES || i == questions.length - 1) {
          tx.executeSql(
            'INSERT INTO questions  (id, topic_id,title,lang) VALUES ' +
              bigqery +
              ';',
            parameters,
            (tx, results) => {
              console.log('ok questions');
              resolve();
            },
            (err) => {
              console.log(err);
              reject();
            },
          ),
            // reset the varriables
            (parameters = []);
          bigqery = '';
        } else bigqery += ',';
      });
    });
  });
};

const bulkInsertRelated = async (related: Related[], LANG: string) => {
  let bigqery = '';
  let parameters: (string | number)[] = [];
  return new Promise<void>(async (resolve, reject) => {
    await db.transaction((tx) => {
      related.forEach((el: Related, i: number) => {
        bigqery += '(?,?,?,?)';
        parameters.push(el.id, el.source_id, el.dest_id, LANG);
        if (parameters.length == SQL_MAX_TUPLES || i == related.length - 1) {
          tx.executeSql(
            `INSERT INTO related (id, source_id, dest_id, lang) VALUES` +
              bigqery +
              ';',
            parameters,
            (tx, results) => {
              console.log('ok related');
              resolve();
            },
            (err) => {
              console.log(err);
              reject();
            },
          ),
            // reset the varriables
            (parameters = []);
          bigqery = '';
        } else bigqery += ',';
      });
    });
  });
};

const bulkInsertCategoryTopics = async (
  categoryTopics: CategoryTopic[],
  LANG: string,
) => {
  let bigqery = '';
  let parameters: (string | number)[] = [];
  return new Promise<void>(async (resolve, reject) => {
    await db.transaction((tx) => {
      categoryTopics.forEach((el: CategoryTopic, i: number) => {
        bigqery += '(?,?,?)';
        parameters.push(el.category_id, el.topic_id, LANG);
        if (
          parameters.length == SQL_MAX_TUPLES ||
          i == categoryTopics.length - 1
        ) {
          tx.executeSql(
            `INSERT INTO category_topics (category_id, topic_id, lang) VALUES` +
              bigqery +
              ';',
            parameters,
            (tx, results) => {
              console.log('ok category questions');
              resolve();
            },
            (err) => {
              console.log(err);
              reject();
            },
          ),
            // reset the varriables
            (parameters = []);
          bigqery = '';
        } else bigqery += ',';
      });
    });
  });
};

const bulkInsertCategories = async (categories: Category[], LANG: string) => {
  let bigqery = '';
  let parameters: (string | number)[] = [];
  return new Promise<void>(async (resolve, reject) => {
    await db.transaction((tx) => {
      categories.forEach((el: Category, i: number) => {
        bigqery += '(?,?,?)';
        parameters.push(el.id, el.title, LANG);
        if (parameters.length == SQL_MAX_TUPLES || i == categories.length - 1) {
          tx.executeSql(
            'INSERT INTO categories  (id,title,lang) VALUES ' + bigqery + ';',
            parameters,
            (tx, results) => {
              console.log('ok categories');
              resolve();
            },
            (err) => {
              console.log(err);
              reject();
            },
          ),
            // reset the varriables
            (parameters = []);
          bigqery = '';
        } else bigqery += ',';
      });
    });
  });
};

export const isConnected = async (): Promise<boolean> => {
  const state = await NetInfo.fetch();
  return state.isConnected ? true : false;
};

export const getHash = (str1: string, str2: string = '') => {
  const str = str1 + '*' + str2;
  var hash = 0,
    i,
    chr;
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return hash;
};

export const getUserID = () => {
  try {
    const deviceID = DeviceInfo.getUniqueId();
    console.log('device id', deviceID);
    if (!deviceID) throw new Error('device id cannot be null');
    return getHash(deviceID);
  } catch (error) {
    // Handle errors here
    return -1;
  }
};

export const onTopicsUpdate = async (
  lang: string,
  setLoading: (val: boolean) => void,
  setSuccess: (val: boolean) => void,
) => {
  if (await isConnected()) {
    setLoading(true);
    const hasUpdated = await updateTopics(await getLastUpdate(), lang);
    setLoading(false);
    setSuccess(hasUpdated);
  }
};
