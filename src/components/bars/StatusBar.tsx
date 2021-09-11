import {Spinner} from 'native-base';
import React from 'react';
import {View, Text} from 'react-native';
import {StatusContext} from '../../context/StatusContext';
import {ThemeContext} from '../../context/ThemeContext';
import IconUpdate from 'react-native-vector-icons/Ionicons';
import IconChecked from 'react-native-vector-icons/Ionicons';
import {getColor} from '../../constants/theme/Themes';
import {Lang} from '../../interfaces/Interfaces';
import translations from '../../context/translations';
import {getLastUpdate, onTopicsUpdate} from '../../utils/utils';
import Dimensions from '../../constants/theme/Dimensions';
import TopicsAddedModal from '../modals/TopicsAddedModal';
import StatusModal from '../modals/StatusModal';
import {getNewTopicsCounter} from '../../utils/sql';
import CONSTANTS, {
  NEW_TOPICS_MODAL_TIMEOUT,
  RECENT_LOADED_N,
} from '../../constants/app/App';
export default function StatusBar() {
  const {theme} = React.useContext(ThemeContext);
  const [isUpdatedAlert, setUpdatedAlert] = React.useState<boolean>(false);
  const [isFirstRender, setFirstRender] = React.useState<boolean>(true);
  const [lastUpdate, setLastUpdate] = React.useState<string>('');
  const [newTopicsCounter, setNewTopicsCounter] = React.useState<number>(0);
  const {
    isCheckingContentUpdates,
    setUpdatedContent,
    isLoadingContentUpdates,
    setLoadingContent,
    isContentUpdated,
  } = React.useContext(StatusContext);

  React.useEffect(() => {
    (async () => {
      setLastUpdate(await getLastUpdate(translations.LANG as Lang));
    })();
  }, []);

  React.useEffect(() => {
    (async () => {
      if (isFirstRender) {
        setFirstRender(false);
      } else {
        if (isContentUpdated) {
          const newTopicsCounter = await getNewTopicsCounter(
            translations.LANG as Lang,
            lastUpdate,
          );
          if (newTopicsCounter) {
            setNewTopicsCounter(newTopicsCounter);
            setTimeout(() => {
              setNewTopicsCounter(0);
            }, NEW_TOPICS_MODAL_TIMEOUT);
          }
        }
      }
    })();
  }, [isContentUpdated]);

  const renderConnectivityIcon = () => {
    if (isLoadingContentUpdates || isCheckingContentUpdates) {
      return <Spinner color="white" size="small" style={{marginRight: 20}} />;
    }
    if (isContentUpdated) {
      return (
        <>
          <TopicsAddedModal
            open={newTopicsCounter > 0}
            n={Math.min(RECENT_LOADED_N, newTopicsCounter)}
          />
          <IconChecked
            name="checkmark-done"
            color={getColor(theme, 'secondaryIcon')}
            onPress={() => {
              setUpdatedAlert(true);
            }}
            size={Dimensions.iconMed}
            style={{
              marginRight: 20,
            }}
          />
        </>
      );
    } else {
      return (
        <IconUpdate
          name="reload"
          color={getColor(theme, 'secondaryIcon')}
          onPress={async () =>
            await onTopicsUpdate(
              translations.LANG as Lang,
              setLoadingContent,
              setUpdatedContent,
            )
          }
          size={Dimensions.iconMedSmall}
          style={{
            marginRight: 20,
          }}
        />
      );
    }
  };
  return (
    <View>
      {renderConnectivityIcon()}
      <StatusModal
        show={isUpdatedAlert}
        title={translations.TOP_PICK}
        message={translations.TOPICS_SYNCRONIZED}
        closeOnTouchOutside={true}
        onDismiss={() => setUpdatedAlert(false)}
      />
    </View>
  );
}
