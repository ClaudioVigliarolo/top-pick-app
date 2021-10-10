import SQLite from 'react-native-sqlite-storage';
import {
  MAX_POPULAR,
  MAX_RECENTS,
  MIN_DB_VERSION,
  NO_DATE,
  SQL_MAX_TUPLES,
} from '../constants/app/App';
import {
  Category,
  Topic,
  TopicCategory,
  Question,
  Related,
  TopicUpdates,
  Lang,
  TopicLevel,
  TopicType,
  UserSyncedData,
} from '../interfaces/Interfaces';
import dbUpgrade from '../../database/updates/db-upgrade.json';
import {
  clearStorage,
  saveTopicsTableNumber,
  setLocalUserLastModified,
} from './storage';

const DB = SQLite.openDatabase(
  {
    name: 'db.db',
    location: 'default',
    createFromLocation: 1,
  },
  async () => {
    const version = await getDBVersion();
    const currVersion = dbUpgrade.versions[0].version;
    if (version < currVersion) {
      //Call upgrade scripts
      upgradeFrom(version, currVersion);
    }
  },
  () => {},
);

export const resetDB = async (): Promise<void> => {
  SQLite.deleteDatabase(
    {name: 'db.db', location: 'default'},
    () => {
      console.log('second db deleted');
    },
    () => {
      console.log('ERROR');
    },
  );
  await clearStorage();
};

export const upgradeFrom = async (prevVersion: number, currVersion: number) => {
  let statements: string[] = [];
  if (prevVersion < MIN_DB_VERSION) {
    console.log('detected old db');
  }

  dbUpgrade.versions.forEach((v) => {
    if (v.version > prevVersion) {
      statements.push(...v.statements);
    }
  });
  await Promise.all(
    statements.map(async (statement: string) => {
      await updateVersion(statement);
    }),
  );

  statements.push(
    `UPDATE "version" SET version = ${currVersion} WHERE "version" = ${prevVersion};`,
  );
};

