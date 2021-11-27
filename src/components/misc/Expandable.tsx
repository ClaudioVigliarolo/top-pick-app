import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {ICON_MED, ICON_SMALL} from '../../constants/theme/Dimensions';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {getColor} from '../../constants/theme/Themes';
import {ThemeContext} from '../../context/ThemeContext';
import styles from '../../styles/styles';

interface ExpandableProps {
  children: React.ReactNode;
}
export default function Expandable({children}: ExpandableProps) {
  const [expanded, setExpanded] = React.useState(false);
  const {theme} = React.useContext(ThemeContext);

  const renderContent = (expanded: boolean) => {
    if (!expanded) {
      return (
        <Icon
          name="expand-more"
          color={getColor(theme, 'lightGray')}
          style={{alignSelf: 'center'}}
          size={ICON_MED}
        />
      );
    }
    return children;
  };
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => setExpanded(!expanded)}>
      <View>{renderContent(expanded)}</View>
    </TouchableOpacity>
  );
}
