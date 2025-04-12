export enum TopicMode {
  EVENT = 'EVENT',
  STATE = 'STATE',
}

export interface Topic {
  id: string;
  mode: TopicMode;
}
