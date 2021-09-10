import * as React from 'react';
import {ScrollView} from 'react-native';
import {getColor} from '../../constants/theme/Themes';
import {LocalizationContext} from '../../context/LocalizationContext';
import {ThemeContext} from '../../context/ThemeContext';
import ListItem from '../../components/lists/ListItemBasic';
import AwesomeAlert from 'react-native-awesome-alerts';
import ListItemCheckBox from '../../components/lists/ListItemCheckbox';
import {
  clearStorage,
  isAutomaticUpdate,
  saveStorageUpdateSettings,
} from '../../utils/utils';
import {resetDB} from '../../utils/sql';
import styles from '../../styles/styles';

export default function SettingsPage({navigation}: {navigation: any}) {
  const [isAlert, setAlert] = React.useState<boolean>(false);
  const [isUpdate, setUpdate] = React.useState<boolean>(false);

  React.useEffect(() => {
    (async () => {
      setUpdate(await isAutomaticUpdate());
    })();
  }, []);

  const {translations} = React.useContext(LocalizationContext);

  const {theme} = React.useContext(ThemeContext);

  const showAlert = () => {
    setAlert(true);
  };

  const setUpdateSettings = async (newVal: boolean) => {
    await saveStorageUpdateSettings(newVal);
    setUpdate(newVal);
  };

  return (
    <ScrollView
      style={[
        styles.DefaultContainer,
        {backgroundColor: getColor(theme, 'primaryBackground')},
      ]}>
      <ListItem
        text={translations.LANGUAGE}
        onPress={() => {
          navigation.navigate('Language');
        }}
        icon={false}
      />

      <ListItem
        text={translations.CARD_THEME}
        onPress={() => {
          navigation.navigate('Theme');
        }}
        icon={false}
      />
      <ListItem
        text={translations.FONTSIZE}
        onPress={() => {
          navigation.navigate('Fontsize');
        }}
        icon={false}
      />
      <ListItemCheckBox
        text={translations.AUTOMATIC_UPDATE}
        selected={isUpdate}
        modal={false}
        onSelect={(newVal: boolean) => setUpdateSettings(newVal)}
      />

      <ListItem text="Reset To Default" onPress={showAlert} icon={false} />

      {isAlert && (
        <AwesomeAlert
          show={isAlert}
          showProgress={false}
          title="Reset App"
          message="All the local settings and local questions will be deleted. You cannot undo this operation "
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={false}
          messageStyle={{textAlign: 'center'}}
          showCancelButton={true}
          showConfirmButton={true}
          cancelText="No,Cancel"
          confirmText="Ok,Delete"
          confirmButtonColor={getColor(theme, 'primaryOrange')}
          onCancelPressed={() => {
            setAlert(false);
          }}
          onConfirmPressed={() => {
            resetDB();
            setAlert(false);
          }}
        />
      )}
    </ScrollView>
  );
}
