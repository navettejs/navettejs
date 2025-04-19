const EVENT_NAME_PREFIX = 'navettejs';

export function getEventName(topicId: string): string {
  return `${EVENT_NAME_PREFIX}.${topicId}`;
}

export type NavetteEventData = {
  type: 'value';
  value: string;
};

export class NavetteEvent extends CustomEvent<NavetteEventData> {
  constructor(topicId: string, data: NavetteEventData) {
    super(getEventName(topicId), {
      detail: data,
    });
  }
}

export function isNavetteEvent(event: Event): event is NavetteEvent {
  if (
    event.type.startsWith(EVENT_NAME_PREFIX) &&
    'detail' in event &&
    !!event.detail &&
    typeof event.detail === 'object' &&
    'type' in event.detail
  ) {
    switch (event.detail.type) {
      case 'value':
        return (
          'value' in event.detail && typeof event.detail.value === 'string'
        );
      default:
        return false;
    }
  } else {
    return false;
  }
}
