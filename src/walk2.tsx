// Example to Create Step by Step Walkthrough in any React Native App
// https://aboutreact.com/step-by-step-app-introduction-in-react-native/

// import React in our code
import React, {useState, useEffect} from 'react';

// import all the components we are going to use
import {
  SafeAreaView,
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
  Switch,
} from 'react-native';

// For Step by Step Walkthrough
import {copilot, walkthroughable, CopilotStep} from 'react-native-copilot';

const App = (props) => {
  const [secondStepActive, setSecondStepActive] = useState(true);

  useEffect(() => {
    //setting a function to handle the step change event
    props.copilotEvents.on('stepChange', handleStepChange);
    //To start the step by step Walk through
    props.start();
  }, []);

  const handleStepChange = (step) => {
    //Handler, in case we want to handle the step change
    console.log(`Current step is: ${step.name}`);
  };

  //Making a WalkthroughableText
  const WalkthroughableText = walkthroughable(Text);

  return (
    <View style={styles.container}>
      {/*Step 1 to show the heading*/}
      <CopilotStep
        text="This is the heading with my cazzo"
        order={1}
        name="firstUniqueKey">
        <WalkthroughableText style={styles.title}>
          AAAaaaaaaa
        </WalkthroughableText>
      </CopilotStep>
    </View>
  );
};

export default copilot({
  animated: true, // Can be true or false
  overlay: 'svg', // Can be either view or svg
})(App);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    margin: 20,
  },
  profilePhoto: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginVertical: 20,
  },
  middleView: {
    flex: 1,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#2980b9',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  activeSwitchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
});
