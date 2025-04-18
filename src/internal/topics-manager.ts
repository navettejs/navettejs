import { Topic } from './topic/topic.ts';
import { TopicConfig } from './topic/topic-config.ts';
import { JSONCompatible } from './json/json-compatible.ts';
import {
  TopicsStorage,
  WindowTopicsStorage,
} from './storage/topics-storage.ts';
import { createTopic } from './topic/topic-factory.ts';

export class TopicsManager {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly knownTopics = new Map<string, Topic<JSONCompatible<any>>>();

  constructor(
    private readonly storage: TopicsStorage = new WindowTopicsStorage(),
  ) {}

  topic<T extends JSONCompatible<T>>(config: TopicConfig): Topic<T> {
    let topic: Topic<T> | undefined = this.knownTopics.get(config.id);

    if (!topic) {
      let topicData = this.storage.getTopicData(config.id);
      if (!topicData) {
        topicData = {
          config,
          lastValue: undefined,
        };
        this.storage.setTopicData(topicData);
      }

      topic = createTopic<T>(topicData.config, this.storage);
      this.knownTopics.set(config.id, topic);
    }

    if (config.mode !== topic.config.mode) {
      console.warn(`Topic ${topic.config.id} does not have a matching mode!`);
    }

    return topic;
  }
}
