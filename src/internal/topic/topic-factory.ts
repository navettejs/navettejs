import { Topic } from './topic.ts';
import { TopicConfig, TopicMode } from './topic-config.ts';
import { EventTopic } from './event-topic.ts';
import { JSONCompatible } from '../json/json-compatible.ts';
import { ReplayTopic } from './replay-topic.ts';
import { TopicsStorage } from '../storage/topics-storage.ts';

export function createTopic<T extends JSONCompatible<T>>(
  config: TopicConfig,
  storage: TopicsStorage,
): Topic<T> {
  switch (config.mode) {
    case TopicMode.EVENT:
      return new EventTopic<T>(config);
    case TopicMode.REPLAY:
      return new ReplayTopic<T>(config, storage);
  }
}
