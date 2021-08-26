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
import AddBar from '../../../components/bars/AddBar';
import DragIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import LikeIcon from 'react-native-vector-icons/AntDesign';
import ButtonQuestions from '../../../components/buttons/ButtonQuestions';

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
          text="Click on the heart icon to remove the questions from your favourite questions "
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
          text="Drag the question here to arrange it in the order you prefer"
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

export const BottomButtonHelp = ({onPress}: {onPress: () => void}) => {
  return (
    <CopilotStep
      text="When you are ready you can either show the questions in a visual form or export them to a pdf  "
      order={5}
      name="five">
      <WalkthroughableView>
        <ButtonQuestions
          onPress={onPress}
          text={translations.READY_TO_TALK}
          isButtonEnabled={true}
          isTextEnabled={false}
          visible={true}
        />
      </WalkthroughableView>
    </CopilotStep>
  );
};
