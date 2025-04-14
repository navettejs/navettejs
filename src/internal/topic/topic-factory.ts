import { TopicStorageData } from '../storage/topics-storage.ts';
import { Topic } from './topic.ts';
import { TopicMode } from './topic-config.ts';
import { EventTopic } from './event-topic.ts';
import { JSONCompatible } from '../json/json-compatible.ts';

export function createTopic<T extends JSONCompatible<T>>(
  data: TopicStorageData,
): Topic<T> {
  switch (data.mode) {
    case TopicMode.EVENT:
      return new EventTopic<T>(data);
    case TopicMode.STATE:
      throw Error('Not implemented');
  }
}
