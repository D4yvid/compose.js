import type { ComposableInstance } from "./compose";

export type WrappedComposableInstance<T> = ComposableInstance<T> &
  ((...children: any[]) => ComposableInstance<T>);

export type ComposableRender<T> = (instance: ComposableInstance<T>) => any;

export type ComposableFactory<T> = {
  readonly information: ComposableInformation<T>;

  readonly isComposableFactory: true;
} & ((props?: T) => WrappedComposableInstance<T>);

export type ComposableOptions = {
  readonly hasChildren?: boolean;
} & { [key: string]: any };

export type ComposableInformation<T> = {
  readonly options: ComposableOptions;

  readonly render: ComposableRender<T>;
};
