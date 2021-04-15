import axios from 'axios';
import {JSONresponse, Report} from '../interfaces/Interfaces';
import {generateDB, getUserID, setLastUpdate} from './utils';

const HOSTNAME = 'https://top-pick-api.herokuapp.com';
export const updateTopics = async (
  date: string,
  lang: string,
): Promise<boolean> => {
  const id = getUserID();
  console.log('before', 'my date', date, lang, id);
  let hasUpdated = false;
  try {
    const response = await axios.get(
      `${HOSTNAME}/topick/get_updates/${id}/${date}/${lang}`,
    );
    console.log('rress', response);
    if (!response) {
      throw new Error('got null response');
    }
    if (response.status !== 200) {
      throw new Error('got update server error');
    }
    const data: JSONresponse = response.data;

    if (data.already_updated) {
      console.log('ALREADY UPDATED');
      hasUpdated = true;
    } else {
      //set the app as updated
      console.log('GENERATING?????');
      const generated = await generateDB(response.data, lang);
      if (generated) {
        hasUpdated = true;
        setLastUpdate(data.last_update);
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
    let response = await axios.post(`${HOSTNAME}/topick/add_report`, {
      report,
      lang,
    });
    return response.status == 200;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const checkUpdates = async (
  date: string,
  lang: string,
): Promise<boolean> => {
  try {
    console.log('chiam', date, lang);
    const response = await axios.get(
      `${HOSTNAME}/topick/check_updates/${date}/${lang}`,
    );

    if (!response) {
      throw new Error('got null response');
    }

    const data: JSONresponse = response.data;
    console.log('isupdated', data);
    return data.already_updated;
  } catch (err) {
    console.log(err);
    return false;
  }
};
