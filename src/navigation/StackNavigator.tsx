import * as React from 'react';
import {View, TouchableOpacity, Platform} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import IconBack from 'react-native-vector-icons/MaterialIcons';
import IconMenu from 'react-native-vector-icons/MaterialIcons';
import IconOptions from 'react-native-vector-icons/MaterialCommunityIcons';
import HomePage from '../screens/home/HomePage';
import LevelsPage from '../screens/library/Levels/Index';
import {ThemeContext} from '../context/ThemeContext';
import QuestionsPage from '../screens/detail/QuestionsPage/Index';
import OrderPage from '../screens/detail/OrderPage/Index';
import {LocalizationContext} from '../context/LocalizationContext';
import FavouritesPage from '../screens/user/FavouritesPage/Index';
import SearchPage from '../screens/home/SearchPage';
import PresentationPage from '../screens/detail/PresentationPage';
import {getColor} from '../constants/theme/Themes';
import {ICON_MED} from '../constants/theme/Dimensions';
import SettingsPage from '../screens/settings/SettingsPage';
import {StatusContext} from '../context/StatusContext';
import SelectLanguagePage from '../screens/settings/SettingsLanguagePage';
import SelectFontsize from '../screens/settings/SettingsFontsizePage';
import ThemePage from '../screens/settings/SettingsCardthemePage';
import translations from '../context/translations';
import {staticFontSizes} from '../constants/theme/Fonts';
import AllTopicsPage from '../screens/library/Topics/AllTopicsPage';
import AllCategoriesPage from '../screens/library/Categories/AllCategoriesPage';
import CustomDropDown from '../components/modals/CustomDropDown';
import StatusBar from '../components/bars/StatusBar';
import {HelpScreen} from '../interfaces/Interfaces';
import LoginPage from '../screens/auth/LoginPage';
import RegisterPage from '../screens/auth/RegisterPage';
import SettingsResetPage from '../screens/settings/SettingsResetPage';
import InterestsPage from '../screens/user/InterestsPage/index';
import DetailsPage from '../screens/user/DetailsPage/index';
import NewLibraryPage from '../screens/library/Library/NewLibraryPage';
import NewTopicsPage from '../screens/library/Topics/NewTopicsPage';
import TopicsPage from '../screens/library/Topics/TopicsPage';

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
          size={ICON_MED}
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

const OptionsStructure = ({screen}: {screen: HelpScreen}) => {
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
          screen={screen}
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
        component={NewLibraryPage}
        options={{
          title: translations.LIBRARY,
          headerTintColor: getColor(theme, 'headerPrimary'),
          headerLeft: () => (
            <BackStructure destination={null} navigation={navigation} />
          ),
          headerRight: () => null,

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
        name="NewTopics"
        component={NewTopicsPage}
        options={{
          title: 'New Topics',
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
        name="Levels"
        component={LevelsPage}
        options={{
          title: 'Levels',
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
        name="AllTopics"
        component={AllTopicsPage}
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
        name="Topics"
        component={TopicsPage}
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
        name="Categories"
        component={AllCategoriesPage}
        options={{
          title: 'Categories',
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
          headerRight: () => (
            <OptionsStructure screen={HelpScreen.FAVOURITES_SCREEN} />
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
        name="Interests"
        component={InterestsPage}
        options={{
          title: 'interessi',
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
        name="Details"
        component={DetailsPage}
        options={{
          title: 'Details',
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

      <Stack.Screen
        name="Reset"
        component={SettingsResetPage}
        options={{
          title: 'Reset',
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

      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="Login"
        component={AuthStack}
      />
    </Stack.Navigator>
  );
};

const SearchStack = () => {
  const {translations} = React.useContext(LocalizationContext);
  return (
    <Stack.Navigator initialRouteName="Search">
      <Stack.Screen
        name="Search"
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

const AuthStack = () => {
  const {translations} = React.useContext(LocalizationContext);
  return (
    <Stack.Navigator initialRouteName="LoginScreen">
      <Stack.Screen
        name="LoginScreen"
        component={LoginPage}
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
        name="RegisterScreen"
        component={RegisterPage}
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
          headerRight: () => (
            <OptionsStructure screen={HelpScreen.QUESTIONS_SCREEN} />
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
          headerRight: () => (
            <OptionsStructure screen={HelpScreen.ORDER_SCREEN} />
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
  AuthStack,
};
