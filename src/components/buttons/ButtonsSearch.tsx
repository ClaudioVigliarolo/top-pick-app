import * as React from 'react';
import {View} from 'react-native';
import {ThemeContext} from '../../context/ThemeContext';
import {Topic} from '../../interfaces/Interfaces';
import {Text, Button} from 'native-base';
import {getColor} from '../../constants/theme/Themes';
import styles from '../../styles/styles';
import {getFontSize, staticFontSizes} from '../../constants/theme/Fonts';

interface ButtonsSectionProps {
  header: string;
  buttons: Array<Topic>;
  onSearch: any;
}

const ButtonsSection = (props: ButtonsSectionProps) => {
  const {theme, fontsize} = React.useContext(ThemeContext);
  return (
    <View style={styles.ButtonsSearchContainer}>
      <Text
        style={[
          styles.ButtonsSearchHeader,
          {
            fontSize: getFontSize(fontsize, 'fontMed'),
            color: getColor(theme, 'primaryText'),
          },
        ]}>
        {props.header}
      </Text>
      <View style={styles.ButtonsSearchButtonContainer}>
        {props.buttons.map((button: Topic, i) => (
          <React.Fragment key={i}>
            <Button
              rounded
              bordered
              activeOpacity={0.2}
              onPress={() => props.onSearch(button)}
              style={{
                borderColor: getColor(theme, 'darkerOrange'),
                borderWidth: 10,
                marginRight: 10,
                marginTop: 10,
              }}>
              <Text
                style={{
                  color: getColor(theme, 'darkerOrange'),
                  fontSize: staticFontSizes.fontSmall,
                  padding: 2,
                }}>
                {button.title}
              </Text>
            </Button>
          </React.Fragment>
        ))}
      </View>
    </View>
  );
};

export default ButtonsSection;
