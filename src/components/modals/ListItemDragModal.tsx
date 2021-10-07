import * as React from 'react';
import {Text} from 'native-base';
import {TouchableOpacity} from 'react-native';
import Modal from 'react-native-modal';
import translations from '../../context/translations';
import styles from '../../styles/styles';

interface ListItemDragModalProps {
  isVisible: boolean;
  onClose: () => void;
  onEdit: () => void;
  onCopy: () => void;
  onRemove: () => void;
  onToggleLike: () => void;
  liked: number;
}
export default function ListItemDragModal({
  isVisible,
  onCopy,
  onEdit,
  onRemove,
  onToggleLike,
  liked,
  onClose,
}: ListItemDragModalProps) {
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
            onPress={() => {
              onEdit();
            }}>
            <Text style={styles.ListItemCheckBoxmodalText}>
              {translations.EDIT}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.ListItemCheckBoxmodalItem}
            onPress={onToggleLike}>
            <Text style={styles.ListItemCheckBoxmodalText}>
              {liked ? 'unlike' : 'like'}
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
