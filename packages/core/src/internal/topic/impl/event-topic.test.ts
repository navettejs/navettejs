import { EventTopic, EventTopicConfig } from './event-topic.ts';
import { TopicMode } from '../topic-config.ts';

type FakeData = {
  foo: string;
  bar: number;
};

describe('EventTopic', () => {
  test('should send values to one subscriber', () => {
    const topic = new EventTopic<FakeData>({
      id: 'test_id',
      mode: TopicMode.EVENT,
    });

    const onValue = jest.fn();

    topic.subscribe({
      on: onValue,
    });

    expect(onValue).toHaveBeenCalledTimes(0);

    topic.emit({
      foo: 'str',
      bar: 42,
    });

    expect(onValue).toHaveBeenCalledTimes(1);
    expect(onValue).toHaveBeenCalledWith({
      foo: 'str',
      bar: 42,
    });
  });

  test('should send values to multiple subscribers', () => {
    const topic = new EventTopic<FakeData>({
      id: 'test_id',
      mode: TopicMode.EVENT,
    });

    const onValue1 = jest.fn();
    const onValue2 = jest.fn();

    topic.subscribe({
      on: onValue1,
    });

    expect(onValue1).toHaveBeenCalledTimes(0);
    expect(onValue2).toHaveBeenCalledTimes(0);

    topic.emit({
      foo: 'str',
      bar: 42,
    });

    expect(onValue1).toHaveBeenCalledTimes(1);
    expect(onValue1).toHaveBeenCalledWith({
      foo: 'str',
      bar: 42,
    });
    expect(onValue2).toHaveBeenCalledTimes(0);

    topic.subscribe({
      on: onValue2,
    });

    expect(onValue1).toHaveBeenCalledTimes(1);
    expect(onValue2).toHaveBeenCalledTimes(0);

    topic.emit({
      foo: 'ing',
      bar: 13,
    });

    expect(onValue1).toHaveBeenCalledTimes(2);
    expect(onValue1).toHaveBeenLastCalledWith({
      foo: 'ing',
      bar: 13,
    });
    expect(onValue2).toHaveBeenCalledTimes(1);
    expect(onValue2).toHaveBeenLastCalledWith({
      foo: 'ing',
      bar: 13,
    });
  });

  test('should send values across multiple EventTopic instances with the same id', () => {
    // To simulate a multiple micro frontend scenario,
    // we need to create multiple EventTopic instances with the same id.
    // However, this test is not able to reproduce a cross versions scenario.

    const commonConfig = {
      id: 'test_id',
      mode: TopicMode.EVENT,
    } satisfies EventTopicConfig;

    const topicEmitter = new EventTopic<FakeData>(commonConfig);
    const topicReceiver = new EventTopic<FakeData>(commonConfig);

    const onValue = jest.fn();
    topicReceiver.subscribe({
      on: onValue,
    });
    expect(onValue).toHaveBeenCalledTimes(0);

    topicEmitter.emit({
      foo: 'str',
      bar: 42,
    });

    expect(onValue).toHaveBeenCalledTimes(1);
    expect(onValue).toHaveBeenCalledWith({
      foo: 'str',
      bar: 42,
    });
  });

  test('should not send values across multiple EventTopic instances with the different id', () => {
    const topicEmitter = new EventTopic<FakeData>({
      id: 'test_id',
      mode: TopicMode.EVENT,
    });
    const topicReceiver = new EventTopic<FakeData>({
      id: 'test_id_2',
      mode: TopicMode.EVENT,
    });

    const onValue = jest.fn();
    topicReceiver.subscribe({
      on: onValue,
    });
    expect(onValue).toHaveBeenCalledTimes(0);

    topicEmitter.emit({
      foo: 'str',
      bar: 42,
    });

    expect(onValue).toHaveBeenCalledTimes(0);
  });

  test('should stop receiving values when unsubscribed', () => {
    const topic = new EventTopic<FakeData>({
      id: 'test_id',
      mode: TopicMode.EVENT,
    });

    const onValue = jest.fn();
    const subscriber = {
      on: onValue,
    };

    topic.subscribe(subscriber);

    expect(onValue).toHaveBeenCalledTimes(0);

    topic.emit({
      foo: 'str',
      bar: 42,
    });

    expect(onValue).toHaveBeenCalledTimes(1);
    expect(onValue).toHaveBeenLastCalledWith({
      foo: 'str',
      bar: 42,
    });

    topic.unsubscribe(subscriber);
    topic.emit({
      foo: 'ing',
      bar: 13,
    });

    // No more calls.
    expect(onValue).toHaveBeenCalledTimes(1);
    expect(onValue).toHaveBeenLastCalledWith({
      foo: 'str',
      bar: 42,
    });
  });
});
