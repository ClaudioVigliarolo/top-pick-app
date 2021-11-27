import React from 'react';
import {StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ThemeProvider} from './src/context/ThemeContext';
import Navigation from './src/navigation';
import RNBootSplash from 'react-native-bootsplash';
import {LocalizationProvider} from './src/context/LocalizationContext';
import {StatusProvider} from './src/context/StatusContext';
import {HelpProvider} from './src/context/HelpContext';
import {
  isFirstLaunch as hasAppLaunched,
  setFirstLaunch as setAppFirstLaunch,
} from './src/utils/storage/storage';
import {AuthProvider} from './src/context/AuthContext';
import StartSlider from './src/components/sliders/StartSlider';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';

const App = () => {
  const [isFirstLaunch, setFirstLaunch] = React.useState<boolean>(false);

  React.useEffect(() => {
    (async () => {
      setFirstLaunch(await hasAppLaunched());
      await RNBootSplash.hide({fade: true});
    })();

    PushNotification.createChannel(
      {
        channelId: 'default', // (required)
        channelName: 'default', // (required)
      },
      (created) => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
    );
  }, []);

  return (
    <AuthProvider>
      <ThemeProvider>
        <StatusBar barStyle="light-content" backgroundColor="black" />
        <LocalizationProvider>
          <HelpProvider>
            <SafeAreaProvider>
              {isFirstLaunch ? (
                <StartSlider
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
    </AuthProvider>
  );
};

export default App;
