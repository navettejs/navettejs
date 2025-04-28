import {
  EventTopic,
  JSONCompatible,
  ReplayTopic,
  Topic,
} from '@navettejs/core';
import { RxjsTopic } from './topic/rxjs-topic.ts';
import { RxjsEventTopic } from './topic/impl/rxjs-event-topic.ts';
import { RxjsReplayTopic } from './topic/impl/rxjs-replay-topic.ts';

export function createTopic<T extends JSONCompatible<T>>(
  topic: Topic<T>,
): RxjsTopic<T> {
  if (topic instanceof EventTopic) {
    return new RxjsEventTopic(topic);
  } else if (topic instanceof ReplayTopic) {
    return new RxjsReplayTopic(topic);
  } else {
    throw new Error('Unsupported topic type!');
  }
}
