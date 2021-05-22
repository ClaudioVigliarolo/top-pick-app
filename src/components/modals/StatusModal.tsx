import React from 'react';
import AwesomeAlert from 'react-native-awesome-alerts';
import {getColor} from '../../constants/theme/Themes';
import {ThemeContext} from '../../context/ThemeContext';
interface StatusModalProps {
  show: boolean;
  showProgress?: boolean;
  closeOnTouchOutside?: boolean;
  showConfirmButton?: boolean;
  showCancelButton?: boolean;
  message: string;
  confirmText?: string;
  cancelText?: string;
  title: string;
  onCancelPressed?: () => void;
  onConfirmPressed?: () => void;
  onDismiss?: () => void;
}
export default function StatusModal({
  show,
  closeOnTouchOutside = false,
  showConfirmButton = false,
  showProgress = false,
  showCancelButton = false,
  message,
  title,
  confirmText = '',
  cancelText = '',
  onCancelPressed = () => {},
  onConfirmPressed = () => {},
  onDismiss = () => {},
}: StatusModalProps) {
  const {theme} = React.useContext(ThemeContext);

  return (
    <>
      {show && (
        <AwesomeAlert
          show={show}
          titleStyle={{
            color: getColor(theme, 'primaryOrange'),
            textAlign: 'center',
          }}
          title={title}
          message={message}
          onDismiss={onDismiss}
          closeOnTouchOutside={closeOnTouchOutside}
          closeOnHardwareBackPress={false}
          messageStyle={{textAlign: 'center'}}
          progressColor={getColor(theme, 'primaryOrange')}
          confirmButtonColor={getColor(theme, 'primaryOrange')}
          showConfirmButton={showConfirmButton}
          showProgress={showProgress}
          showCancelButton={showCancelButton}
          cancelText={cancelText}
          confirmText={confirmText}
          onCancelPressed={onCancelPressed}
          onConfirmPressed={onConfirmPressed}
        />
      )}
    </>
  );
}
