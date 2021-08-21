import React from 'react';
import {Platform} from 'react-native';
import Bar from '../bars/Bar';
import {Header, Item, Input, Icon, Button, Text} from 'native-base';
import {ThemeContext} from '../../context/ThemeContext';
import {getColor} from '../../constants/theme/Themes';
import IconAdd from 'react-native-vector-icons/Ionicons';
import IconBack from 'react-native-vector-icons/MaterialIcons';
import Dimensions from '../../constants/theme/Dimensions';

interface SearchBarProps {
  text: string;
  placeholder: string;
  setText: any;
  onAdd: () => void;
}

const MIN_QUESTION_LEN = 5;

const SearchBar = ({placeholder, setText, text, onAdd}: SearchBarProps) => {
  const {theme} = React.useContext(ThemeContext);

  const onAddCheck = () => {
    if (text.length < MIN_QUESTION_LEN) return false;
    onAdd();
    setText('');
  };

  return (
    <Bar
      LeftIcon={
        <IconAdd
          onPress={onAddCheck}
          name="add"
          size={Dimensions.iconMed}
          style={{paddingLeft: 10}}
          color={getColor(theme, 'searchIconColor')}
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
      automatic={true}
      onSubmitEditing={onAddCheck}
      setText={setText}
      placeholder={placeholder}
      text={text}
    />
  );
};
export default SearchBar;
