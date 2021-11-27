import * as React from 'react';
import {ListItem, Text, Right} from 'native-base';
import {View, TouchableWithoutFeedback} from 'react-native';
import {ThemeContext} from '../../context/ThemeContext';
import {getColor} from '../../constants/theme/Themes';
import CheckBox from '@react-native-community/checkbox';
import translations from '../../context/translations';
import {addReport} from '../../utils/cloud/api';
import {Lang, Report} from '../../interfaces/Interfaces';
import styles from '../../styles/styles';
import ListItemCheckboxModal from '../modals/ListItemCheckboxModal';
import Clipboard from '@react-native-community/clipboard';
import {AuthContext} from '../../context/AuthContext';
import {StatusContext} from '../../context/StatusContext';
import {getDeviceId} from '../../utils/utils/utils';
import {staticFontSizes} from '../../constants/theme/Fonts';
import {LocalizationContext} from '../../context/LocalizationContext';

interface ListItemCheckBoxProps {
  text: string;
  selected: boolean;
  onSelect: (newVal: boolean) => void;
  modal?: boolean;
  id: number;
  fontSize?: number;
}

const ListItemCheckBox = ({
  text,
  selected,
  onSelect,
  id,
  fontSize = staticFontSizes.fontSmall,
  modal = true,
}: ListItemCheckBoxProps) => {
  const {theme} = React.useContext(ThemeContext);
  const {user} = React.useContext(AuthContext);
  const {setRequiredAuthFunctionality} = React.useContext(StatusContext);
  const {contentLanguage} = React.useContext(LocalizationContext);
  const [isModalVisible, setModalVisible] = React.useState(false);

  const closeModal = () => {
    setModalVisible(false);
  };
  const openModal = () => {
    if (modal) setModalVisible(true);
  };

  const onReport = async (reason: string, question_id: number) => {
    if (!user) {
      setRequiredAuthFunctionality(true);
      return;
    }
    const newReport: Report = {
      question_id,
      reason,
      client_id: user ? user.uid : await getDeviceId(),
    };
    addReport(newReport, contentLanguage);
  };

  return (
    <ListItem style={[styles.ListItemcontainer]} noBorder={true}>
      <TouchableWithoutFeedback onPress={openModal}>
        <View style={styles.ListItemCheckBoxtextContainer}>
          <Text
            style={{
              color: getColor(theme, 'primaryText'),
              fontSize,
            }}>
            {text.replace(/\s+/g, ' ').trim()}
          </Text>
        </View>
      </TouchableWithoutFeedback>

      <Right style={{position: 'absolute', right: '10%'}}>
        <CheckBox
          tintColors={{
            true: getColor(theme, 'primaryOrange'),
            false: getColor(theme, 'lightGray'),
          }}
          onFillColor={getColor(theme, 'primaryOrange')}
          onTintColor={getColor(theme, 'checkOrange')}
          tintColor={getColor(theme, 'lightGray')}
          onCheckColor={getColor(theme, 'white')}
          value={selected}
          onValueChange={(newselected: boolean) => onSelect(newselected)}
        />
      </Right>
      <ListItemCheckboxModal
        isVisible={isModalVisible}
        onClose={closeModal}
        onSelect={() => {
          onSelect(!selected);
          closeModal();
        }}
        onCopy={() => {
          Clipboard.setString(text);
          closeModal();
        }}
        selected={selected}
        onReport={() => {
          onReport(translations.REASON_TRANSLATION, id);
          closeModal();
        }}
      />
    </ListItem>
  );
};

export default ListItemCheckBox;
