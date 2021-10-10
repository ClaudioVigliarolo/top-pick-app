import * as React from 'react';
import {View, Text as NativeText, Keyboard} from 'react-native';
import {ThemeContext} from '../../context/ThemeContext';
import {getColor} from '../../constants/theme/Themes';
import CustomButton from './CustomButton';
import styles from '../../styles/styles';
import {getFontSize} from '../../constants/theme/Fonts';
interface ButtonQuestionsProps {
  onPress: () => void;
  text: string;
  secondaryText?: string;
  visible: boolean;
  isButtonEnabled: boolean;
  isTextEnabled: boolean;
}

interface ButtonQuestionsState {
  isKeyboadVisible: boolean;
}

export default class ButtonQuestions extends React.Component<
  ButtonQuestionsProps,
  ButtonQuestionsState
> {
  public keyboardDidShowListener: any;
  public keyboardDidHideListener: any;
  state = {
    isKeyboadVisible: false,
  };
  static contextType = ThemeContext;

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide,
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow = () => {
    this.setState({
      isKeyboadVisible: true,
    });
  };

  _keyboardDidHide = () => {
    this.setState({
      isKeyboadVisible: false,
    });
  };

  render() {
    return (
      <View
        style={[
          styles.buttomButtonsContainer,
          {
            backgroundColor: getColor(
              this.context.theme,
              'ButtonQuestionsBackground',
            ),
          },

          {
            borderTopColor: getColor(this.context.theme, 'primaryBackground'),
          },
          {
            display:
              this.props.visible && !this.state.isKeyboadVisible
                ? 'flex'
                : 'none',
          },
        ]}>
        <View style={styles.buttomButtonsContent}>
          <View
            style={{
              flex: 1,
              display: this.props.isTextEnabled ? 'flex' : 'none',
            }}>
            <NativeText
              style={[
                styles.ButtonQuestionsText,

                {
                  color: getColor(this.context.theme, 'primaryOrange'),
                  fontSize: getFontSize(this.context.theme, 'fontMed'),
                },
              ]}>
              {this.props.secondaryText}
            </NativeText>
          </View>
          <View
            style={[
              styles.buttomButtonsBottomContainer,
              {display: this.props.isButtonEnabled ? 'flex' : 'none'},
            ]}>
            <CustomButton
              title={this.props.text}
              onPress={this.props.onPress}
              minWidth={'90%'}
              color={getColor(this.context.theme, 'primaryOrange')}
            />
          </View>
        </View>
      </View>
    );
  }
}
