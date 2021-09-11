import * as React from 'react';
import {View, Text, Platform} from 'react-native';
import {CopilotStep, walkthroughable} from 'react-native-copilot';
import {ThemeContext} from '../../../context/ThemeContext';
import {getColor} from '../../../constants/theme/Themes';
import {ListItem as ListItemBase} from 'native-base';
import Dimensions from '../../../constants/theme/Dimensions';
import styles from '../../../styles/styles';
import {getFontSize} from '../../../constants/theme/Fonts';
import translations from '../../../context/translations';
import DragIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import LikeIcon from 'react-native-vector-icons/AntDesign';

const WalkthroughableView = walkthroughable(View);

export const ListItemHelp = () => {
  const {theme, fontsize} = React.useContext(ThemeContext);
  return (
    <ListItemBase
      noIndent={true}
      noBorder={true}
      style={[
        styles.ListItemDragcontainer,
        {
          marginTop: 10,
          backgroundColor: getColor(theme, 'primaryBackground'),
        },
      ]}>
      <CopilotStep
        text="Press the question to copy the text"
        order={1}
        name="one">
        <WalkthroughableView
          style={[styles.ListItemDragtextContainer, {height: 40}]}>
          <Text
            style={{
              color: getColor(theme, 'primaryText'),
              textAlignVertical: 'center',
              marginRight: 'auto',
              fontSize: getFontSize(fontsize, 'fontSmall'),
            }}>
            I am a beautiful question
          </Text>
        </WalkthroughableView>
      </CopilotStep>

      <WalkthroughableView
        style={[styles.ListItemDragIconContainer, {height: 40}]}>
        <CopilotStep
          text={translations.HELP_FAVOURITES_SCREEN_2}
          order={2}
          name="two">
          <WalkthroughableView>
            <LikeIcon
              name={true ? 'heart' : 'hearto'}
              color={getColor(theme, 'primaryOrange')}
              size={Dimensions.iconMedSmall}
              style={{
                padding: 10,
                paddingLeft: 0,
                marginLeft: Platform.OS === 'ios' ? 10 : 0,
              }}
            />
          </WalkthroughableView>
        </CopilotStep>

        <CopilotStep
          text={translations.HELP_FAVOURITES_SCREEN_3}
          order={3}
          name="three">
          <WalkthroughableView>
            <DragIcon
              name="drag"
              color={getColor(theme, 'lightGray')}
              size={Dimensions.iconMed}
            />
          </WalkthroughableView>
        </CopilotStep>
      </WalkthroughableView>
    </ListItemBase>
  );
};
