import * as React from 'react';
import {ListItem, Text} from 'native-base';
import Clipboard from '@react-native-community/clipboard';
import {ThemeContext} from '../../context/ThemeContext';
import {View, TouchableWithoutFeedback, TouchableOpacity} from 'react-native';
import {getColor} from '../../constants/Themes';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LikeIcon from 'react-native-vector-icons/AntDesign';
import Dimensions from '../../constants/Dimensions';
import Modal from 'react-native-modal';
import translations from '../../context/translations';
import styles from '../../styles/styles';

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
  const {theme} = React.useContext(ThemeContext);
  const [isModalVisible, setModalVisible] = React.useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <View>
      <ListItem
        onPress={toggleModal}
        noIndent={true}
        noBorder={true}
        style={[
          styles.ListItemDragcontainer,
          {backgroundColor: props.backgroundColor, opacity: props.opacity},
        ]}>
        <View style={styles.ListItemDragnumberContainer}>
          <Text
            style={{
              color: getColor(theme, 'primaryText'),
              textAlignVertical: 'center',
              fontWeight: 'bold',
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
            style={{marginRight: 5}}
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
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Modal isVisible={isModalVisible}>
          <TouchableOpacity
            style={styles.ListItemDragmodalContainer}
            activeOpacity={1}
            onPressOut={() => {
              setModalVisible(false);
            }}>
            <TouchableOpacity style={styles.ListItemDragmodalItemContainer}>
              <TouchableOpacity
                style={styles.ListItemDragmodalItem}
                onPress={() => {
                  toggleModal();
                  Clipboard.setString(props.text);
                }}>
                <Text style={styles.ListItemDragmodalText}>
                  {translations.COPY}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.ListItemDragmodalItem}
                onPress={() => {
                  toggleModal();
                  props.onEdit && props.onEdit(props.id, props.text);
                }}>
                <Text style={styles.ListItemDragmodalText}>
                  {translations.EDIT}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.ListItemDragmodalItem}
                onPress={() => {
                  toggleModal();
                  props.onToggleLike(props.id);
                }}>
                <Text style={styles.ListItemDragmodalText}>
                  {props.liked
                    ? translations.REMOVE_FAVOURITE
                    : translations.ADD_FAVOURITE}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.ListItemDragmodalItem}
                onPress={() => {
                  toggleModal();
                  props.onRemove(props.id);
                }}>
                <Text style={styles.ListItemDragmodalText}>
                  {translations.REMOVE}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.ListItemDragmodalItem}
                onPress={toggleModal}>
                <Text style={styles.ListItemDragmodalText}>
                  {translations.CLOSE}
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      </View>
    </View>
  );
};

export default CustomListItem;
