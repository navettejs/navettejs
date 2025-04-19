import { TopicMode } from '../topic-config.ts';
import { ReplayTopic, ReplayTopicConfig } from './replay-topic.ts';
import { WindowTopicsStorage } from '../../storage/topics-storage.ts';

type FakeData = {
  foo: string;
  bar: number;
};

describe('ReplayTopic', () => {
  afterEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).navettejs = undefined; // Clean the storage in the global object.
  });

  test('should send values to one subscriber', () => {
    const topic = new ReplayTopic<FakeData>(
      {
        id: 'test_id',
        mode: TopicMode.REPLAY,
      },
      new WindowTopicsStorage(),
    );

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

  test('should send values to multiple subscribers, with the last value sent again upon subscription', () => {
    const topic = new ReplayTopic<FakeData>(
      {
        id: 'test_id',
        mode: TopicMode.REPLAY,
      },
      new WindowTopicsStorage(),
    );

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
    expect(onValue1).toHaveBeenLastCalledWith({
      foo: 'str',
      bar: 42,
    });
    expect(onValue2).toHaveBeenCalledTimes(0);

    topic.emit({
      foo: 'STR',
      bar: 4242,
    });

    expect(onValue1).toHaveBeenCalledTimes(2);
    expect(onValue1).toHaveBeenLastCalledWith({
      foo: 'STR',
      bar: 4242,
    });
    expect(onValue2).toHaveBeenCalledTimes(0);

    topic.subscribe({
      on: onValue2,
    });

    expect(onValue1).toHaveBeenCalledTimes(2);

    // The second subscriber is notified of the last value upon subscription.
    expect(onValue2).toHaveBeenCalledTimes(1);
    expect(onValue2).toHaveBeenLastCalledWith({
      foo: 'STR',
      bar: 4242,
    });

    topic.emit({
      foo: 'ing',
      bar: 13,
    });

    expect(onValue1).toHaveBeenCalledTimes(3);
    expect(onValue1).toHaveBeenLastCalledWith({
      foo: 'ing',
      bar: 13,
    });
    expect(onValue2).toHaveBeenCalledTimes(2);
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
      mode: TopicMode.REPLAY,
    } satisfies ReplayTopicConfig;

    const topicEmitter = new ReplayTopic<FakeData>(
      commonConfig,
      new WindowTopicsStorage(),
    );
    topicEmitter.emit({
      foo: 'ing',
      bar: 13,
    });

    const topicReceiver = new ReplayTopic<FakeData>(
      commonConfig,
      new WindowTopicsStorage(),
    );

    const onValue = jest.fn();
    topicReceiver.subscribe({
      on: onValue,
    });
    expect(onValue).toHaveBeenCalledTimes(1);
    expect(onValue).toHaveBeenLastCalledWith({
      foo: 'ing',
      bar: 13,
    });

    topicEmitter.emit({
      foo: 'str',
      bar: 42,
    });

    expect(onValue).toHaveBeenCalledTimes(2);
    expect(onValue).toHaveBeenLastCalledWith({
      foo: 'str',
      bar: 42,
    });
  });

  test('should not send values across multiple EventTopic instances with the different id', () => {
    const topicEmitter = new ReplayTopic<FakeData>(
      {
        id: 'test_id',
        mode: TopicMode.REPLAY,
      },
      new WindowTopicsStorage(),
    );
    const topicReceiver = new ReplayTopic<FakeData>(
      {
        id: 'test_id_2',
        mode: TopicMode.REPLAY,
      },
      new WindowTopicsStorage(),
    );

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
    const topic = new ReplayTopic<FakeData>(
      {
        id: 'test_id',
        mode: TopicMode.REPLAY,
      },
      new WindowTopicsStorage(),
    );

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
