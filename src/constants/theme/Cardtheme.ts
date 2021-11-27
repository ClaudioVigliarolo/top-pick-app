import {Theme} from './Themes';

export interface CardTemplates {
  default: string;
  orange: string;
  red: string;
  blue: string;
  green: string;
  violet: string;
}

export const getCardTemplate = <K extends keyof CardTemplates>(
  theme: Theme,
  key: K,
): string => {
  switch (theme) {
    case Theme.LIGHT:
      return cardTemplatesLight[key];

    case Theme.DARK:
      return cardTemplatesDark[key];

    default:
      return cardTemplatesLight[key];
  }
};

const cardTemplatesLight: CardTemplates = {
  default: '#ff7400',
  orange: 'orange',
  red: '#ff0000',
  blue: '#40a8c4',
  green: '#00af91',
  violet: '#7868e6',
};

const cardTemplatesDark: CardTemplates = {
  default: '#ff7400',
  orange: 'orange',
  red: '#ff0000',
  blue: '#40a8c4',
  green: '#00af91',
  violet: '#7868e6',
};
