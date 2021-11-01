import * as React from 'react';
import {ListItem, Text} from 'native-base';
import Clipboard from '@react-native-community/clipboard';
import {ThemeContext} from '../../context/ThemeContext';
import {View, TouchableWithoutFeedback, Platform} from 'react-native';
import {getColor} from '../../constants/theme/Themes';
import DragIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import LikeIcon from 'react-native-vector-icons/AntDesign';
import styles from '../../styles/styles';
import {getFontSize} from '../../constants/theme/Fonts';
import ListItemFavouriteModal from '../modals/ListItemFavouriteModal';
import {ICON_MED, ICON_MED_SMALL} from '../../constants/theme/Dimensions';

interface CustomListItemProps {
  id: number;
  text: string;
  liked: boolean;
  onDrag(): void;
  onRemove(): void;
  isActive: boolean;
}

const CustomListItem = ({
  liked,
  text,
  isActive,
  onRemove,
  onDrag,
}: CustomListItemProps) => {
  const {theme, fontsize} = React.useContext(ThemeContext);
  const [isModalVisible, setModalVisible] = React.useState(false);

  const closeModal = () => {
    setModalVisible(false);
  };
  const openModal = () => {
    setModalVisible(true);
  };

  return (
    <>
      <ListItem
        noIndent={true}
        noBorder={true}
        style={[
          styles.ListItemDragcontainer,
          {
            backgroundColor: getColor(theme, 'primaryBackground'),
            opacity: isActive ? 0.7 : 1,
          },
        ]}>
        <TouchableWithoutFeedback onPress={openModal}>
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

        <View style={styles.ListItemDragIconContainer}>
          <LikeIcon
            name={liked ? 'heart' : 'hearto'}
            color={getColor(theme, 'primaryOrange')}
            size={ICON_MED_SMALL}
            onPress={onRemove}
            style={{
              marginRight: 10,
              marginLeft: Platform.OS === 'ios' ? 10 : 0,
            }}
          />
          <TouchableWithoutFeedback onPressIn={onDrag}>
            <DragIcon
              name="drag"
              color={getColor(theme, 'lightGray')}
              size={ICON_MED}
            />
          </TouchableWithoutFeedback>
        </View>
      </ListItem>
      <ListItemFavouriteModal
        isVisible={isModalVisible}
        onClose={closeModal}
        onRemove={onRemove}
        onCopy={() => {
          Clipboard.setString(text);
          closeModal();
        }}
        liked={liked}
      />
    </>
  );
};

export default CustomListItem;
