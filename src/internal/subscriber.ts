export interface Subscriber<T> {
  on(value: T): void;
  end(): void;
}
