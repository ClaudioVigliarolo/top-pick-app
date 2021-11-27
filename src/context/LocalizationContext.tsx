import React, {createContext, useState} from 'react';
import translations, {DEFAULT_LANGUAGE} from './translations';
import * as RNLocalize from 'react-native-localize';
import {Lang} from '../interfaces/Interfaces';
import {
  getStorageAppLanguage,
  getStorageContentLanguage,
  setStorageAppLanguage,
  setStorageContentLanguage,
} from '../utils/storage/storage';
import {AuthContext} from './AuthContext';
import {updateFirebaseSettings} from '../utils/cloud/firebase';
export const LocalizationContext = createContext({
  setAppLanguage: (newLang: Lang) => {},
  setContentLanguage: (newLang: Lang) => {},
  appLanguage: DEFAULT_LANGUAGE,
  contentLanguage: DEFAULT_LANGUAGE,
});

export const LocalizationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [appLanguage, setAppLanguage] = useState(DEFAULT_LANGUAGE);
  const [contentLanguage, setContentLanguage] = useState(DEFAULT_LANGUAGE);
  const {user} = React.useContext(AuthContext);

  React.useEffect(() => {
    (async () => {
      await configureAppLanguage();
      await configureContentLanguage();
    })();
  }, []);

  const onSetAppLanguage = async (language: Lang) => {
    translations.setLanguage(language);
    setAppLanguage(language);
    await setStorageAppLanguage(language);
    if (user) {
      await updateFirebaseSettings(user);
    }
  };

  const onSetContentLanguage = async (language: Lang) => {
    setContentLanguage(language);
    await setStorageContentLanguage(language);
    if (user) {
      await updateFirebaseSettings(user);
    }
  };

  const configureContentLanguage = async () => {
    const contentLanguage = await getStorageContentLanguage();
    setContentLanguage(contentLanguage);
  };

  const configureAppLanguage = async () => {
    const currentLanguage = await getStorageAppLanguage();
    if (!currentLanguage) {
      let localeCode = DEFAULT_LANGUAGE;
      const supportedLocaleCodes = translations.getAvailableLanguages();
      const phoneLocaleCodes = RNLocalize.getLocales().map(
        (locale) => locale.languageCode,
      );
      phoneLocaleCodes.some((code) => {
        if (supportedLocaleCodes.includes(code)) {
          localeCode = code as Lang;
          return true;
        }
      });
      onSetAppLanguage(localeCode);
    } else {
      onSetAppLanguage(currentLanguage as Lang);
    }
  };

  return (
    <LocalizationContext.Provider
      value={{
        setAppLanguage: onSetAppLanguage,
        appLanguage,
        setContentLanguage: onSetContentLanguage,
        contentLanguage,
      }}>
      {children}
    </LocalizationContext.Provider>
  );
};
