import axios from 'axios';
import {JSONresponse, Lang, Report} from '../interfaces/Interfaces';
import {generateDB} from './sql';
import {getLastUpdate, getUserID, setLastUpdate} from './utils';

const HOSTNAME = 'https://top-pick-api.herokuapp.com';
export const updateTopics = async (lang: Lang): Promise<boolean> => {
  const id = getUserID();
  let hasUpdated = false;
  try {
    const response = await axios.get(
      `${HOSTNAME}/updates/${id}/${await getLastUpdate(lang)}/${lang}`,
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
    let response = await axios.post(`${HOSTNAME}/reports`, {
      report,
      lang,
    });
    return response.status == 200;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const checkUpdates = async (lang: Lang): Promise<boolean> => {
  try {
    const response = await axios.get(
      `${HOSTNAME}/topick/check_updates/${await getLastUpdate(lang)}/${lang}`,
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
