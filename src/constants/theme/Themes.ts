export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
}

interface Colors {
  type: string;
  white: string;
  primaryOrange: string;
  lightGrey: string;
  secondaryIcon: string;
  searchIconColor: string;
  primaryText: string;
  drawerGrey: string;
  darkerOrange: string;
  darkOrange: string;
  lightOrange: string;
  lighterOrange: string;
  sectionHeader: string;
  lighterGray: string;
  lightGray: string;
  checkOrange: string;
  primaryBackground: string;
  headerPrimary: string;
  primaryHeaderBackground: string;
  barColor: string;
  barTextColor: string;
  barExternalColor: string;
  ButtonQuestionsBackground: string;
  lineColor: string;
  questionsTabBackground: string;
}

const light: Colors = {
  type: 'light',
  white: '#fff',
  primaryOrange: '#FF851B',
  lightGrey: '#C0C0C0',
  secondaryIcon: 'white',
  searchIconColor: 'black',
  primaryText: 'black',
  drawerGrey: '#787878',
  darkerOrange: '#f4511e',
  darkOrange: '#f45e1e',
  lightOrange: 'orange',
  lighterOrange: '#fcbe03',
  sectionHeader: 'orange',
  lighterGray: '#e0e0e0',
  lightGray: '#c4c4c4',
  checkOrange: '#ffc757',
  primaryBackground: '#fff',
  headerPrimary: '#fff',
  primaryHeaderBackground: '#FF851B',
  barColor: '#fff',
  barTextColor: 'black',
  barExternalColor: '#FF851B',
  ButtonQuestionsBackground: '#eee',
  lineColor: 'rgba(196, 196, 196,0.4)',
  questionsTabBackground: '#FF851B',
};

const dark: Colors = {
  type: 'dark',
  white: '#fff',
  lightGrey: '#C0C0C0',
  drawerGrey: '#787878',
  primaryOrange: '#f4691e',
  searchIconColor: '#f4511e',
  secondaryIcon: '#f4511e',
  sectionHeader: 'orange',
  primaryText: '#eee',
  darkerOrange: '#f4511e',
  lightOrange: 'orange',
  lighterOrange: 'lighterOrange',
  darkOrange: '#f45e1e',
  lighterGray: '#e0e0e0',
  lightGray: '#c4c4c4',
  checkOrange: '#ffc757',
  primaryBackground: 'black',
  headerPrimary: '#f4511e',
  primaryHeaderBackground: '#141414',
  barExternalColor: 'black',
  barColor: '#141414', //#1F1F1F
  barTextColor: '#eee',
  ButtonQuestionsBackground: '#141414',
  lineColor: 'rgba(196, 196, 196,0.4)',
  questionsTabBackground: 'black',
};

export const getColor = <K extends keyof Colors>(
  theme: Theme,
  key: K,
): string => {
  switch (theme) {
    case Theme.DARK:
      return dark[key];

    case Theme.LIGHT:
      return light[key];

    default:
      return light[key];
  }
};
