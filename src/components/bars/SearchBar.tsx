import React from 'react';
import {Platform} from 'react-native';
import Bar from '../bars/Bar';
import {Header, Item, Input, Icon, Button, Text} from 'native-base';
import {ThemeContext} from '../../context/ThemeContext';
import {getColor} from '../../constants/theme/Themes';
import IconBack from 'react-native-vector-icons/MaterialIcons';
import Dimensions from '../../constants/theme/Dimensions';

interface SearchBarProps {
  text: string;
  placeholder: string;
  setText: any;
  automatic: boolean;
}

const SearchBar = ({automatic, placeholder, setText, text}: SearchBarProps) => {
  const {theme} = React.useContext(ThemeContext);
  return (
    <Bar
      LeftIcon={
        <Icon
          name="ios-search"
          style={{color: getColor(theme, 'searchIconColor')}}
        />
      }
      RightIcon={
        <IconBack
          name="cancel"
          color={getColor(theme, 'searchIconColor')}
          size={Dimensions.iconCancelBar}
          style={{padding: 5}}
          onPress={() => setText('')}
        />
      }
      automatic={automatic}
      setText={setText}
      placeholder={placeholder}
      text={text}
    />
  );
};
export default SearchBar;
