import { JSONCompatible } from '@navettejs/core';
import { Observable } from 'rxjs';

export interface RxjsTopic<T extends JSONCompatible<T>> {
  readonly value$: Observable<T>;

  emit(value: T): void;
  unsubscribeAll(): void;
}
