import { isNavetteEvent, NavetteEvent } from './navette-event.ts';

describe('NavetteEvent', () => {
  test('should create an event with the data', () => {
    const event = new NavetteEvent('topicA', {
      type: 'value',
      value: '{"data": "value"}',
    });

    expect(event.type).toEqual('navettejs.topicA');
    expect(event.detail).toEqual({
      type: 'value',
      value: '{"data": "value"}',
    });
  });
});

describe('isNavetteEvent', () => {
  test('should return true if the event is a NavetteEvent with a value', () => {
    const event = new NavetteEvent('topicA', {
      type: 'value',
      value: '{"data": "value"}',
    });

    expect(isNavetteEvent(event)).toBe(true);
  });

  test('should return true if the event is a NavetteEvent with end signal', () => {
    const event = new NavetteEvent('topicA', {
      type: 'end',
    });

    expect(isNavetteEvent(event)).toBe(true);
  });

  test('should return false if the event is not a NavetteEvent because of an invalid event type', () => {
    const event = new CustomEvent('blabla', { detail: { type: 'end' } });

    expect(isNavetteEvent(event)).toBe(false);
  });

  test('should return false if the event is not a NavetteEvent because of an invalid detail', () => {
    const event = new CustomEvent('navettejs.topicA', {
      detail: { type: 'ennnd' },
    });

    expect(isNavetteEvent(event)).toBe(false);
  });
});
