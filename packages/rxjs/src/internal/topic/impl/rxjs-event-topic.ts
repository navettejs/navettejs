import { JSONCompatible } from '@navettejs/core';
import { BaseRxjsTopic } from './base-rxjs-topic.ts';
import { EventTopic } from '@navettejs/core';
import { Subject } from 'rxjs';

export class RxjsEventTopic<
  T extends JSONCompatible<T>,
> extends BaseRxjsTopic<T> {
  constructor(topic: EventTopic<T>) {
    super(topic, new Subject<T>());
  }
}
