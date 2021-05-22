import React from 'react';
import {FontDimension} from '../constants/theme/Fonts';
import {CardTemplates} from '../constants/theme/Cardtheme';
import {
  readStorageCardtheme,
  readStorageFontsize,
  readTheme,
} from '../utils/utils';
import {Theme} from '../constants/theme/Themes';
/*
    this context is used to notify the app about his state 
    it can be either up to date with the server, loading or not up to date
*/
export const ThemeContext = React.createContext({
  theme: Theme.LIGHT,
  setTheme: (newTheme: Theme) => {},
  fontsize: FontDimension.MEDIUM,
  setFontsize: (newFontsize: FontDimension) => {},
  setCardtheme: (newCardtheme: keyof CardTemplates) => {},
  cardTheme: 'default' as keyof CardTemplates,
});

export const ThemeProvider = ({children}: {children: React.ReactNode}) => {
  const [theme, setTheme] = React.useState<Theme>(Theme.LIGHT);
  const [cardTheme, setCardtheme] = React.useState<keyof CardTemplates>(
    'default',
  );
  const [fontsize, setFontsize] = React.useState<FontDimension>(
    FontDimension.MEDIUM,
  );

  React.useEffect(() => {
    (async () => {
      setTheme(await readTheme());
      setFontsize(await readStorageFontsize());
      setCardtheme(await readStorageCardtheme());
    })();
  });
  const onSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  const onSetFontsize = (fontsize: FontDimension) => {
    setFontsize(fontsize);
  };

  const onSetCardthem = (newTheme: keyof CardTemplates) => {
    setCardtheme(newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        setTheme: onSetTheme,
        fontsize,
        setCardtheme: onSetCardthem,
        cardTheme,
        setFontsize: onSetFontsize,
        theme: theme,
      }}>
      {children}
    </ThemeContext.Provider>
  );
};
