export enum TopicMode {
  EVENT = 'EVENT',
  STATE = 'STATE',
}

export interface TopicConfig {
  id: string;
  mode: TopicMode;
}