const getDBVersion = () => {
  return new Promise<number>((resolve, reject) => {
    DB.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM version;`,
        [],
        async (tx, results) => {
          let version = results.rows.item(0);
          if (!version) {
            //create default version
            await createVersionTable();
          }
          version = version.version ? version.version : 1;
          resolve(version);
        },
        async (_tx, e) => {
          await createVersionTable();
          console.log(e);
          resolve(1);
        },
      );
    });
  });
};

const createVersionTable = async () => {
  return new Promise<void>(async (resolve, reject) => {
    await DB.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE "version" ("version" INTEGER NOT NULL)',
        [],
        async (tx, results) => {
          await addDefaultVersion();
          resolve();
        },
        async (_tx, e) => {
          console.log(e);
          reject();
        },
      );
    });
  });
};

const updateVersion = async (statement: string) => {
  return new Promise<void>(async (resolve, reject) => {
    await DB.transaction((tx) => {
      tx.executeSql(
        statement,
        [],
        async (tx, results) => {
          console.log('updated db');
          resolve();
        },
        async (_tx, e) => {
          console.log(e);
          reject();
        },
      );
    });
  });
};

const addDefaultVersion = async () => {
  return new Promise<void>(async (resolve, reject) => {
    await DB.transaction((tx) => {
      tx.executeSql(
        'insert into "version" VALUES (1)',
        [],
        (tx, results) => {
          resolve();
        },
        (_tx, e) => {
          console.log(e);
          reject();
        },
      );
    });
  });
};

export const populateDBTopics = async (
  data: TopicUpdates,
  LANG: Lang,
): Promise<boolean> => {
  console.log('start generate');
  try {
    //delete all categories
    await DB.transaction((tx) => {
      tx.executeSql(`delete from categories where lang = "${LANG}"`);
    });

    console.log('1');

    //insert new categories
    await bulkInsertCategories(data.categories);

    console.log('2');

    //delete all topics
    await DB.transaction((tx) => {
      tx.executeSql(
        `delete from topics WHERE lang = "${LANG}" AND user_modified = 0`,
      );
    });

    console.log('3');

    //insert new topics
    await bulkInsertTopics(data.topics);

    //delete category topics table
    await DB.transaction((tx) => {
      tx.executeSql(`delete from topic_categories where lang = "${LANG}"`);
    });

    console.log('4');

    //insert new category topics table
    await bulkInsertTopicCategories(data.topic_categories);

    //delete related table
    await DB.transaction((tx) => {
      tx.executeSql(`delete from related where lang = "${LANG}"`);
    });

    console.log('5');

    //insert new related table
    await bulkInsertRelated(data.related);

    //delete questions table
    await DB.transaction((tx) => {
      tx.executeSql(
        `delete from questions WHERE  lang = "${LANG}" AND user_modified = 0`,
      );
    });
    console.log('6');

    //insert new questions
    await bulkInsertQuestions(data.questions);

    //save configurational parameters to speed up the db interactions
    saveTopicsTableNumber(data.topics.length, LANG);

    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const populateDBClient = async (
  data: UserSyncedData,
): Promise<boolean> => {
  console.log('start generate populateDBClient', data);
  try {
    //delete all topics
    await DB.transaction((tx) => {
      tx.executeSql(`delete from topics WHERE user_modified = 1`);
    });

    console.log('SSS');
    //insert new topics
    await bulkInsertTopics(data.topics, true);

    console.log('TTT');

    //delete questions table
    await DB.transaction((tx) => {
      tx.executeSql(`delete from questions WHERE user_modified = 1`);
    });

    //insert new questions
    await bulkInsertQuestions(data.questions, true);

    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

const bulkInsertTopics = async (topics: Topic[], force: boolean = false) => {
  let bigqery = '';
  let parameters: (string | number)[] = [];
  const INSERT_QUERY = force ? 'INSERT OR REPLACE ' : 'INSERT OR IGNORE ';
  if (topics.length === 0) return;
  return new Promise<void>(async (resolve, reject) => {
    await DB.transaction((tx) => {
      topics.forEach((el: Topic, i: number) => {
        bigqery += '(?,?,?,?,?,?,?,?,?)';
        parameters.push(
          el.id,
          el.ref_id as number,
          el.title,
          el.source as string,
          (el.timestamp as Date).toString(),
          el.user_modified ? 1 : 0,
          el.type as TopicType,
          el.level as TopicLevel,
          el.lang as string,
        );
        if (parameters.length >= SQL_MAX_TUPLES || i == topics.length - 1) {
          tx.executeSql(
            INSERT_QUERY +
              'INTO topics  (id, ref_id, title, source, timestamp, type, user_modified, level, lang) VALUES ' +
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

const bulkInsertQuestions = async (
  questions: Question[],
  force: boolean = false,
) => {
  let bigqery = '';
  let parameters: (string | number)[] = [];
  const INSERT_QUERY = force ? 'INSERT OR REPLACE ' : 'INSERT OR IGNORE ';
  if (questions.length === 0) return;
  return new Promise<void>(async (resolve, reject) => {
    await DB.transaction((tx) => {
      questions.forEach((el: Question, i: number) => {
        bigqery += '(?,?,?,?,?,?,?)';
        parameters.push(
          el.id,
          el.topic_id,
          el.title,
          el.n as number,
          el.liked ? 1 : 0,
          el.user_modified ? 1 : 0,
          el.lang as string,
        );
        if (parameters.length >= SQL_MAX_TUPLES || i == questions.length - 1) {
          tx.executeSql(
            INSERT_QUERY +
              'INTO questions  (id, topic_id, title, n, liked, user_modified, lang) VALUES ' +
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

const bulkInsertRelated = async (related: Related[]) => {
  let bigqery = '';
  let parameters: (string | number)[] = [];
  if (related.length === 0) return;
  return new Promise<void>(async (resolve, reject) => {
    await DB.transaction((tx) => {
      related.forEach((el: Related, i: number) => {
        bigqery += '(?,?,?,?,?)';
        parameters.push(
          el.source_id,
          el.dest_id,
          el.source_ref_id,
          el.dest_ref_id,
          el.lang as string,
        );
        if (parameters.length >= SQL_MAX_TUPLES || i == related.length - 1) {
          tx.executeSql(
            `INSERT INTO related (source_id, dest_id, source_ref_id, dest_ref_id, lang) VALUES` +
              bigqery +
              ';',
            parameters,
            (tx, results) => {
              console.log('ok related');
              resolve();
            },
            (err) => {
              console.log('none');
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

const bulkInsertTopicCategories = async (topicCategories: TopicCategory[]) => {
  let bigqery = '';
  let parameters: (string | number)[] = [];
  if (topicCategories.length === 0) return;
  return new Promise<void>(async (resolve, reject) => {
    await DB.transaction((tx) => {
      topicCategories.forEach((el: TopicCategory, i: number) => {
        bigqery += '(?,?,?,?,?)';
        parameters.push(
          el.category_id,
          el.topic_id,
          el.category_ref_id,
          el.topic_ref_id,
          el.lang as string,
        );
        if (
          parameters.length >= SQL_MAX_TUPLES ||
          i == topicCategories.length - 1
        ) {
          tx.executeSql(
            `INSERT INTO topic_categories (category_id, topic_id, category_ref_id, topic_ref_id, lang) VALUES` +
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

const bulkInsertCategories = async (categories: Category[]) => {
  let bigqery = '';
  let parameters: (string | number)[] = [];
  if (categories.length === 0) return;
  return new Promise<void>(async (resolve, reject) => {
    console.log('sstart');
    await DB.transaction((tx) => {
      categories.forEach((el: Category, i: number) => {
        bigqery += '(?,?,?,?)';
        parameters.push(el.id, el.ref_id, el.title, el.lang as string);
        console.log('pp', parameters);
        if (parameters.length >= SQL_MAX_TUPLES || i == categories.length - 1) {
          tx.executeSql(
            'INSERT INTO categories  (id, ref_id, title,lang) VALUES ' +
              bigqery +
              ';',
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
            (parameters = []);
          bigqery = '';
        } else bigqery += ',';
      });
    });
  });
};

export const getQuestionsByTopic = (id: number): Promise<Question[]> => {
  return new Promise<Question[]>((resolve, reject) => {
    DB.transaction((tx) => {
      tx.executeSql(
        `SELECT * from questions
         WHERE topic_id = "${id}"
         ORDER BY n ASC;
         `,
        [],
        (tx, results) => {
          const rows = results.rows;
          const items: Question[] = [];
          for (let i = 0; i < rows.length; i++) {
            const item = rows.item(i);
            items.push({...item});
          }
          resolve(items);
        },
        (_tx, e) => {
          console.log(e);
          reject([]);
        },
      );
    });
  });
};

export const getRelatedTopics = (
  ref_id: number,
  lang: Lang,
): Promise<Topic[]> => {
  return new Promise<Topic[]>((resolve, reject) => {
    DB.transaction((tx) => {
      tx.executeSql(
        ` SELECT * from topics
        WHERE lang="${lang}" AND ref_id IN ( 
        SELECT  r.dest_ref_id
        FROM related r
        WHERE r.source_ref_id="${ref_id}")`,
        [],
        (tx, results) => {
          const rows = results.rows;
          const items: Topic[] = [];
          for (let i = 0; i < rows.length; i++) {
            const item = rows.item(i);
            items.push({...item});
          }
          resolve(items);
        },
        (_tx, e) => {
          console.log(e);
          reject([]);
        },
      );
    });
  });
};

export const getPopularTopics = (lang: Lang): Promise<Topic[]> => {
  return new Promise<Topic[]>((resolve, reject) => {
    DB.transaction((tx) => {
      tx.executeSql(
        `SELECT id, type, title from topics
          WHERE lang = "${lang}"
          ORDER BY RANDOM()
          LIMIT ${MAX_POPULAR};`,
        [],
        (tx, results) => {
          const rows = results.rows;
          const items: Topic[] = [];
          for (let i = 0; i < rows.length; i++) {
            const item = rows.item(i);
            items.push({...item});
          }
          resolve(items);
        },
        (_tx, e) => {
          console.log(e);
          reject([]);
        },
      );
    });
  });
};

export const getTopicById = (id: number): Promise<Topic> => {
  return new Promise<Topic>((resolve, reject) => {
    DB.transaction((tx) => {
      tx.executeSql(
        `SELECT DISTINCT * from topics
          WHERE id = ${id};`,
        [],
        (tx, results) => {
          const rows = results.rows;
          const items: Topic[] = [];
          for (let i = 0; i < rows.length; i++) {
            const item = rows.item(i);
            items.push({...item});
          }
          resolve(items[0]);
        },
        (_tx, e) => {
          console.log(e);
          reject(null);
        },
      );
    });
  });
};

export const searchByTopic = (param: string, lang: Lang): Promise<Topic[]> => {
  return new Promise<Topic[]>((resolve, reject) => {
    DB.transaction((tx) => {
      tx.executeSql(
        `SELECT title, type, id from topics
        WHERE lang = "${lang}" AND title LIKE "%${param}%"  
        LIMIT ${MAX_RECENTS};`,
        [],
        (tx, results) => {
          const rows = results.rows;
          const items: Topic[] = [];
          for (let i = 0; i < rows.length; i++) {
            const item = rows.item(i);
            items.push({...item});
          }
          resolve(items);
        },
        (_tx, e) => {
          console.log(e);
          reject([]);
        },
      );
    });
  });
};

export const deleteUserContent = async (): Promise<boolean> => {
  try {
    await DB.transaction((tx) => {
      tx.executeSql(`delete from questions where liked = 1;`);
    });
    await DB.transaction((tx) => {
      tx.executeSql(`delete from questions where user_modified IN (1);`);
    });

    await setLocalUserLastModified(NO_DATE);

    return true;
  } catch (error) {
    return false;
  }
};

export const getTopicByCategory = (
  id: number,
  lang: Lang,
): Promise<Topic[]> => {
  return new Promise<Topic[]>((resolve, reject) => {
    DB.transaction((tx) => {
      tx.executeSql(
        `SELECT title,id
        FROM topics
        WHERE lang="${lang}" AND id IN(
          SELECT c.topic_id 
          FROM topic_categories c
          WHERE c.category_id = "${id}" AND c.lang="${lang}"
      )`,
        [],
        (tx, results) => {
          const rows = results.rows;
          const items: Topic[] = [];
          for (let i = 0; i < rows.length; i++) {
            const item = rows.item(i);
            items.push({...item});
          }
          resolve(items);
        },
        (_tx, e) => {
          console.log(e);
          reject([]);
        },
      );
    });
  });
};

export const getAllDialogs = (lang: Lang): Promise<Topic[]> => {
  return new Promise<Topic[]>((resolve, reject) => {
    DB.transaction((tx) => {
      tx.executeSql(
        `SELECT title,id
          FROM topics
          WHERE type=${TopicType.DIALOG} 
          ORDER BY LOWER(title)
          `,
        [],
        (tx, results) => {
          const rows = results.rows;
          const items: Topic[] = [];
          for (let i = 0; i < rows.length; i++) {
            const item = rows.item(i);
            items.push({...item});
          }
          resolve(items);
        },
        (_tx, e) => {
          console.log(e);
          reject([]);
        },
      );
    });
  });
};

export const getAllTopics = (lang: Lang): Promise<Topic[]> => {
  return new Promise<Topic[]>((resolve, reject) => {
    DB.transaction((tx) => {
      tx.executeSql(
        `SELECT title,id, user_modified
          FROM topics
          WHERE lang="${lang}" 
          ORDER BY LOWER(title)
          `,
        [],
        (tx, results) => {
          const rows = results.rows;
          const items: Topic[] = [];
          for (let i = 0; i < rows.length; i++) {
            const item = rows.item(i);
            items.push({...item});
          }
          resolve(items);
        },
        (_tx, e) => {
          console.log(e);
          reject([]);
        },
      );
    });
  });
};

export const getTopicsByLevel = (
  lang: Lang,
  level: TopicLevel,
): Promise<Topic[]> => {
  return new Promise<Topic[]>((resolve, reject) => {
    DB.transaction((tx) => {
      tx.executeSql(
        `SELECT title,id
          FROM topics
          WHERE lang="${lang}" 
          AND level = ${level} 
          ORDER BY LOWER(title)
          `,
        [],
        (tx, results) => {
          const rows = results.rows;
          const items: Topic[] = [];
          for (let i = 0; i < rows.length; i++) {
            const item = rows.item(i);
            items.push({...item});
          }
          resolve(items);
        },
        (_tx, e) => {
          console.log(e);
          reject([]);
        },
      );
    });
  });
};

export const getTopicsByLetter = (
  lang: Lang,
  letter: string,
): Promise<Topic[]> => {
  return new Promise<Topic[]>((resolve, reject) => {
    DB.transaction((tx) => {
      tx.executeSql(
        `SELECT title,id
          FROM topics
          WHERE lang="${lang}" 
          AND title LIKE  "${letter}%" 
          `,
        [],
        (tx, results) => {
          const rows = results.rows;
          const items: Topic[] = [];
          for (let i = 0; i < rows.length; i++) {
            const item = rows.item(i);
            items.push({...item});
          }
          resolve(items);
        },
        (_tx, e) => {
          console.log(e);
          reject([]);
        },
      );
    });
  });
};

export const getNewTopicsCounter = (
  lang: Lang,
  lastData: string,
): Promise<number> => {
  console.log('my last', lastData);
  return new Promise<number>((resolve, reject) => {
    DB.transaction((tx) => {
      tx.executeSql(
        `SELECT COUNT (*) as counter
          FROM topics
          WHERE lang="${lang}" AND timestamp >= "${lastData}"
          `,
        [],
        (tx, results) => {
          console.log('my res', results);
          const rows = results.rows;
          const counter = rows.item(0).counter;
          console.log('MMMMM CUNN', counter);
          resolve(counter);
        },
        (_tx, e) => {
          console.log(e);
          reject(0);
        },
      );
    });
  });
};

export const getRecentTopics = (lang: Lang, n: number): Promise<Topic[]> => {
  return new Promise<Topic[]>((resolve, reject) => {
    DB.transaction((tx) => {
      tx.executeSql(
        `SELECT title, timestamp, id
        FROM topics
        WHERE lang="${lang}" 
        ORDER BY timestamp DESC
        LIMIT ${n};
          `,
        [],
        (tx, results) => {
          const rows = results.rows;
          const items: Topic[] = [];
          for (let i = 0; i < rows.length; i++) {
            const item = rows.item(i);
            items.push({...item});
          }
          resolve(items);
        },
        (_tx, e) => {
          console.log(e);
          reject([]);
        },
      );
    });
  });
};

export const getTopics = (n: number, lang: Lang): Promise<Topic[]> => {
  return new Promise<Topic[]>((resolve, reject) => {
    DB.transaction((tx) => {
      tx.executeSql(
        `SELECT title,id from topics
         WHERE lang = "${lang}"
         ORDER BY RANDOM()
         LIMIT ${n};`,
        [],
        (tx, results) => {
          const rows = results.rows;
          const items: Topic[] = [];
          for (let i = 0; i < rows.length; i++) {
            const item = rows.item(i);
            items.push({...item});
          }
          resolve(items);
        },
        (_tx, e) => {
          console.log(e);
          reject([]);
        },
      );
    });
  });
};

export const getCategories = async (lang: Lang): Promise<Category[]> => {
  return new Promise<Category[]>((resolve, reject) => {
    DB.transaction((tx) => {
      tx.executeSql(
        ` SELECT c2.title, c2.id,  count(*) as counter
          FROM topic_categories c1,  categories c2 
          WHERE c1.lang = "${lang}" AND c2.lang = "${lang}" AND c2.id = (
          SELECT c3.id
          FROM categories c3
          WHERE  c3.id = c1.category_id
      )
          GROUP BY c1.category_id
          ORDER BY c2.title ASC  
    `,
        [],
        (tx, results) => {
          const rows = results.rows;
          const items: Category[] = [];
          for (let i = 0; i < rows.length; i++) {
            const item = rows.item(i);
            items.push({...item});
          }
          resolve(items);
        },
        (_tx, e) => {
          console.log(e);
          reject([]);
        },
      );
    });
  });
};

export const getFavourites = (): Promise<Question[]> => {
  return new Promise<Question[]>((resolve, reject) => {
    DB.transaction((tx) => {
      tx.executeSql(
        `SELECT * from questions
        WHERE liked = 1;`,
        [],
        (tx, results) => {
          const rows = results.rows;
          const items: Question[] = [];
          for (let i = 0; i < rows.length; i++) {
            const item = rows.item(i);
            items.push({...item});
          }
          resolve(items);
        },
        (_tx, e) => {
          console.log(e);
          reject([]);
        },
      );
    });
  });
};

export const getUserTopics = (): Promise<Topic[]> => {
  return new Promise<Question[]>((resolve, reject) => {
    DB.transaction((tx) => {
      tx.executeSql(
        `SELECT * from topics
         WHERE user_modified = 1;`,
        [],
        (tx, results) => {
          const rows = results.rows;
          const items: Question[] = [];
          for (let i = 0; i < rows.length; i++) {
            const item = rows.item(i);
            items.push({...item});
          }
          resolve(items);
        },
        (_tx, e) => {
          console.log(e);
          reject([]);
        },
      );
    });
  });
};

export const getUserQuestions = (): Promise<Question[]> => {
  return new Promise<Question[]>((resolve, reject) => {
    DB.transaction((tx) => {
      tx.executeSql(
        `SELECT * from questions
         WHERE user_modified = 1;`,
        [],
        (tx, results) => {
          const rows = results.rows;
          const items: Question[] = [];
          for (let i = 0; i < rows.length; i++) {
            const item = rows.item(i);
            items.push({...item});
          }
          resolve(items);
        },
        (_tx, e) => {
          console.log(e);
          reject([]);
        },
      );
    });
  });
};

const setTopicModified = async (id: number): Promise<boolean> => {
  await setLocalUserLastModified(new Date().toISOString());
  return new Promise<boolean>((resolve, reject) => {
    DB.transaction((tx) => {
      tx.executeSql(
        `UPDATE "topics"
          SET user_modified = 1
          WHERE "id" = ${id}
        `,
        [],
        (tx, results) => {
          resolve(true);
        },
        (_tx, e) => {
          console.log(e);
          reject(false);
        },
      );
    });
  });
};

export const toggleLike = async (
  questionId: number,
  topicId: number,
  val: number,
): Promise<boolean> => {
  await setTopicModified(topicId);
  return new Promise<boolean>((resolve, reject) => {
    DB.transaction((tx) => {
      tx.executeSql(
        `UPDATE "questions"
         SET liked = ${val ? 1 : 0}, user_modified = 1
         WHERE "id" = ${questionId}
        `,
        [],
        (tx, results) => {
          resolve(true);
        },
        (_tx, e) => {
          console.log(e);
          reject(false);
        },
      );
    });
  });
};

export const updateQuestion = async (
  questionId: number,
  topicId: number,
  editedQuestion: string,
): Promise<boolean> => {
  await setTopicModified(topicId);
  return new Promise<boolean>((resolve, reject) => {
    DB.transaction((tx) => {
      tx.executeSql(
        `UPDATE "questions"
        SET title = "${editedQuestion}" , user_modified = 1
        WHERE "id" = ${questionId}`,
        [],
        (tx, results) => {
          resolve(true);
        },
        (_tx, e) => {
          console.log(e);
          reject(false);
        },
      );
    });
  });
};

export const addQuestion = async (
  id: number,
  topicId: number,
  questionText: string,
  n: number,
  lang: Lang,
): Promise<boolean> => {
  await setLocalUserLastModified(new Date().toISOString());
  return new Promise<boolean>((resolve, reject) => {
    DB.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO "questions"
         VALUES (${id}, "${topicId}", "${questionText}", ${n}, 0, 1, "${lang}")`,
        [],
        (tx, results) => {
          resolve(true);
        },
        (_tx, e) => {
          console.log(e);
          reject(false);
        },
      );
    });
  });
};
