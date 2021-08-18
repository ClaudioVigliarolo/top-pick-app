import * as React from 'react';
import {View, TouchableOpacity, Platform} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import IconBack from 'react-native-vector-icons/MaterialIcons';
import IconMenu from 'react-native-vector-icons/MaterialIcons';
import IconOptions from 'react-native-vector-icons/MaterialCommunityIcons';
import HomePage from '../screens/home/HomePage';
import Library from '../screens/library/LibraryPage';
import {ThemeContext} from '../context/ThemeContext';
import QuestionsPage from '../screens/detail/QuestionsPage';
import OrderPage from '../screens/detail/OrderPage';
import {LocalizationContext} from '../context/LocalizationContext';
import FavouritesPage from '../screens/user/FavouritesPage';
import SearchPage from '../screens/home/SearchPage';
import PresentationPage from '../screens/detail/PresentationPage';
import {getColor} from '../constants/theme/Themes';
import Dimensions from '../constants/theme/Dimensions';
import SettingsPage from '../screens/settings/SettingsPage';
import {StatusContext} from '../context/StatusContext';
import SelectLanguagePage from '../screens/settings/SettingsLanguagePage';
import SelectFontsize from '../screens/settings/SettingsFontsizePage';
import ThemePage from '../screens/settings/SettingsCardthemePage';
import translations from '../context/translations';
import StatusModal from '../components/modals/StatusModal';
import {staticFontSizes} from '../constants/theme/Fonts';
import LibraryDetail from '../screens/library/LibraryTopic';
import CustomDropDown from '../components/modals/CustomDropDown';
import StatusBar from '../components/bars/StatusBar';

const Stack = createStackNavigator();

