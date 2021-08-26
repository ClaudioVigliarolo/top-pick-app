import React from 'react';
import {getColor} from '../../constants/theme/Themes';
import {ThemeContext} from '../../context/ThemeContext';
import ActionSheet from 'react-native-actionsheet';
import translations from '../../context/translations';

interface ButtonsModalProps {
  isActive: boolean;
  onHide: Function;
  title: string;
  data: string[];
  onPress(name: string): void;
  color: string;
  backgroundColor: string;
  actionSheet: any;
}

const ActionButtons = (props: ButtonsModalProps) => {
  const {theme} = React.useContext(ThemeContext);
  return (
    <ActionSheet
      ref={props.actionSheet}
      title={translations.READY_TO_TALK}
      options={props.data}
      tintColor={getColor(theme, 'primaryOrange')}
      cancelButtonIndex={props.data.length - 1}
      onPress={(index) => {
        props.onPress(props.data[index]);
      }}
    />
  );
};
export default ActionButtons;
