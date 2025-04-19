import { createTopic } from './topic-factory.ts';
import { TopicMode } from './topic-config.ts';
import { WindowTopicsStorage } from '../storage/topics-storage.ts';
import { EventTopic } from './impl/event-topic.ts';
import { ReplayTopic } from './impl/replay-topic.ts';

describe('createTopic', () => {
  test('should create an event topic if an event topic config is provided', () => {
    const topic = createTopic(
      {
        id: 'test_id',
        mode: TopicMode.EVENT,
      },
      new WindowTopicsStorage(),
    );

    expect(topic).toBeInstanceOf(EventTopic);
  });

  test('should create a replay topic if a replay topic config is provided', () => {
    const topic = createTopic(
      {
        id: 'test_id',
        mode: TopicMode.REPLAY,
      },
      new WindowTopicsStorage(),
    );

    expect(topic).toBeInstanceOf(ReplayTopic);
  });
});
