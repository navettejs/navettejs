import { JSONCompatible, Topic } from '@navettejs/core';
import { Observable, Subject } from 'rxjs';
import { RxjsTopic } from '../rxjs-topic.ts';

export class BaseRxjsTopic<T extends JSONCompatible<T>>
  implements RxjsTopic<T>
{
  value$: Observable<T>;

  constructor(
    public readonly topic: Topic<T>,
    private readonly valueSubject: Subject<T>,
  ) {
    this.value$ = valueSubject.asObservable();

    this.topic.subscribe({
      on: (value) => {
        valueSubject.next(value);
      },
    });
  }

  emit(value: T): void {
    this.topic.emit(value);
  }

  unsubscribeAll(): void {
    // It will unsubscribe the only subscriber pushing values to rxjs Subject
    this.topic.unsubscribeAll();

    // End the subscriptions.
    this.valueSubject.complete();
  }
}
