import { JSONCompatible } from '../../json/json-compatible.ts';
import { Topic } from '../topic.ts';
import { Subscriber } from '../../subscriber.ts';
import {
  getEventName,
  isNavetteEvent,
  NavetteEvent,
} from '../../event/navette-event.ts';
import { BaseTopicConfig } from '../topic-config.ts';

export class BaseEventTopic<T extends JSONCompatible<T>> implements Topic<T> {
  protected listeners = new Map<
    Subscriber<T>,
    EventListenerOrEventListenerObject
  >();

  constructor(
    public readonly config: BaseTopicConfig,
    protected readonly _window: EventTarget = window,
  ) {}

  emit(value: T): void {
    this._window.dispatchEvent(
      new NavetteEvent(this.config.id, {
        type: 'value',
        value: JSON.stringify(value),
      }),
    );
  }

  subscribe(subscriber: Subscriber<T>): void {
    const listener: EventListenerOrEventListenerObject = (ev: Event): void => {
      if (isNavetteEvent(ev)) {
        switch (ev.detail.type) {
          case 'value':
            subscriber.on(JSON.parse(ev.detail.value));
            break;
        }
      } else {
        console.warn('Unsupported navette event!', ev);
      }
    };
    this.listeners.set(subscriber, listener);

    this._window.addEventListener(getEventName(this.config.id), listener);
  }

  unsubscribe(subscriber: Subscriber<T>): void {
    const listener = this.listeners.get(subscriber);
    if (listener) {
      this._window.removeEventListener(getEventName(this.config.id), listener);
      this.listeners.delete(subscriber);
    }
  }

  unsubscribeAll(): void {
    this.listeners.forEach((listener) => {
      this._window.removeEventListener(getEventName(this.config.id), listener);
    });
    this.listeners.clear();
  }
}
