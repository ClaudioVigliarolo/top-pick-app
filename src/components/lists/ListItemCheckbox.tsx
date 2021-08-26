import * as React from 'react';
import {ListItem, Text, Right} from 'native-base';
import {View, TouchableWithoutFeedback} from 'react-native';
import {ThemeContext} from '../../context/ThemeContext';
import {getColor} from '../../constants/theme/Themes';
import CheckBox from '@react-native-community/checkbox';
import translations from '../../context/translations';
import {addReport} from '../../utils/api';
import {Report} from '../../interfaces/Interfaces';
import {getUserID} from '../../utils/utils';
import styles from '../../styles/styles';
import {getFontSize} from '../../constants/theme/Fonts';
import ListItemCheckboxModal from '../modals/ListItemCheckboxModal';
import Clipboard from '@react-native-community/clipboard';

interface ListItemCheckBoxProps {
  text: string;
  selected: boolean;
  onSelect: (newVal: boolean) => void;
  id: number;
}

const ListItemCheckBox = ({
  text,
  selected,
  onSelect,
  id,
}: ListItemCheckBoxProps) => {
  const {theme, fontsize} = React.useContext(ThemeContext);
  const [isModalVisible, setModalVisible] = React.useState(false);

  const closeModal = () => {
    setModalVisible(false);
  };
  const openModal = () => {
    setModalVisible(true);
  };

  const onReport = async (reason: string, question_id: number) => {
    closeModal();
    const newReport: Report = {
      question_id,
      reason,
      client_id: getUserID(),
    };
    addReport(newReport, translations.LANG);
  };
  return (
    <ListItem style={styles.ListItemcontainer} noBorder={true}>
      <TouchableWithoutFeedback onPress={openModal}>
        <View style={styles.ListItemCheckBoxtextContainer}>
          <Text
            style={{
              color: getColor(theme, 'primaryText'),
              fontSize: getFontSize(fontsize, 'fontSmall'),
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
