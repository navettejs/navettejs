import { TopicConfig } from '../topic/topic-config.ts';

export interface TopicStorageData {
  config: TopicConfig;

  // Use a tuple to store any value, even null or undefined without conflict
  // with the plain "undefined" meaning no values yet.
  lastValue: [unknown] | undefined;
}

export interface TopicsStorage {
  getTopicData(topicId: string): TopicStorageData | undefined;

  setTopicData(topicData: TopicStorageData): void;
}

interface WindowTopicsData {
  topics: Record<string, TopicStorageData>;
}

export class WindowTopicsStorage implements TopicsStorage {
  private data: WindowTopicsData;

  constructor(_window: object = window) {
    if (
      (_window as unknown as { navettejs: unknown }).navettejs === undefined
    ) {
      (_window as unknown as { navettejs: unknown }).navettejs = {
        topics: {},
      } satisfies WindowTopicsData;
    }
    this.data = (
      _window as unknown as { navettejs: WindowTopicsData }
    ).navettejs;
  }

  getTopicData(topicId: string): TopicStorageData | undefined {
    return this.data.topics[topicId] ?? undefined;
  }

  setTopicData(topicData: TopicStorageData): void {
    this.data.topics[topicData.config.id] = topicData;
  }
}
