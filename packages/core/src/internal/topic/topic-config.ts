import { EventTopicConfig } from './impl/event-topic.ts';
import { ReplayTopicConfig } from './impl/replay-topic.ts';

export enum TopicMode {
  EVENT = 'EVENT',
  REPLAY = 'REPLAY',
}

export interface BaseTopicConfig {
  id: string;
  mode: TopicMode;
}

export type TopicConfig = EventTopicConfig | ReplayTopicConfig;
