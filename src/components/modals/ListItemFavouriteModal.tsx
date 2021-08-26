import * as React from 'react';
import {Text} from 'native-base';
import {TouchableOpacity} from 'react-native';
import Modal from 'react-native-modal';
import translations from '../../context/translations';
import styles from '../../styles/styles';

interface ListItemFavouriteModalProps {
  isVisible: boolean;
  onClose: () => void;
  onCopy: () => void;
  onRemove: () => void;
  liked: boolean;
}
export default function ListItemFavouriteModal({
  isVisible,
  onCopy,
  onRemove,
  onClose,
}: ListItemFavouriteModalProps) {
  return (
    <Modal isVisible={isVisible}>
      <TouchableOpacity
        style={styles.ListItemCheckBoxmodalContainer}
        activeOpacity={1}
        onPressOut={onClose}>
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
            onPress={onRemove}>
            <Text style={styles.ListItemCheckBoxmodalText}>Remove</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.ListItemCheckBoxmodalItem}
            onPress={onClose}>
            <Text style={styles.ListItemCheckBoxmodalText}>
              {translations.CLOSE}
            </Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
