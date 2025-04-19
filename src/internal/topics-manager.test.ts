import { TopicsManager } from './topics-manager.ts';
import { TopicMode } from './topic/topic-config.ts';
import Mock = jest.Mock;
import { EventTopic } from './topic/impl/event-topic.ts';

describe('TopicsManager', () => {
  describe('topic', () => {
    let topicsManager: TopicsManager;

    let storageGetTopicData: Mock;
    let storageSetTopicData: Mock;

    beforeEach(() => {
      storageGetTopicData = jest.fn();
      storageSetTopicData = jest.fn();
      topicsManager = new TopicsManager({
        getTopicData: storageGetTopicData,
        setTopicData: storageSetTopicData,
      });
    });

    test('should create a new event topic if no topic config is found in storage', () => {
      storageGetTopicData.mockReturnValueOnce(undefined);

      const topic = topicsManager.topic({
        id: 'test_id',
        mode: TopicMode.EVENT,
      });

      expect(topic).toBeInstanceOf(EventTopic);
      expect(topic.config).toEqual({
        id: 'test_id',
        mode: TopicMode.EVENT,
      });

      expect(storageGetTopicData).toHaveBeenLastCalledWith('test_id');
      expect(storageSetTopicData).toHaveBeenLastCalledWith({
        config: {
          id: 'test_id',
          mode: TopicMode.EVENT,
        },
        lastValue: undefined,
      });
    });

    test('should create a new event topic if the topic config is found in storage', () => {
      storageGetTopicData.mockReturnValueOnce({
        config: {
          id: 'test_id',
          mode: TopicMode.EVENT,
        },
        lastValue: undefined,
      });

      const topic = topicsManager.topic({
        id: 'test_id',
        mode: TopicMode.EVENT,
      });

      expect(topic).toBeInstanceOf(EventTopic);
      expect(topic.config).toEqual({
        id: 'test_id',
        mode: TopicMode.EVENT,
      });

      expect(storageGetTopicData).toHaveBeenLastCalledWith('test_id');
      expect(storageSetTopicData).toHaveBeenCalledTimes(0);
    });

    test('should warn the user if the topic mode does not match the topic config in storage', () => {
      storageGetTopicData.mockReturnValueOnce({
        config: {
          id: 'test_id',
          mode: TopicMode.EVENT,
        },
        lastValue: undefined,
      });

      const warnSpy = jest.spyOn(console, 'warn');

      topicsManager.topic({
        id: 'test_id',
        mode: TopicMode.REPLAY,
      });

      expect(warnSpy).toHaveBeenCalledTimes(1);
    });
  });
});
