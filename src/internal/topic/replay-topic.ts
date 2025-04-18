import { EventTopic } from './event-topic.ts';
import { JSONCompatible } from '../json/json-compatible.ts';
import { TopicConfig } from './topic-config.ts';
import { Subscriber } from '../subscriber.ts';
import { TopicsStorage } from '../storage/topics-storage.ts';

export class ReplayTopic<T extends JSONCompatible<T>> extends EventTopic<T> {
  constructor(
    config: TopicConfig,
    private readonly storage: TopicsStorage,
    readonly _window = window,
  ) {
    super(config, _window);
  }

  subscribe(subscriber: Subscriber<T>) {
    // Send the last value if one was available.
    const lastValue = this.getLastValue();
    if (lastValue) {
      subscriber.on(lastValue[0]);
    }

    // Classic subscription then.
    super.subscribe(subscriber);
  }

  emit(value: T) {
    // Save the value in the storage.
    this.updateLastValue(value);

    // Classic value emission.
    super.emit(value);
  }

  private getLastValue(): [T] | undefined {
    return this.storage.getTopicData(this.config.id)?.lastValue as
      | [T]
      | undefined;
  }

  private updateLastValue(value: T) {
    this.storage.setTopicData({
      ...this.config,
      lastValue: [value],
    });
  }
}
