import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {getColor} from '../../constants/theme/Themes';
import {ThemeContext} from '../../context/ThemeContext';

interface NavTabProps {
  title: string;
  onNav: () => void;
  selected: boolean;
  children: React.ReactNode;
}
export default function NavTab({
  title,
  children,
  onNav,
  selected,
}: NavTabProps) {
  const {theme} = React.useContext(ThemeContext);
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {
        onNav();
      }}>
      <View style={{margin: 6}}>
        <Text
          style={{
            color: selected ? '#eee' : '#eee',
            backgroundColor: selected
              ? getColor(theme, 'lightOrange')
              : getColor(theme, 'darkOrange'),
            padding: 10,
            borderRadius: 50,
            paddingRight: 15,
            paddingLeft: 15,
            borderWidth: 0.5,
            borderColor: selected ? '#eee' : 'transparent',
          }}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
