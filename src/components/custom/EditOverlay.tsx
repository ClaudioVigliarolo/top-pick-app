import * as React from 'react';
import {Text, View, StyleSheet, TextInput} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {ThemeContext} from '../../context/ThemeContext';
import {getColor} from '../../constants/Themes';
import Dimensions from '../../constants/Dimensions';
import styles from '../../styles/styles';

interface EditOverlayProps {
  isVisible: boolean;
  text: string;
  onChangeText: any;
  onSubmit: any;
  onClose(): any;
}

const EditOverlay = (props: EditOverlayProps) => {
  const {theme} = React.useContext(ThemeContext);
  return (
    <React.Fragment>
      {props.isVisible && (
        <View
          style={[
            styles.EditOverlaycontainer,
            {backgroundColor: getColor(theme, 'primaryHeaderBackground')},
          ]}>
          <AntDesign
            name="close"
            onPress={props.onClose}
            size={35}
            style={styles.EditOverlayCloseIcon}
          />
          <Text style={styles.EditOverlayheader}>Editing Question</Text>

          <View
            style={[
              styles.EditOverlayediting,
              {backgroundColor: getColor(theme, 'primaryBackground')},
            ]}>
            <TextInput
              style={styles.EditOverlaytextInput}
              multiline={true}
              value={props.text}
              onSubmitEditing={props.onSubmit}
              autoFocus={true}
              onChangeText={props.onChangeText}
            />
          </View>
        </View>
      )}
    </React.Fragment>
  );
};

export default EditOverlay;
