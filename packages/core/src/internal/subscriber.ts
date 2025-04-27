export interface Subscriber<T> {
  on(value: T): void;
}
