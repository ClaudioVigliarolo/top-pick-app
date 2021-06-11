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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
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
  onToggleLike(id: number): void;
  onRemove(id: number): void;
  onEdit?(id: number, text: string): void;
  number?: number;
}

const CustomListItem = (props: CustomListItemProps) => {
  const {theme, fontsize} = React.useContext(ThemeContext);
  const [isModalVisible, setModalVisible] = React.useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <>
      <ListItem
        onPress={toggleModal}
        noIndent={true}
        noBorder={true}
        style={[
          styles.ListItemDragcontainer,
          {backgroundColor: props.backgroundColor, opacity: props.opacity},
        ]}>
        <View style={[styles.ListItemDragnumberContainer]}>
          <Text
            style={{
              color: getColor(theme, 'primaryText'),
              textAlignVertical: 'center',
              fontWeight: 'bold',
              fontSize: getFontSize(fontsize, 'fontSmall'),
            }}>
            {props.number}
          </Text>
        </View>

        <View style={styles.ListItemDragtextContainer}>
          <Text
            style={{
              color: getColor(theme, 'primaryText'),
              textAlignVertical: 'center',
              marginRight: 'auto',
              fontSize: getFontSize(fontsize, 'fontSmall'),
            }}>
            {props.text.replace(/^\s+/g, '')}
          </Text>
        </View>

        <View style={styles.ListItemDragiconContainer}>
          <LikeIcon
            name={props.liked ? 'heart' : 'hearto'}
            color={getColor(theme, 'primaryOrange')}
            size={Dimensions.iconMedSmall}
            onPress={() => props.onToggleLike(props.id)}
            style={{
              marginRight: 10,
              marginLeft: Platform.OS === 'ios' ? 10 : 0,
            }}
          />
          <TouchableWithoutFeedback onPressIn={props.onDrag}>
            <Icon
              name="drag"
              color={getColor(theme, 'lightGray')}
              size={Dimensions.iconMed}
            />
          </TouchableWithoutFeedback>
        </View>
      </ListItem>
    </>
  );
};

export default CustomListItem;
