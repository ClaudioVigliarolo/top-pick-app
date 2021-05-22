import SQLite from 'react-native-sqlite-storage';
import CONSTANTS from '../constants/app/App';
import {
  Category,
  Topic,
  TopicCategory,
  Question,
  Related,
  Updates,
  Lang,
} from '../interfaces/Interfaces';

const SQL_MAX_TUPLES = 900;
const DB = SQLite.openDatabase(
  {
    name: 'db.db',
    location: 'default',
    createFromLocation: 1,
  },
  () => {},
  () => {},
);

export const generateDB = async (
  data: Updates,
  LANG: string,
): Promise<boolean> => {
  console.log('start generate');
  try {
    console.log('dd', data.categories);
    //delete all categories
    await DB.transaction((tx) => {
      tx.executeSql(`delete from categories where lang = "${LANG}"`);
    });

    console.log('1');

    //insert new categories
    await bulkInsertCategories(data.categories, LANG);

    console.log('2');

    //delete all topics
    await DB.transaction((tx) => {
      tx.executeSql(`delete from topics where lang = "${LANG}"`);
    });

    console.log('3');

    //insert new topics
    await bulkInsertTopics(data.topics, LANG);

    //delete category topics table
    await DB.transaction((tx) => {
      tx.executeSql(`delete from topic_categories where lang = "${LANG}"`);
    });

    console.log('4');

    //insert new category topics table
    await bulkInsertTopicCategorys(data.topic_categories, LANG);

    //delete related table
    await DB.transaction((tx) => {
      tx.executeSql(`delete from related where lang = "${LANG}"`);
    });

    console.log('ok delete');

    //insert new related table
    await bulkInsertRelated(data.related, LANG);

    //delete questions table
    await DB.transaction((tx) => {
      tx.executeSql(
        `delete from questions WHERE user_modified IN (0) AND lang = "${LANG}"`,
      );
    });
    //insert new questions
    await bulkInsertQuestions(data.questions, LANG);
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
    await DB.transaction((tx) => {
      topics.forEach((el: Topic, i: number) => {
        bigqery += '(?,?,?,?,?)';
        parameters.push(el.id, el.ref_id, el.title, el.source, LANG);
        if (parameters.length == SQL_MAX_TUPLES || i == topics.length - 1) {
          tx.executeSql(
            'INSERT INTO topics  (id, ref_id, title,source,lang) VALUES ' +
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
    await DB.transaction((tx) => {
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
    await DB.transaction((tx) => {
      related.forEach((el: Related, i: number) => {
        bigqery += '(?,?,?,?,?)';
        parameters.push(
          el.source_id,
          el.dest_id,
          el.source_ref_id,
          el.dest_ref_id,
          LANG,
        );
        if (parameters.length == SQL_MAX_TUPLES || i == related.length - 1) {
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

const bulkInsertTopicCategorys = async (
  topicCategories: TopicCategory[],
  LANG: string,
) => {
  let bigqery = '';
  let parameters: (string | number)[] = [];
  return new Promise<void>(async (resolve, reject) => {
    await DB.transaction((tx) => {
      topicCategories.forEach((el: TopicCategory, i: number) => {
        bigqery += '(?,?,?,?,?)';
        parameters.push(
          el.category_id,
          el.topic_id,
          el.category_ref_id,
          el.topic_ref_id,
          LANG,
        );
        if (
          parameters.length == SQL_MAX_TUPLES ||
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

const bulkInsertCategories = async (categories: Category[], LANG: string) => {
  let bigqery = '';
  let parameters: (string | number)[] = [];
  return new Promise<void>(async (resolve, reject) => {
    console.log('sstart');
    await DB.transaction((tx) => {
      console.log('tex', categories);
      categories.forEach((el: Category, i: number) => {
        bigqery += '(?,?,?,?)';
        console.log('ff', el);
        parameters.push(el.id, el.ref_id, el.title, LANG);
        console.log('pp', parameters);
        if (parameters.length == SQL_MAX_TUPLES || i == categories.length - 1) {
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
         WHERE topic_id = "${id}";`,
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
        `SELECT * from topics
          WHERE lang = "${lang}"
          ORDER BY RANDOM()
          LIMIT ${CONSTANTS.MAX_POPULAR};`,
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

export const searchByTopic = (param: string, lang: Lang): Promise<Topic[]> => {
  return new Promise<Topic[]>((resolve, reject) => {
    DB.transaction((tx) => {
      tx.executeSql(
        `SELECT * from topics
        WHERE lang = "${lang}" AND title LIKE "%${param}%"  
        LIMIT ${CONSTANTS.MAX_RECENTS};`,
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

export const getTopicByCategory = (
  id: number,
  lang: Lang,
): Promise<Topic[]> => {
  return new Promise<Topic[]>((resolve, reject) => {
    DB.transaction((tx) => {
      tx.executeSql(
        `SELECT *
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

export const getTopics = (n: number, lang: Lang): Promise<Topic[]> => {
  return new Promise<Topic[]>((resolve, reject) => {
    DB.transaction((tx) => {
      tx.executeSql(
        `SELECT * from topics
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

export const getFavourites = (lang: Lang): Promise<Question[]> => {
  return new Promise<Question[]>((resolve, reject) => {
    DB.transaction((tx) => {
      tx.executeSql(
        `SELECT * from questions
        WHERE LANG = "${lang}"  AND liked = 1;`,
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

export const toggleLike = (id: number, val: boolean): Promise<boolean> => {
  return new Promise<boolean>((resolve, reject) => {
    DB.transaction((tx) => {
      tx.executeSql(
        `UPDATE "questions"
        SET liked = ${val ? 1 : 0}
        WHERE "id" = ${id}`,
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

export const updateQuestion = (
  id: number,
  editedQuestion: string,
): Promise<boolean> => {
  return new Promise<boolean>((resolve, reject) => {
    DB.transaction((tx) => {
      tx.executeSql(
        `UPDATE "questions"
        SET title = "${editedQuestion}" , user_modified = 1
        WHERE "id" = ${id}`,
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

export const addQuestion = (
  id: number,
  topicId: number,
  questionText: string,
  lang: Lang,
): Promise<boolean> => {
  return new Promise<boolean>((resolve, reject) => {
    DB.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO "questions"
        VALUES (${id}, "${topicId}", "${questionText}", 0, 1, "${lang}")`,
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
