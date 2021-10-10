import React, {createContext, useState} from 'react';
import translations, {DEFAULT_LANGUAGE} from './translations';
import * as RNLocalize from 'react-native-localize';
import {Lang} from '../interfaces/Interfaces';
import {getStorageLanguage, setStorageLanguage} from '../utils/storage';
import {AuthContext} from './AuthContext';
import {updateFirebaseSettings} from '../utils/firebase';
export const LocalizationContext = createContext({
  translations,
  setAppLanguage: (newLang: Lang) => {},
  appLanguage: DEFAULT_LANGUAGE,
  configureDeviceDefaultLanguage: async () => {},
});

export const LocalizationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [appLanguage, setAppLanguage] = useState(DEFAULT_LANGUAGE);
  const {user} = React.useContext(AuthContext);

  React.useEffect(() => {
    (async () => {
      configureDeviceDefaultLanguage();
    })();
  });

  const onSetAppLanguage = async (language: Lang) => {
    translations.setLanguage(language);
    setAppLanguage(language);
    await setStorageLanguage(language);
    if (user) {
      await updateFirebaseSettings(user);
    }
  };

  const configureDeviceDefaultLanguage = async () => {
    const currentLanguage = await getStorageLanguage();
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
        translations,
        setAppLanguage: onSetAppLanguage,
        appLanguage,
        configureDeviceDefaultLanguage,
      }}>
      {children}
    </LocalizationContext.Provider>
  );
};
