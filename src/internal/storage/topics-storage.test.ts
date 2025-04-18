import {
  TopicsStorage,
  TopicStorageData,
  WindowTopicsStorage,
} from './topics-storage';
import { TopicMode } from '../topic/topic-config';

describe('WindowTopicsStorage', () => {
  let storage: TopicsStorage;
  let fakeGlobal: {
    navettejs: {
      topics: Record<string, TopicStorageData>;
    };
  };

  const testTopicData = {
    id: 'test',
    mode: TopicMode.EVENT,
    lastValue: ['value'],
  } satisfies TopicStorageData;

  const test2TopicData = {
    id: 'test2',
    mode: TopicMode.EVENT,
    lastValue: ['otherValue'],
  } satisfies TopicStorageData;

  beforeEach(() => {
    fakeGlobal = {
      navettejs: {
        topics: {
          test: testTopicData,
          test2: test2TopicData,
        },
      },
    };
    storage = new WindowTopicsStorage(fakeGlobal as unknown as Window);
  });

  describe('getTopicData', () => {
    test('should get topic data from the global object', () => {
      expect(storage.getTopicData('test')).toEqual(testTopicData);
      expect(storage.getTopicData('test2')).toEqual(test2TopicData);
    });

    test('should get undefined if topic does not exist', () => {
      expect(storage.getTopicData('testNotExisting')).toBeUndefined();
    });
  });

  describe('setTopicData', () => {
    test('should update the topic data when called with an existing topic id', () => {
      const data = {
        id: 'test2',
        mode: TopicMode.REPLAY,
        lastValue: ['value'],
      } satisfies TopicStorageData;
      storage.setTopicData(data);

      expect(fakeGlobal.navettejs.topics['test2']).toEqual(data);
    });

    test('should create the topic data when called on a new topic id', () => {
      const data = {
        id: 'test3',
        mode: TopicMode.EVENT,
        lastValue: ['value'],
      } satisfies TopicStorageData;
      storage.setTopicData(data);

      expect(fakeGlobal.navettejs.topics['test3']).toEqual(data);
    });
  });

  describe('constructor', () => {
    test('should create the navettejs storage object in the global object if not present', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fakeGlobal: any = {};
      new WindowTopicsStorage(fakeGlobal as Window);

      expect(fakeGlobal.navettejs).toEqual({
        topics: {},
      });
    });

    test('should not override the navettejs storage object in the global object if present', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fakeGlobal: any = {
        navettejs: {
          topics: {
            test: {},
          },
        },
      };
      new WindowTopicsStorage(fakeGlobal);

      expect(fakeGlobal.navettejs).toEqual({
        topics: {
          test: {},
        },
      });
    });
  });
});
