import { JSONCompatible, ReplayTopic } from '@navettejs/core';
import { BaseRxjsTopic } from './base-rxjs-topic.ts';
import { ReplaySubject } from 'rxjs';

export class RxjsReplayTopic<
  T extends JSONCompatible<T>,
> extends BaseRxjsTopic<T> {
  constructor(topic: ReplayTopic<T>) {
    super(topic, new ReplaySubject<T>(1));
  }
}
