import * as React from 'react';
import {Text, View, TextInput} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {ThemeContext} from '../../context/ThemeContext';
import {getColor} from '../../constants/theme/Themes';
import styles from '../../styles/styles';
import {getFontSize} from '../../constants/theme/Fonts';

interface EditOverlayProps {
  isVisible: boolean;
  onSubmit: (newText: string) => void;
  onClose: () => void;
  initialText: string;
}

const EditOverlay = ({
  isVisible,
  onClose,
  onSubmit,
  initialText,
}: EditOverlayProps) => {
  const [text, setText] = React.useState('');
  const {theme, fontsize} = React.useContext(ThemeContext);

  React.useEffect(() => {
    setText(initialText);
  }, [initialText]);
  return (
    <React.Fragment>
      {isVisible && (
        <View
          style={[
            styles.EditOverlaycontainer,
            {backgroundColor: getColor(theme, 'primaryHeaderBackground')},
          ]}>
          <AntDesign
            name="close"
            onPress={onClose}
            size={35}
            style={styles.EditOverlayCloseIcon}
          />
          <Text
            style={[
              styles.EditOverlayheader,
              {
                fontSize: getFontSize(fontsize, 'fontMed'),
              },
            ]}>
            Editing Question
          </Text>

          <View
            style={[
              styles.EditOverlayediting,
              {backgroundColor: getColor(theme, 'primaryBackground')},
            ]}>
            <TextInput
              style={[
                styles.EditOverlaytextInput,
                {color: getColor(theme, 'primaryText')},
              ]}
              blurOnSubmit={true}
              multiline={true}
              value={text}
              onSubmitEditing={() => text && onSubmit(text)}
              autoFocus={true}
              onChangeText={(text) => setText(text)}
            />
          </View>
        </View>
      )}
    </React.Fragment>
  );
};

export default EditOverlay;
