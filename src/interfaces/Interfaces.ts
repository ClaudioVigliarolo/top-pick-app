export interface Topic {
  id: number;
  ref_id: number;
  title: string;
  source: string;
  timestamp: string;
  lang: string;
}

export interface Category {
  id: number;
  ref_id: number;
  title: string;
  counter: number;
}

//counter: number;
export interface TopicCategory {
  topic_id: number;
  category_id: number;
  category_ref_id: number;
  topic_ref_id: number;
}

export interface Related {
  id: number;
  source_id: number;
  dest_id: number;
  source_ref_id: number;
  dest_ref_id: number;
  lang: string;
}

export interface Question {
  id: number;
  topic_id: number;
  title: string;
  liked?: boolean;
  isUserModified?: boolean;
  selected?: boolean;
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
  already_updated: boolean;
  last_update: string;
  updates: Updates;
}

export interface Updates {
  categories: Category[];
  topics: Topic[];
  topic_categories: TopicCategory[];
  related: [];
  questions: Question[];
}

export interface Report {
  client_id: number;
  question_id: number;
  reason: string;
}
