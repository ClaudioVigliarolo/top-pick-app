import React from 'react';
import {View} from 'react-native';
import Alert from 'react-native-awesome-alerts';
import {getColor} from '../../constants/theme/Themes';
import {ThemeContext} from '../../context/ThemeContext';

interface CustomAlertProps {
  show: boolean;
  onCancelPressed: () => void;
  onConfirmPressed: () => void;
  cancelText: string;
  confirmText: string;
  title: string;
  message: string;
  showProgress: boolean;
  closeOnTouchOutside: boolean;
  showCancelButton: boolean;
  showConfirmButton: boolean;
}

export default function CustomAlert({
  cancelText,
  closeOnTouchOutside,
  confirmText,
  message,
  onCancelPressed,
  onConfirmPressed,
  show,
  showCancelButton,
  showConfirmButton,
  showProgress,
  title,
}: CustomAlertProps) {
  const {theme} = React.useContext(ThemeContext);

  return (
    <View>
      {show && (
        <Alert
          show={show}
          showProgress={showProgress}
          title={title}
          message={message}
          closeOnTouchOutside={closeOnTouchOutside}
          closeOnHardwareBackPress={false}
          messageStyle={{textAlign: 'center'}}
          showCancelButton={showCancelButton}
          showConfirmButton={showConfirmButton}
          cancelText={cancelText}
          confirmText={confirmText}
          confirmButtonColor={getColor(theme, 'primaryOrange')}
          onCancelPressed={onCancelPressed}
          onConfirmPressed={onConfirmPressed}
        />
      )}
    </View>
  );
}
