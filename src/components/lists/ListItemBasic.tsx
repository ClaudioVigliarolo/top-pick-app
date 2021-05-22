import * as React from 'react';
import {ListItem, Text, Right} from 'native-base';
import {ThemeContext} from '../../context/ThemeContext';
import {getColor} from '../../constants/theme/Themes';
import Icon from 'react-native-vector-icons/AntDesign';
import Dimensions from '../../constants/theme/Dimensions';
import styles from '../../styles/styles';
import {getFontSize} from '../../constants/theme/Fonts';

interface CustomListItemProps {
  text: string;
  secondaryText?: string | number;
  onPress(): void;
  icon: boolean;
}

const CustomListItem = ({
  text,
  secondaryText = '',
  onPress,
  icon,
}: CustomListItemProps) => {
  const {theme, fontsize} = React.useContext(ThemeContext);

  return (
    <ListItem
      style={styles.ListItemcontainer}
      onPress={onPress}
      noBorder={true}>
      <Text
        style={[
          styles.ListItemBasicPrimaryText,
          {
            color: getColor(theme, 'primaryText'),
            fontSize: getFontSize(fontsize, 'fontSmall'),
          },
        ]}>
        {text.replace(/\s+/g, ' ').trim()}
      </Text>
      <Text
        style={[
          styles.ListItemBasicSecondaryText,
          {
            color: getColor(theme, 'lightGray'),
            fontSize: getFontSize(fontsize, 'fontSmall'),
          },
        ]}>
        {secondaryText}
      </Text>
      {icon && (
        <Right style={{position: 'absolute', right: '10%'}}>
          <Icon
            name="right"
            color={getColor(theme, 'lightGray')}
            size={Dimensions.iconSmall}
          />
        </Right>
      )}
    </ListItem>
  );
};

export default CustomListItem;
