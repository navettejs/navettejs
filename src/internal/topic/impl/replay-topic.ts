import { JSONCompatible } from '../../json/json-compatible.ts';
import { BaseTopicConfig, TopicMode } from '../topic-config.ts';
import { Subscriber } from '../../subscriber.ts';
import { TopicsStorage } from '../../storage/topics-storage.ts';
import { BaseEventTopic } from './base-event-topic.ts';

export interface ReplayTopicConfig extends BaseTopicConfig {
  mode: TopicMode.REPLAY;
}

export class ReplayTopic<
  T extends JSONCompatible<T>,
> extends BaseEventTopic<T> {
  constructor(
    config: ReplayTopicConfig,
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
      config: this.config,
      lastValue: [value],
    });
  }
}
