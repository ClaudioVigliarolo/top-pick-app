import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import axios from 'axios';
import {HOSTNAME} from '../config/config';
import {JSONresponse, Lang, Report} from '../interfaces/Interfaces';
import {
  generateDB,
  getFavourites,
  getUserQuestions,
  getUserTopics,
} from './sql';
import {
  getHash,
  getLastSync,
  getLastUpdate,
  getUserID,
  setLastSync,
  setLastUpdate,
} from './utils';
export const updateTopics = async (
  userId: string,
  lang: Lang,
): Promise<boolean> => {
  let hasUpdated = false;
  try {
    const response = await axios.get(
      `${HOSTNAME}/updates/get/${getHash(
        userId,
      )}/${await getLastSync()}/${lang}`,
    );
    if (!response || !response.data) {
      throw new Error('got null response');
    }
    if (response.status !== 200) {
      throw new Error('got update server error');
    }
    const data: JSONresponse = response.data;

    if (data.already_updated) {
      hasUpdated = true;
    } else {
      //set the app as updated
      const generated = await generateDB(data.updates, lang);
      if (generated) {
        hasUpdated = true;
        await setLastUpdate(data.last_update, lang);
        await setLastSync(data.last_sync);
      } else {
        hasUpdated = false;
      }
    }
    return hasUpdated;
  } catch (err) {
    console.log('Cannot retrieve ' + err);
    return false;
  }
};

export const addReport = async (
  report: Report,
  lang: string,
): Promise<boolean> => {
  try {
    const response = await axios.post(`${HOSTNAME}/reports`, {
      report,
      lang,
    });
    return response.status === 200;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const syncDB = async (
  user: FirebaseAuthTypes.User,
): Promise<boolean> => {
  try {
    console.log('sssstt', user);
    const questions = await getUserQuestions();
    const topics = await getUserTopics();
    const response = await axios.post(`${HOSTNAME}/client/sync`, {
      id: getHash(user.uid),
      topics,
      questions,
    });
    if (response.status === 200) {
      setLastSync(new Date().toISOString());
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const checkUpdates = async (
  userId: string,
  lang: Lang,
): Promise<boolean> => {
  try {
    console.log('ARCIDEBALE', getHash(userId));
    const response = await axios.get(
      `${HOSTNAME}/updates/check/${getHash(
        userId,
      )}/${await getLastSync()}/${await getLastUpdate(lang)}/${lang}`,
    );
    if (!response) {
      throw new Error('got null response');
    }
    const data: JSONresponse = response.data;
    return data.already_updated;
  } catch (err) {
    console.log(err);

    return false;
  }
};

export const getLastClientBackup = async (
  clientId: number,
): Promise<string | null> => {
  try {
    const response = await axios.get(
      `${HOSTNAME}/client/backup/check/${clientId}`,
    );

    if (!response) {
      throw new Error('got null response');
    }
    const data: {last_backup: string} = response.data;
    return data.last_backup;
  } catch (err) {
    console.log(err);
    return null;
  }
};
//2 condizioni: il contenuto non è più update, o sul server c'è una aggiornamento più nuovo
export const createClientDb = async (
  user: FirebaseAuthTypes.User,
): Promise<boolean> => {
  try {
    const response = await axios.post(`${HOSTNAME}/client/create`, {
      id: getHash(user.uid),
    });
    return response.status === 200;
  } catch (err) {
    console.log(err);
    return false;
  }
};
