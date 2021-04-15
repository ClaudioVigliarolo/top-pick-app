export interface Topic {
  title: string;
  id: number;
  source: string;
  timestamp: string;
  lang: string;
}

export interface Category {
  id: number;
  title: string;
  counter: number;
}

//counter: number;
export interface CategoryTopic {
  category_id: number;
  topic_id: number;
}

export interface Related {
  id: number;
  source_id: number;
  dest_id: number;
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

export enum Lang {
  italian = 'it',
  english = 'en',
}

export interface JSONresponse {
  is_error: boolean;
  already_updated: boolean;
  last_update: string;
  categories: Category[];
  topics: Topic[];
  category_topics: CategoryTopic[];
  related: [];
  questions: Question[];
}

export interface Report {
  client_id: number;
  question_id: number;
  reason: string;
}
