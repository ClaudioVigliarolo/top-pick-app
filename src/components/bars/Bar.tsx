import React from 'react';
import {Platform} from 'react-native';
import {Header, Item, Input, Button, Text} from 'native-base';
import {ThemeContext} from '../../context/ThemeContext';
import {getColor} from '../../constants/theme/Themes';

interface SearchBarProps {
  text: string;
  placeholder: string;
  setText: any;
  automatic: boolean;
  LeftIcon: React.ReactNode;
  RightIcon: React.ReactNode;
  onSubmitEditing?: () => void;
}

const SearchBar = ({
  text,
  LeftIcon,
  RightIcon,
  automatic,
  placeholder,
  setText,
  onSubmitEditing,
}: SearchBarProps) => {
  const {theme} = React.useContext(ThemeContext);
  Platform;
  return (
    <React.Fragment>
      <Header
        searchBar
        rounded
        androidStatusBarColor={getColor(theme, 'primaryHeaderBackground')}
        style={{backgroundColor: getColor(theme, 'barExternalColor')}}>
        <Item
          style={{
            backgroundColor: getColor(theme, 'barColor'),
            height: Platform.OS == 'ios' ? 35 : 40,
          }}>
          {LeftIcon}
          <Input
            autoFocus={automatic}
            onChangeText={setText}
            blurOnSubmit={true}
            onSubmitEditing={onSubmitEditing}
            placeholder={placeholder}
            value={text}
            style={{color: getColor(theme, 'barTextColor')}}
          />
          {RightIcon}
        </Item>
        {Platform.OS !== 'ios' && (
          <Button transparent>
            <Text>{placeholder}</Text>
          </Button>
        )}
      </Header>
    </React.Fragment>
  );
};
export default SearchBar;
