const EVENT_NAME_PREFIX = 'navettejs';

export function getEventName(topicId: string): string {
  return `${EVENT_NAME_PREFIX}.${topicId}`;
}

export type NavetteEventData =
  | {
      type: 'value';
      value: string;
    }
  | {
      type: 'end';
    };

export class NavetteEvent extends CustomEvent<NavetteEventData> {
  constructor(topicId: string, data: NavetteEventData) {
    super(getEventName(topicId), {
      detail: data,
    });
  }
}

// eslint-disable @typescript-eslint/no-explicit-any
export function isNavetteEvent(event: Event): event is NavetteEvent {
  return (
    event.type.startsWith(EVENT_NAME_PREFIX) &&
    !!(event as unknown as { detail: unknown }).detail &&
    (((event as unknown as { detail: { type: unknown } }).detail.type ===
      'value' &&
      typeof (
        event as unknown as { detail: { type: unknown; value?: unknown } }
      ).detail.value === 'string') ||
      (event as unknown as { detail: { type: unknown } }).detail.type === 'end')
  );
}
// eslint-enable
