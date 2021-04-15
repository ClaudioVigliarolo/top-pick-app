import React, {Component} from 'react';
import {View} from 'react-native';
import {getColor} from '../../constants/Themes';
import DropDownPicker from 'react-native-dropdown-picker';
import {ThemeContext} from '../../context/ThemeContext';
import Dimensions from '../../constants/Dimensions';

const DEFAULT_TEXT = '';
interface CategoryListProps {
  title: string;
  onLanguageChange(newLang: string): void;
  selected: string;
}

export default function CategoryList(props: CategoryListProps) {
  const [text, setText] = React.useState<string>(DEFAULT_TEXT);
  const {theme} = React.useContext(ThemeContext);

  return (
    <View
      style={{
        padding: 0,
        marginTop: 5,
      }}>
      <DropDownPicker
        items={[
          {
            label: text + 'English',
            value: 'en',
            selected: props.selected == 'en',
          },
          {
            label: text + 'Italiano',
            value: 'it',
            selected: props.selected == 'it',
          },
        ]}
        style={{
          backgroundColor: getColor(theme, 'primaryBackground'),
          borderWidth: 0,
        }}
        placeholder={text + props.title}
        //selectedLabelStyle={{color: getColor(theme, 'primaryOrange')}}
        containerStyle={{height: 40}}
        labelStyle={{
          color: getColor(theme, 'primaryText'),
          fontSize: Dimensions.fontList,
        }}
        onOpen={() => setText(text.replace(DEFAULT_TEXT, ''))}
        dropDownStyle={{
          backgroundColor: getColor(theme, 'primaryHeaderBackground'),
          borderWidth: 0,
        }}
        onChangeItem={(item) => props.onLanguageChange(item.value)}
      />
      <View
        style={{
          borderBottomColor: getColor(theme, 'lineColor'),
          marginLeft: '4%',
          marginTop: 5,
          borderBottomWidth: 1,
        }}></View>
    </View>
  );
}
