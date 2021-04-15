import * as React from 'react';
import {
  Container,
  Header,
  Content,
  List,
  ListItem,
  Text,
  Right,
} from 'native-base';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {ThemeContext} from '../../context/ThemeContext';
import {getColor} from '../../constants/Themes';
import CheckBox from '@react-native-community/checkbox';
import Modal from 'react-native-modal';
import Clipboard from '@react-native-community/clipboard';
import Dimensions from '../../constants/Dimensions';
import translations from '../../context/translations';
import {addReport} from '../../utils/api';
import {Report} from '../../interfaces/Interfaces';
import {getUserID} from '../../utils/utils';

interface ListItemCheckBoxProps {
  text: string;
  value: boolean;
  onValChange: (newVal: boolean) => void;
  id: number;
  topic?: string;
  editable?: boolean;
  onPress: () => void;
}

const ListItemCheckBox = ({
  text,
  value,
  onValChange,
  id,
  editable = true,
  onPress = () => {},
}: ListItemCheckBoxProps) => {
  const {theme} = React.useContext(ThemeContext);
  const [isModalVisible, setModalVisible] = React.useState(false);
  const [isModalReportOn, setModalReportOn] = React.useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const onReport = async (reason: string, question_id: number) => {
    toggleModal();
    const newReport: Report = {
      question_id,
      reason,
      client_id: getUserID(),
    };
    addReport(newReport, translations.LANG);
  };
  return (
    <ListItem style={styles.container} noBorder={true}>
      <TouchableWithoutFeedback
        onPress={() => {
          onPress();
          editable && toggleModal();
        }}>
        <View style={styles.textContainer}>
          <Text
            style={{
              color: getColor(theme, 'primaryText'),
              fontSize: Dimensions.fontList,
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
          value={value}
          onValueChange={(newValue: boolean) => onValChange(newValue)}
        />
      </Right>
      <Modal isVisible={isModalVisible}>
        <TouchableOpacity
          style={styles.modalContainer}
          activeOpacity={1}
          onPressOut={() => {
            setModalVisible(false);
            setModalReportOn(false);
          }}>
          {!isModalReportOn && (
            <TouchableOpacity style={styles.modalItemContainer}>
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => {
                  toggleModal();
                  Clipboard.setString(text);
                }}>
                <Text style={styles.modalText}>{translations.COPY}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => {
                  toggleModal();
                  onValChange(!value);
                }}>
                <Text style={styles.modalText}>
                  {value ? translations.DESELECT : translations.SELECT}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => {
                  setModalReportOn(true);
                }}>
                <Text style={styles.modalText}>{translations.REPORT}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalItem} onPress={toggleModal}>
                <Text style={styles.modalText}>{translations.CLOSE}</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}

          {isModalReportOn && (
            <TouchableOpacity style={styles.modalItemContainer}>
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => {
                  toggleModal();
                  onReport(translations.REASON_TRANSLATION, id);
                }}>
                <Text style={styles.modalText}>
                  {translations.REASON_TRANSLATION}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => {
                  toggleModal();
                  onReport(translations.REASON_PERTINENCE, id);
                }}>
                <Text style={styles.modalText}>
                  {translations.REASON_PERTINENCE}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => {
                  toggleModal();
                  onReport(translations.REASON_SCURRILOUS, id);
                }}>
                <Text style={styles.modalText}>
                  {translations.REASON_SCURRILOUS}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => {
                  toggleModal();
                  onReport(translations.REASON_OTHERS, id);
                }}>
                <Text style={styles.modalText}>
                  {translations.REASON_OTHERS}
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      </Modal>
    </ListItem>
  );
};

export default ListItemCheckBox;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
  },
  modalItem: {
    justifyContent: 'flex-start',
    padding: 10,
    paddingLeft: 20,
  },
  modalItemContainer: {
    backgroundColor: 'white',
    borderRadius: 2,
    alignSelf: 'center',
    opacity: 0.9,
    padding: 2,
    width: Dimensions.MODAL_WIDTH,
  },
  modalText: {
    alignSelf: 'baseline',
    textTransform: 'capitalize',
  },
  modalContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
  },

  textContainer: {
    maxWidth: '82%',
  },
});
