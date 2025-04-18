export enum TopicMode {
  EVENT = 'EVENT',
  REPLAY = 'REPLAY',
}

export type TopicConfig = {
  id: string;
  mode: TopicMode;
};
