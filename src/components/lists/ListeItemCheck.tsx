import * as React from 'react';
import {ListItem, Text, Right} from 'native-base';
import {View, TouchableWithoutFeedback} from 'react-native';
import {ThemeContext} from '../../context/ThemeContext';
import {getColor} from '../../constants/theme/Themes';
import IconCheck from 'react-native-vector-icons/Feather';
import styles from '../../styles/styles';
import {staticFontSizes} from '../../constants/theme/Fonts';

interface ListItemCheckProps {
  text: string;
  onPress(): void;
  selected: boolean;
  fontSize?: number;
}

const ListItemCheck = ({
  selected,
  fontSize = staticFontSizes.fontSmall,
  onPress,
  text,
}: ListItemCheckProps) => {
  const {theme} = React.useContext(ThemeContext);

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <ListItem style={styles.ListItemcontainer}>
        <View style={{maxWidth: '82%'}}>
          <Text
            style={{
              color: getColor(theme, 'primaryText'),
              fontSize,
            }}>
            {text.replace(/\s+/g, ' ').trim()}
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
            style={{display: selected ? 'flex' : 'none'}}
            color={getColor(theme, 'primaryOrange')}
          />
        </Right>
      </ListItem>
    </TouchableWithoutFeedback>
  );
};

export default ListItemCheck;
