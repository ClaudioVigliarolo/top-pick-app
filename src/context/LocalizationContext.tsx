import React, {createContext, useState} from 'react';
import translations, {DEFAULT_LANGUAGE} from './translations';
import * as RNLocalize from 'react-native-localize';
import {Lang} from '../interfaces/Interfaces';
import {readStorageLanguage, setStorageLanguage} from '../utils/utils';

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

  React.useEffect(() => {
    (async () => {
      configureDeviceDefaultLanguage();
    })();
  });

  const onSetAppLanguage = async (language: Lang) => {
    translations.setLanguage(language);
    setAppLanguage(language);
    await setStorageLanguage(language);
  };

  const configureDeviceDefaultLanguage = async () => {
    const currentLanguage = await readStorageLanguage();
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
