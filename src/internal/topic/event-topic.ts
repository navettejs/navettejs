import { Subscriber } from '../subscriber.ts';
import { TopicConfig } from './topic-config.ts';
import { Topic } from './topic.ts';
import {
  getEventName,
  isNavetteEvent,
  NavetteEvent,
} from '../event/navette-event.ts';
import { JSONCompatible } from '../json/json-compatible.ts';

export class EventTopic<T extends JSONCompatible<T>> implements Topic<T> {
  private listeners = new Map<
    Subscriber<T>,
    EventListenerOrEventListenerObject
  >();

  constructor(
    public readonly config: TopicConfig,
    private readonly _window = window,
  ) {}

  emit(value: T): void {
    this._window.dispatchEvent(
      new NavetteEvent(this.config.id, {
        type: 'value',
        value: JSON.stringify(value),
      }),
    );
  }

  end(): void {
    this._window.dispatchEvent(
      new NavetteEvent(this.config.id, {
        type: 'end',
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
          case 'end':
            subscriber.end();
            this.unsubscribe(subscriber);
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
}
