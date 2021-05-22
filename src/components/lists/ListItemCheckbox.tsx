import * as React from 'react';
import {ListItem, Text, Right} from 'native-base';
import {View, TouchableWithoutFeedback, TouchableOpacity} from 'react-native';
import {ThemeContext} from '../../context/ThemeContext';
import {getColor} from '../../constants/theme/Themes';
import CheckBox from '@react-native-community/checkbox';
import Modal from 'react-native-modal';
import Clipboard from '@react-native-community/clipboard';
import Dimensions from '../../constants/theme/Dimensions';
import translations from '../../context/translations';
import {addReport} from '../../utils/api';
import {Report} from '../../interfaces/Interfaces';
import {getUserID} from '../../utils/utils';
import styles from '../../styles/styles';
import {getFontSize} from '../../constants/theme/Fonts';

interface ListItemCheckBoxProps {
  text: string;
  value: boolean;
  onValChange: (newVal: boolean) => void;
  id: number;
  topic?: string;
  editable?: boolean;
}

const ListItemCheckBox = ({
  text,
  value,
  onValChange,
  id,
  editable = true,
}: ListItemCheckBoxProps) => {
  const {theme, fontsize} = React.useContext(ThemeContext);
  const [isModalVisible, setModalVisible] = React.useState(false);
  const [isModalReportOn, setModalReportOn] = React.useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
    setModalReportOn(false);
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
    <ListItem style={styles.ListItemcontainer} noBorder={true}>
      <TouchableWithoutFeedback
        onPress={() => {
          editable && toggleModal();
        }}>
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
          value={value}
          onValueChange={(newValue: boolean) => onValChange(newValue)}
        />
      </Right>
      <Modal isVisible={isModalVisible}>
        <TouchableOpacity
          style={styles.ListItemCheckBoxmodalContainer}
          activeOpacity={1}
          onPressOut={() => {
            setModalVisible(false);
            setModalReportOn(false);
          }}>
          {!isModalReportOn && (
            <TouchableOpacity style={styles.ListItemCheckBoxmodalItemContainer}>
              <TouchableOpacity
                style={styles.ListItemCheckBoxmodalItem}
                onPress={() => {
                  toggleModal();
                  Clipboard.setString(text);
                }}>
                <Text style={styles.ListItemCheckBoxmodalText}>
                  {translations.COPY}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.ListItemCheckBoxmodalItem}
                onPress={() => {
                  toggleModal();
                  onValChange(!value);
                }}>
                <Text style={styles.ListItemCheckBoxmodalText}>
                  {value ? translations.DESELECT : translations.SELECT}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.ListItemCheckBoxmodalItem}
                onPress={() => {
                  setModalReportOn(true);
                }}>
                <Text style={styles.ListItemCheckBoxmodalText}>
                  {translations.REPORT}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.ListItemCheckBoxmodalItem}
                onPress={toggleModal}>
                <Text style={styles.ListItemCheckBoxmodalText}>
                  {translations.CLOSE}
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}

          {isModalReportOn && (
            <TouchableOpacity style={styles.ListItemCheckBoxmodalItemContainer}>
              <TouchableOpacity
                style={styles.ListItemCheckBoxmodalItem}
                onPress={() => {
                  toggleModal();
                  onReport(translations.REASON_TRANSLATION, id);
                }}>
                <Text style={styles.ListItemCheckBoxmodalText}>
                  {translations.REASON_TRANSLATION}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.ListItemCheckBoxmodalItem}
                onPress={() => {
                  toggleModal();
                  onReport(translations.REASON_PERTINENCE, id);
                }}>
                <Text style={styles.ListItemCheckBoxmodalText}>
                  {translations.REASON_PERTINENCE}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.ListItemCheckBoxmodalItem}
                onPress={() => {
                  toggleModal();
                  onReport(translations.REASON_SCURRILOUS, id);
                }}>
                <Text style={styles.ListItemCheckBoxmodalText}>
                  {translations.REASON_SCURRILOUS}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.ListItemCheckBoxmodalItem}
                onPress={() => {
                  toggleModal();
                  onReport(translations.REASON_OTHERS, id);
                }}>
                <Text style={styles.ListItemCheckBoxmodalText}>
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