const NavigationDrawerStructure = (props: any) => {
  const {theme} = React.useContext(ThemeContext);

  //Structure for the navigatin Drawer
  const toggleDrawer = () => {
    //Props to open/close the drawer
    props.navigationProps.toggleDrawer();
  };
  return (
    <View style={{flexDirection: 'row'}}>
      <TouchableOpacity onPress={() => toggleDrawer()}>
        <IconMenu
          name="menu"
          color={getColor(theme, 'headerPrimary')}
          size={Dimensions.iconMed}
          style={{
            width: 25,
            height: 25,
            marginLeft: 5,
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

interface BackStructureProps {
  navigation: any;
  destination: string | null;
}

const BackStructure = (props: BackStructureProps) => {
  const {theme} = React.useContext(ThemeContext);
  return (
    <View style={{flexDirection: 'row'}}>
      <TouchableOpacity
        onPress={() => {
          props.destination
            ? props.navigation.navigate(props.destination)
            : props.navigation.goBack();
        }}>
        {/*Donute Button Image */}
        <IconBack
          name="arrow-back"
          color={getColor(theme, 'secondaryIcon')}
          size={30}
          style={{
            marginLeft: 8,
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

const OptionsStructure = () => {
  const {theme} = React.useContext(ThemeContext);
  const [open, setOpen] = React.useState<boolean>(false);
  return (
    <>
      <IconOptions
        onPress={() => {
          setOpen(true);
        }}
        name="dots-vertical"
        color={getColor(theme, 'secondaryIcon')}
        size={28}
        style={{marginRight: 5}}
      />
      {open && (
        <CustomDropDown
          open={open}
          onClose={() => {
            setOpen(false);
          }}
        />
      )}
    </>
  );
};

const LibraryStack = ({route, navigation}: {route: any; navigation: any}) => {
  const {theme} = React.useContext(ThemeContext);
  const {translations} = React.useContext(LocalizationContext);

  return (
    <Stack.Navigator initialRouteName="LibraryScreen">
      <Stack.Screen
        name="LibraryScreen"
        component={Library}
        options={{
          title: translations.LIBRARY,
          headerTintColor: getColor(theme, 'headerPrimary'),
          headerLeft: () => (
            <BackStructure destination={null} navigation={navigation} />
          ),
          headerRight: () => <OptionsStructure />,

          headerStyle: {
            backgroundColor: getColor(theme, 'primaryHeaderBackground'),
          },

          headerTitleStyle: {
            fontWeight: 'bold',
            fontFamily: 'arial',
            textTransform: 'capitalize',
          },
        }}
      />

      <Stack.Screen
        name="Topics"
        component={LibraryDetail}
        options={{
          title: 'Topics',
          headerTintColor: getColor(theme, 'headerPrimary'),

          headerStyle: {
            backgroundColor: getColor(theme, 'primaryHeaderBackground'),
          },
          headerLeft: () => (
            <BackStructure
              destination="LibraryScreen"
              navigation={navigation}
            />
          ),
          headerTitleStyle: {
            fontWeight: 'bold',
            fontFamily: 'arial',
            textTransform: 'capitalize',
          },
        }}
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="Questions"
        component={QuestionsStack}
      />
    </Stack.Navigator>
  );
};

const FavouritesStack = ({navigation}: {navigation: any}) => {
  const {theme} = React.useContext(ThemeContext);
  const {translations} = React.useContext(LocalizationContext);

  return (
    <Stack.Navigator
      initialRouteName="Favourites"
      screenOptions={{
        headerStyle: {elevation: 0},
        cardStyle: {backgroundColor: getColor(theme, 'primaryBackground')},
      }}>
      <Stack.Screen
        name="Favourites"
        component={FavouritesPage}
        options={{
          title: translations.FAVOURITES,
          headerTintColor: getColor(theme, 'headerPrimary'),

          headerLeft: () => (
            <BackStructure destination={null} navigation={navigation} />
          ),
          headerRight: () => <OptionsStructure />,
          headerStyle: {
            backgroundColor: getColor(theme, 'primaryHeaderBackground'),
          },

          headerTitleStyle: {
            fontWeight: 'bold',
            fontFamily: 'arial',
            textTransform: 'capitalize',
          },
        }}
      />
    </Stack.Navigator>
  );
};

const SettingsStack = ({navigation}: {navigation: any}) => {
  const {theme} = React.useContext(ThemeContext);
  const {translations} = React.useContext(LocalizationContext);

  return (
    <Stack.Navigator
      initialRouteName="Settings"
      screenOptions={{
        headerStyle: {elevation: 0},
        cardStyle: {backgroundColor: getColor(theme, 'primaryBackground')},
      }}>
      <Stack.Screen
        name="Settings"
        component={SettingsPage}
        options={{
          title: translations.SETTINGS,
          headerTintColor: getColor(theme, 'headerPrimary'),

          headerLeft: () => (
            <BackStructure destination={null} navigation={navigation} />
          ),
          headerStyle: {
            backgroundColor: getColor(theme, 'primaryHeaderBackground'),
          },

          headerTitleStyle: {
            fontWeight: 'bold',
            fontFamily: 'arial',
            textTransform: 'capitalize',
          },
        }}
      />

      <Stack.Screen
        name="Language"
        component={SelectLanguagePage}
        options={{
          title: translations.LANGUAGE,
          headerTintColor: getColor(theme, 'headerPrimary'),

          headerStyle: {
            backgroundColor: getColor(theme, 'primaryHeaderBackground'),
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            fontFamily: 'arial',
            textTransform: 'capitalize',
          },
          headerLeft: () => (
            <BackStructure destination="Settings" navigation={navigation} />
          ),
        }}
      />

      <Stack.Screen
        name="Theme"
        component={ThemePage}
        options={{
          title: translations.CARD_THEME,
          headerTintColor: getColor(theme, 'headerPrimary'),

          headerStyle: {
            backgroundColor: getColor(theme, 'primaryHeaderBackground'),
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            fontFamily: 'arial',
            textTransform: 'capitalize',
          },
          headerLeft: () => (
            <BackStructure destination="Settings" navigation={navigation} />
          ),
        }}
      />

      <Stack.Screen
        name="Fontsize"
        component={SelectFontsize}
        options={{
          title: translations.FONTSIZE,
          headerTintColor: getColor(theme, 'headerPrimary'),

          headerStyle: {
            backgroundColor: getColor(theme, 'primaryHeaderBackground'),
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            fontFamily: 'arial',
            textTransform: 'capitalize',
          },
          headerLeft: () => (
            <BackStructure destination="Settings" navigation={navigation} />
          ),
        }}
      />
    </Stack.Navigator>
  );
};

const getAppTitle = (
  isCheckingContentUpdates: boolean,
  isLoadingContentUpdates: boolean,
): string => {
  if (isCheckingContentUpdates) {
    return translations.CHECK_UPDATES;
  }
  if (isLoadingContentUpdates) {
    return translations.UPDATING_TOPICS;
  } else {
    return translations.TOP_PICK;
  }
};

const HomeStack = ({navigation}: {navigation: any}) => {
  const {theme} = React.useContext(ThemeContext);
  const {isCheckingContentUpdates, isLoadingContentUpdates} = React.useContext(
    StatusContext,
  );
  const [isUpdatedAlert, setUpdatedAlert] = React.useState<boolean>(false);
  const {translations} = React.useContext(LocalizationContext);
  return (
    <Stack.Navigator initialRouteName="HomeScreen">
      <Stack.Screen
        name="HomeScreen"
        component={HomePage}
        options={{
          headerTitleAlign: 'center',
          title: getAppTitle(isCheckingContentUpdates, isLoadingContentUpdates),
          headerTintColor: getColor(theme, 'headerPrimary'),
          headerRight: () => (
            <View>
              <StatusBar />
            </View>
          ),
          headerLeft: () => (
            <NavigationDrawerStructure navigationProps={navigation} />
          ),
          headerStyle: {
            backgroundColor: getColor(theme, 'primaryHeaderBackground'),
          },

          headerTitleStyle: {
            fontSize: staticFontSizes.fontMed,
            fontWeight: Platform.OS == 'ios' ? '500' : '100',
          },
        }}
      />

      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="Questions"
        component={QuestionsStack}
      />
    </Stack.Navigator>
  );
};

const SearchStack = () => {
  const {translations} = React.useContext(LocalizationContext);
  return (
    <Stack.Navigator initialRouteName="SearchScreen">
      <Stack.Screen
        name="SearchScreen"
        component={SearchPage}
        options={{
          headerTitleAlign: 'center',
          title: translations.SEARCH,
          headerShown: false,
        }}
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="Questions"
        component={QuestionsStack}
      />
    </Stack.Navigator>
  );
};

const QuestionsStack = ({navigation}: {navigation: any}) => {
  const {theme} = React.useContext(ThemeContext);
  const {translations} = React.useContext(LocalizationContext);

  return (
    <Stack.Navigator initialRouteName="QuestionsScreen">
      <Stack.Screen
        name="QuestionsScreen"
        component={QuestionsPage}
        options={{
          title: translations.QUESTIONS,
          headerTintColor: getColor(theme, 'headerPrimary'),
          headerLeft: () => (
            <BackStructure navigation={navigation} destination={null} />
          ),
          headerRight: () => <OptionsStructure />,

          headerStyle: {
            backgroundColor: getColor(theme, 'primaryHeaderBackground'),
          },

          headerTitleStyle: {
            fontWeight: 'bold',
            fontFamily: 'arial',
            textTransform: 'capitalize',
          },
        }}
      />

      <Stack.Screen
        name="Order"
        component={OrderPage}
        options={{
          title: translations.ARRANGE_QUESTIONS,
          headerTintColor: getColor(theme, 'headerPrimary'),
          headerLeft: () => (
            <BackStructure
              destination="QuestionsScreen"
              navigation={navigation}
            />
          ),
          headerRight: () => <OptionsStructure />,
          headerStyle: {
            backgroundColor: getColor(theme, 'primaryHeaderBackground'),
          },

          headerTitleStyle: {
            fontWeight: 'bold',
            fontFamily: 'arial',
            textTransform: 'capitalize',
          },
        }}
      />

      <Stack.Screen
        name="Presentation"
        component={PresentationPage}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export {
  HomeStack,
  LibraryStack,
  FavouritesStack,
  SearchStack,
  QuestionsStack,
  SettingsStack,
};
