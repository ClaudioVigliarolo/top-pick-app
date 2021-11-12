import React from 'react';
import {View} from 'react-native';
import {getColor} from '../../../constants/theme/Themes';
import {ThemeContext} from '../../../context/ThemeContext';
import {Container, Content, Item, Label, Input} from 'native-base';
import {useNavigation} from '@react-navigation/native';
import {Form} from 'native-base';
import {AuthContext} from '../../../context/AuthContext';
import Button from '../../../components/buttons/CustomButton';

export default function index() {
  const [username, setUsername] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);
  const [email, setEmail] = React.useState<string>('');
  const {theme} = React.useContext(ThemeContext);
  const {user} = React.useContext(AuthContext);
  const navigation = useNavigation();
  {
    console.log('orrendo', user);
  }
  React.useEffect(() => {
    (async () => {
      if (user) {
        setUsername(user.displayName as string);
        setEmail(user.email as string);
      }
    })();
  }, []);

  const onSubmit = async () => {
    setLoading(true);
    if (user) {
      try {
        //await user.updateEmail(email);
        await user.updateProfile({
          displayName: username,
        });
        navigation.navigate('Settings');
      } catch (error) {}
    }
    setLoading(false);
  };
  return (
    <Container style={{backgroundColor: getColor(theme, 'primaryBackground')}}>
      <Content>
        <Form>
          <Item floatingLabel>
            <Label>Username</Label>
            <Input
              placeholder="Username"
              value={username}
              onChangeText={(text) => setUsername(text)}
              style={{color: getColor(theme, 'primaryText')}}
            />
          </Item>
          <Item floatingLabel last>
            <Label>Email</Label>
            <Input
              placeholder="Email"
              value={email}
              disabled={true}
              style={{color: getColor(theme, 'primaryText')}}
              onChangeText={(text) => setEmail(text)}
            />
          </Item>
        </Form>
        <View style={{alignSelf: 'center', marginTop: '10%'}}>
          <Button
            color={getColor(theme, 'lighterOrange')}
            title="Submit the form"
            loading={loading}
            onPress={onSubmit}
          />
        </View>
      </Content>
    </Container>
  );
}
