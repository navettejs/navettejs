import { TopicConfig } from './topic-config.ts';
import { Subscriber } from '../subscriber.ts';
import { JSONCompatible } from '../json/json-compatible.ts';

export interface Topic<T extends JSONCompatible<T>> {
  readonly config: TopicConfig;

  emit(value: T): void;

  subscribe(subscriber: Subscriber<T>): void;
  unsubscribe(subscriber: Subscriber<T>): void;
  unsubscribeAll(): void;
}
