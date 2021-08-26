import * as React from 'react';
import {Text} from 'native-base';
import {TouchableOpacity} from 'react-native';
import Modal from 'react-native-modal';
import translations from '../../context/translations';
import styles from '../../styles/styles';

interface ListItemCheckboxModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSelect: () => void;
  onCopy: () => void;
  selected: boolean;
  onReport: (val: string) => void;
}

export default function ListItemCheckboxModal({
  onReport,
  isVisible,
  onSelect,
  onCopy,
  selected,
  onClose,
}: ListItemCheckboxModalProps) {
  const [isModalReportOn, setModalReportOn] = React.useState<boolean>(false);

  return (
    <Modal isVisible={isVisible}>
      <TouchableOpacity
        style={styles.ListItemCheckBoxmodalContainer}
        activeOpacity={1}
        onPressOut={() => {
          setModalReportOn(false);
          onClose();
        }}>
        {!isModalReportOn && (
          <TouchableOpacity style={styles.ListItemCheckBoxmodalItemContainer}>
            <TouchableOpacity
              style={styles.ListItemCheckBoxmodalItem}
              onPress={onCopy}>
              <Text style={styles.ListItemCheckBoxmodalText}>
                {translations.COPY}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.ListItemCheckBoxmodalItem}
              onPress={onSelect}>
              <Text style={styles.ListItemCheckBoxmodalText}>
                {selected ? translations.DESELECT : translations.SELECT}
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
              onPress={onClose}>
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
                setModalReportOn(false);
                onReport(translations.REASON_TRANSLATION);
              }}>
              <Text style={styles.ListItemCheckBoxmodalText}>
                {translations.REASON_TRANSLATION}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.ListItemCheckBoxmodalItem}
              onPress={() => {
                setModalReportOn(false);
                onReport(translations.REASON_PERTINENCE);
              }}>
              <Text style={styles.ListItemCheckBoxmodalText}>
                {translations.REASON_PERTINENCE}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.ListItemCheckBoxmodalItem}
              onPress={() => {
                setModalReportOn(false);
                onReport(translations.REASON_SCURRILOUS);
              }}>
              <Text style={styles.ListItemCheckBoxmodalText}>
                {translations.REASON_SCURRILOUS}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.ListItemCheckBoxmodalItem}
              onPress={() => {
                setModalReportOn(false);
                onReport(translations.REASON_OTHERS);
              }}>
              <Text style={styles.ListItemCheckBoxmodalText}>
                {translations.REASON_OTHERS}
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </Modal>
  );
}
