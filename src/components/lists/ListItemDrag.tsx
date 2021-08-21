import * as React from 'react';
import {ListItem, Text} from 'native-base';
import Clipboard from '@react-native-community/clipboard';
import {ThemeContext} from '../../context/ThemeContext';
import {
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {getColor} from '../../constants/theme/Themes';
import DragIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import LikeIcon from 'react-native-vector-icons/AntDesign';
import Dimensions from '../../constants/theme/Dimensions';
import Modal from 'react-native-modal';
import translations from '../../context/translations';
import styles from '../../styles/styles';
import {getFontSize} from '../../constants/theme/Fonts';

interface CustomListItemProps {
  id: number;
  text: string;
  backgroundColor: string;
  isActive: boolean;
  liked: boolean | undefined;
  opacity: number;
  onDrag?(): void;
  onToggleLike(): void;
  onRemove(): void;
  onEdit?(): void;
  number?: number;
}

const CustomListItem = ({
  backgroundColor,
  id,
  isActive,
  liked,
  onRemove,
  onToggleLike,
  opacity,
  number,
  text,
  onDrag,
  onEdit,
}: CustomListItemProps) => {
  const {theme, fontsize} = React.useContext(ThemeContext);
  const [isModalVisible, setModalVisible] = React.useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <>
      <ListItem
        noIndent={true}
        noBorder={true}
        style={[styles.ListItemDragcontainer]}>
        <View style={[styles.ListItemDragnumberContainer]}>
          <Text
            style={{
              color: getColor(theme, 'primaryText'),
              textAlignVertical: 'center',
              fontWeight: 'bold',
              fontSize: getFontSize(fontsize, 'fontSmall'),
            }}>
            {number}
          </Text>
        </View>

        <TouchableWithoutFeedback onPress={toggleModal}>
          <View style={styles.ListItemDragtextContainer}>
            <Text
              style={{
                color: getColor(theme, 'primaryText'),
                textAlignVertical: 'center',
                marginRight: 'auto',
                fontSize: getFontSize(fontsize, 'fontSmall'),
              }}>
              {text.replace(/^\s+/g, '')}
            </Text>
          </View>
        </TouchableWithoutFeedback>

        <View style={styles.ListItemDragiconContainer}>
          <LikeIcon
            name={liked ? 'heart' : 'hearto'}
            color={getColor(theme, 'primaryOrange')}
            size={Dimensions.iconMedSmall}
            onPress={onToggleLike}
            style={{
              marginRight: 10,
              marginLeft: Platform.OS === 'ios' ? 10 : 0,
            }}
          />
          <TouchableWithoutFeedback onPressIn={onDrag}>
            <DragIcon
              name="drag"
              color={getColor(theme, 'lightGray')}
              size={Dimensions.iconMed}
            />
          </TouchableWithoutFeedback>
        </View>
      </ListItem>

      <Modal isVisible={isModalVisible}>
        <TouchableOpacity
          style={styles.ListItemCheckBoxmodalContainer}
          activeOpacity={1}
          onPressOut={() => {
            setModalVisible(false);
          }}>
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
            {onEdit && (
              <TouchableOpacity
                style={styles.ListItemCheckBoxmodalItem}
                onPress={() => {
                  onEdit();
                  toggleModal();
                }}>
                <Text style={styles.ListItemCheckBoxmodalText}>
                  {translations.EDIT}
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.ListItemCheckBoxmodalItem}
              onPress={() => {
                onToggleLike();
                toggleModal();
              }}>
              <Text style={styles.ListItemCheckBoxmodalText}>like</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.ListItemCheckBoxmodalItem}
              onPress={toggleModal}>
              <Text style={styles.ListItemCheckBoxmodalText}>
                {translations.CLOSE}
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default CustomListItem;
