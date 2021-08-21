import React from 'react';
import {StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ThemeProvider} from './src/context/ThemeContext';
import Navigation from './src/navigation';
import RNBootSplash from 'react-native-bootsplash';
import StartSlides from './src/screens/start/StartPage';
import {LocalizationProvider} from './src/context/LocalizationContext';
import {StatusProvider} from './src/context/StatusContext';
import {HelpProvider} from './src/context/HelpContext';
import {
  isFirstLaunch as hasAppLaunched,
  setFirstLaunch as setAppFirstLaunch,
} from './src/utils/utils';

const App = () => {
  const [isFirstLaunch, setFirstLaunch] = React.useState<boolean>(false);

  React.useEffect(() => {
    (async () => {
      setFirstLaunch(await hasAppLaunched());
      await RNBootSplash.hide({fade: true});
    })();
  }, []);

  return (
    <ThemeProvider>
      <StatusBar barStyle="light-content" backgroundColor="black" />
      <LocalizationProvider>
        <HelpProvider>
          <SafeAreaProvider>
            {isFirstLaunch ? (
              <StartSlides
                onDone={() => {
                  setFirstLaunch(false);
                  setAppFirstLaunch();
                }}
              />
            ) : (
              <StatusProvider>
                <Navigation />
              </StatusProvider>
            )}
          </SafeAreaProvider>
        </HelpProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default App;
