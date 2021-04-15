import React from 'react';
import {readTheme} from '../utils/utils';
/*
    this context is used to notify the app about his state 
    it can be either up to date with the server, loading or not up to date
*/
export const ThemeContext = React.createContext({
  theme: 'light',
  setTheme: (newTheme: string) => {},
});

export const ThemeProvider = ({children}: {children: any}) => {
  const [theme, setTheme] = React.useState<string>('light');

  React.useEffect(() => {
    (async () => {
      setTheme(await readTheme());
    })();
  });
  const onSetTheme = (newTheme: string) => {
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        setTheme: onSetTheme,
        theme: theme,
      }}>
      {children}
    </ThemeContext.Provider>
  );
};
