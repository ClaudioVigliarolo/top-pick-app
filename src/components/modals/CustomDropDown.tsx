// Modal.js
import React from 'react';
import {
  TouchableWithoutFeedback,
  StyleSheet,
  Modal,
  View,
  TouchableOpacity,
  Linking,
  Text,
  Alert,
} from 'react-native';

interface CustomDropDownProps {
  onClose: () => void;
  open: boolean;
}
const CustomDropDown = (props: CustomDropDownProps) => {
  return (
    <View>
      <Modal
        visible={props.open}
        transparent={true}
        onRequestClose={props.onClose}
        animationType="fade">
        <TouchableWithoutFeedback onPress={props.onClose}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        {/*here starts the content */}
        <View style={styles.modalContent}>
          <TouchableOpacity onPress={() => {}}>
            <View style={styles.modalContentItem}>
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
const styles = StyleSheet.create({
  modalContent: {
    position: 'absolute',
    right: -5,
    top: 3,
    width: 200,
    borderRadius: 4,
    elevation: 5,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 1,
  },
  modalContentItem: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 15,
    height: 50,
    borderBottomColor: '#eee',
    borderBottomWidth: 0.4,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
});
