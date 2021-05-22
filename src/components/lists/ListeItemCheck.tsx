import * as React from 'react';
import {ListItem, Text, Right} from 'native-base';
import {View, TouchableWithoutFeedback} from 'react-native';
import {ThemeContext} from '../../context/ThemeContext';
import {getColor} from '../../constants/theme/Themes';
import IconCheck from 'react-native-vector-icons/Feather';
import styles from '../../styles/styles';
import {getFontSize} from '../../constants/theme/Fonts';

interface ListItemCheckProps {
  text: string;
  onPress(): void;
  selected: boolean;
}

const ListItemCheck = (props: ListItemCheckProps) => {
  const {theme, fontsize} = React.useContext(ThemeContext);

  return (
    <TouchableWithoutFeedback onPress={props.onPress}>
      <ListItem style={styles.ListItemcontainer}>
        <View style={{maxWidth: '82%'}}>
          <Text
            style={{
              color: getColor(theme, 'primaryText'),
              fontSize: getFontSize(fontsize, 'fontSmall'),
            }}>
            {props.text.replace(/\s+/g, ' ').trim()}
          </Text>
        </View>
        <Right
          style={{
            position: 'absolute',
            right: '10%',
          }}>
          <IconCheck
            name="check"
            size={30}
            style={{display: props.selected ? 'flex' : 'none'}}
            color={getColor(theme, 'primaryOrange')}
          />
        </Right>
      </ListItem>
    </TouchableWithoutFeedback>
  );
};

export default ListItemCheck;
