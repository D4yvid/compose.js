import { Composable, ComposableInstance } from "./compose";

type ContextProviderConstructor<T> = (_: T, c: ComposableInstance<LocalContextProviderProps<T>>) => ContextProvider<T>;
type LocalContextProviderProps<T> = [ContextProviderConstructor<T>, T];

export function makeContext<T = any>(): ContextProviderConstructor<T> {
  return (param, composable) => new ContextProvider<T>(param, composable);
}

class ContextProvider<T> {
  private _value: T;

  public constructor(value: T, composable: ComposableInstance<LocalContextProviderProps<T>>) {
    this._value = value;
  }

  public get value() {
    return this._value;
  }

  public set value(newValue: T) {
    this._value = newValue;
  }
}

export function localContextOf() {

}

export const LocalContextProvider = () => {
};
