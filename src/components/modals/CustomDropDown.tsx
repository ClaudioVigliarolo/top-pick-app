// Modal.js
import React from 'react';
import {
  TouchableWithoutFeedback,
  Modal,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import {HelpContext} from '../../context/HelpContext';
import {HelpScreen} from '../../interfaces/Interfaces';
import styles from '../../styles/styles';

interface CustomDropDownProps {
  onClose: () => void;
  open: boolean;
  screen: HelpScreen;
}
const CustomDropDown = ({onClose, open, screen}: CustomDropDownProps) => {
  const {setHelp} = React.useContext(HelpContext);
  return (
    <View>
      <Modal
        visible={open}
        transparent={true}
        onRequestClose={onClose}
        animationType="fade">
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.DropDownOverlay} />
        </TouchableWithoutFeedback>
        {/*here starts the content */}
        <View style={styles.DropDownContent}>
          <TouchableOpacity
            onPress={() => {
              setHelp(screen);
              onClose();
            }}>
            <View style={styles.DropDownContentItem}>
              <Text>Help</Text>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};
/*
<TouchableOpacity
    onPress={() =>
      Linking.openURL(
        "mailto:topick@tech-center.com?subject=Have feedback? Have Bugs to report? We'd love to hear it.",
      )
    }>
    <View style={styles.modalContentItem}>
      <Text>Report a problem</Text>
    </View>
  </TouchableOpacity>
  */
export default CustomDropDown;
