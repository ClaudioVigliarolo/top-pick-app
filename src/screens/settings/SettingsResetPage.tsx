import * as React from 'react';
import {ScrollView, View} from 'react-native';
import Alert from '../../components/alerts/CustomAlert';
import {resetDB} from '../../utils/sql';
import ListItem from '../../components/lists/ListItemBasic';
import styles from '../../styles/styles';
import {getColor} from '../../constants/theme/Themes';
import {ThemeContext} from '../../context/ThemeContext';
import auth from '@react-native-firebase/auth';
import RNRestart from 'react-native-restart'; // Import package from node modules
import {AuthContext} from '../../context/AuthContext';

export default function SettingsResetPage({navigation}: {navigation: any}) {
  const [isAlert, setAlert] = React.useState<boolean>(false);
  const {theme} = React.useContext(ThemeContext);
  const {user} = React.useContext(AuthContext);

  return (
    <ScrollView
      style={[
        styles.DefaultContainer,
        {backgroundColor: getColor(theme, 'primaryBackground')},
      ]}>
      <ListItem
        text="Reset To Default"
        onPress={() => setAlert(true)}
        icon={false}
      />

      <Alert
        show={isAlert}
        showProgress={false}
        title="Reset App"
        message="All the local settings and local questions will be deleted. You cannot undo this operation "
        closeOnTouchOutside={false}
        showCancelButton={true}
        showConfirmButton={true}
        cancelText="No,Cancel"
        confirmText="Ok,Delete"
        onCancelPressed={() => {
          setAlert(false);
        }}
        onConfirmPressed={async () => {
          if (user) {
            await auth().signOut();
          }
          resetDB();
          setAlert(false);
          RNRestart.Restart();
        }}
      />
    </ScrollView>
  );
}
