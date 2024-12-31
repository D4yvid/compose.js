import { ComposableInstance } from "./compose";

export class MutableState<T> {
  private readonly composable: ComposableInstance<any>;
  private _value: T;

  constructor(value: T, composable: ComposableInstance<any>) {
    this._value = value;

    this.composable = composable;
  }

  get value(): T {
    return this._value;
  }

  set value(value: T) {
    this._value = value;

    this.composable.recompositionSignal.fire(this.composable);
  }
}

export class State<T> {
  private readonly composable: ComposableInstance<any>;
  private readonly _value: T;

  constructor(value: T, composable: ComposableInstance<any>) {
    this._value = value;

    this.composable = composable;
  }

  get value(): T {
    return this._value;
  }
}
