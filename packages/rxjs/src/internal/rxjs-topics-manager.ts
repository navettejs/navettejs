import { JSONCompatible, TopicConfig, TopicsManager } from '@navettejs/core';
import { RxjsTopic } from './topic/rxjs-topic.ts';
import { createTopic } from './rxjs-topic-factory.ts';

export class RxjsTopicsManager {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly knownRxjsTopics = new Map<string, any>();

  constructor(private readonly topicManager = new TopicsManager()) {}

  topic<T extends JSONCompatible<T>>(config: TopicConfig): RxjsTopic<T> {
    // In this implementation of @navettejs with rxjs, one subscription is made
    // to the topic and the subject handles the multicast, with the appropriate
    // subject depending on the topic mode.
    const knownRxjsTopic = this.knownRxjsTopics.get(config.id);
    if (knownRxjsTopic) {
      return knownRxjsTopic as RxjsTopic<T>;
    }

    const rxjsTopic = createTopic<T>(this.topicManager.topic(config));
    this.knownRxjsTopics.set(config.id, rxjsTopic);
    return rxjsTopic;
  }

  destroy(): void {
    this.knownRxjsTopics.forEach((topic) => {
      topic.unsubscribeAll();
    });
    this.knownRxjsTopics.clear();
    this.topicManager.destroy();
  }
}
