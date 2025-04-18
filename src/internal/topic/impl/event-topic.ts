import { BaseTopicConfig, TopicMode } from '../topic-config.ts';
import { JSONCompatible } from '../../json/json-compatible.ts';
import { BaseEventTopic } from './base-event-topic.ts';

export interface EventTopicConfig extends BaseTopicConfig {
  mode: TopicMode.EVENT;
}

export class EventTopic<T extends JSONCompatible<T>> extends BaseEventTopic<T> {
  constructor(config: EventTopicConfig, _window = window) {
    super(config, _window);
  }
}
