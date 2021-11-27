import React from 'react';
import {CardTemplates} from '../constants/theme/Cardtheme';
import {FontDimension} from '../constants/theme/Fonts';
import {Theme} from '../constants/theme/Themes';

export interface Topic {
  id: number;
  ref_id?: number;
  title: string;
  source?: string;
  timestamp?: Date;
  lang?: string;
  type?: TopicType;
  level?: TopicLevel;
  user_modified?: number;
  description?: string;
  image?: string;
}

export interface Category {
  id: number;
  ref_id: number;
  title: string;
  counter: number;
  lang?: string;
  selected?: boolean;
}

//counter: number;
export interface TopicCategory {
  topic_id: number;
  category_id: number;
  category_ref_id: number;
  topic_ref_id: number;
  lang?: string;
}

export interface Related {
  id: number;
  source_id: number;
  dest_id: number;
  source_ref_id: number;
  dest_ref_id: number;
  lang?: string;
}

export interface Question {
  id: number;
  topic_id: number;
  title: string;
  liked?: number;
  selected?: boolean;
  n?: number;
  user_modified?: number;
  lang?: string;
  description?: string;
  link?: string;
}

export interface NavTab {
  id: number;
  title: string;
  onNav: () => void;
  selected: boolean;
  screen: React.ReactNode;
}

export interface Language {
  label: string;
  value: Lang;
}

export enum Lang {
  italian = 'it',
  english = 'en',
  spanish = 'es',
  french = 'fr',
}

export interface JSONresponse {
  is_error: boolean;
  last_update: string;
  updates: TopicUpdates;
}

export interface TopicUpdates {
  categories: Category[];
  topics: Topic[];
  topic_categories: TopicCategory[];
  related: [];
  questions: Question[];
}

export interface UserSyncedData {
  topics: Topic[];
  questions: Question[];
  last_sync: string;
}

export interface Report {
  client_id: string;
  question_id: number;
  reason: string;
}

export interface FontsizeOption {
  title: string;
  value: FontDimension;
}

export interface TabButton {
  children: React.ReactNode;
  heading: string;
  id: number;
  visible?: boolean;
}

export interface TopicSection {
  title: string;
  data: Topic[];
}

export interface SettingSection {
  title: string;
  data: Setting[];
}

export interface Setting {
  type: SettingType;
  title: string;
  onPress: any;
  id: number;
  selected?: boolean;
}
export enum SettingType {
  BASIC,
  CHECKBOX,
}

export enum TopicLevel {
  EASY,
  MEDIUM,
  HARD,
  IGNORE,
}

export enum TopicType {
  TOPIC,
  DIALOG,
}

export enum HelpScreen {
  NO_SCREEN,
  QUESTIONS_SCREEN,
  ORDER_SCREEN,
  FAVOURITES_SCREEN,
}

export interface User {
  username: string;
}

export interface UserSettings {
  cardTheme: keyof CardTemplates;
  fontSize: FontDimension;
  appLanguage: Lang;
  contentLanguage: Lang;
  darkMode: Theme;
  isAutoUpdate: boolean;
}

export interface UserData {
  settings: UserSettings;
  interests?: UserInterests;
  DBAuthKey: number;
}

export interface UserInterests {
  categories_ref_id: number[];
  level: TopicLevel;
  goals: UserGoal[];
}

export interface Option {
  title: string;
  id: number;
  selected: boolean;
  next: FormName;
}

export interface FormBasic {
  title: string;
  subTitle: string;
  options: Option[];
  name: FormName;
}

export interface FormCategories {
  title: string;
  subTitle: string;
  categories: Option[];
  name: FormName;
}

export enum FormName {
  FORM_GOALS,
  FORM_LEVELS,
  FORM_INTERESTS,
}

export enum FormType {
  FORM_BASIC,
  FORM_CATEGORIES,
}

export enum UserGoal {
  LANGUAGE,
  FRIENDS,
  ESSAYS,
  OTHER,
}
