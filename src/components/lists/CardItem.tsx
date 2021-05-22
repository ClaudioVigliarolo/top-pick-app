import * as React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {ThemeContext} from '../../context/ThemeContext';
import {CardItem, Body, Text} from 'native-base';
import {getColor} from '../../constants/theme/Themes';

interface CustomCardItemProps {
  text: string;
  type: string;
  color: string;
  onPress: () => void;
}

const CustomCardItem = (props: CustomCardItemProps) => {
  const {theme} = React.useContext(ThemeContext);
  return (
    <TouchableOpacity onPress={props.onPress} activeOpacity={0.85}>
      <View style={{opacity: getColor(theme, 'type') == 'light' ? 0.8 : 1}}>
        <CardItem
          style={{
            backgroundColor: getColor(theme, 'primaryBackground'),
            opacity: getColor(theme, 'type') == 'light' ? 0.8 : 1,
          }}>
          <Body>
            <Text style={{color: getColor(theme, 'primaryText')}}>
              {props.text}
            </Text>
          </Body>
          <Text
            style={{textAlign: 'right', color: getColor(theme, 'primaryText')}}>
            {props.type}
          </Text>
        </CardItem>
      </View>
    </TouchableOpacity>
  );
};

export default CustomCardItem;
