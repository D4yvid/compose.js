import { Signal } from "./signal.js";
import { MutableState, State } from "./state.js";

import type {
  WrappedComposableInstance,
  ComposableOptions,
  ComposableInformation,
  ComposableFactory,
  ComposableRender,
} from "./types.js";

type RememberedStateMap = {
  [key: string]: {
    stored: any[];
    refcnt: number;
  };
};

export class ComposableInstance<T> {
  private readonly rememberedStateMap: RememberedStateMap = {};

  readonly information: ComposableInformation<T>;

  readonly factory: ComposableFactory<T>;

  readonly props: T|undefined;
  readonly isComposableInstance: boolean = true;

  recompositionSignal: Signal = new Signal();

  rawChildren: ComposableInstance<any>[] = [];
  children: any[] = [];

  constructor(
    information: ComposableInformation<T>,
    factory: ComposableFactory<T>,
    props?: T,
  ) {
    this.information = information;
    this.factory = factory;
    this.props = props;
  }

  public resetRememberedStateRefCounter() {
    for (let hash in this.rememberedStateMap) {
      this.rememberedStateMap[hash]!.refcnt = 0;
    }
  }

  public remember<T>(calculation: () => T): T {
    // FIX: do not depend on the Error stack for this.
    const stack = new Error().stack!.split("\n").slice(2);
    const caller = stack.shift()!;

    const hash = caller
      .split("")
      .map((item) => item.charCodeAt(0))
      .reduce((old, item) => old + item.toString(16), "")
      .toUpperCase();

    if (!(hash in this.rememberedStateMap)) {
      this.rememberedStateMap[hash] = {
        stored: [],
        refcnt: 0,
      };
    }

    const item = this.rememberedStateMap[hash]!;
    let index = item.refcnt++;

    if (index < item.stored.length) {
      return item.stored[index];
    }

    item.stored[index] = calculation();

    this.rememberedStateMap[hash] = item;

    return item.stored[index] as T;
  }

  public stateOf<T>(value: T): State<T> {
    return new State(value, this);
  }

  public mutableStateOf<T>(value: T): MutableState<T> {
    return new MutableState(value, this);
  }

  public setChildren(children: any[]) {
    this.children = children;
  }

  public setRawChildren(children: any[]) {
    this.rawChildren = children;
  }
}

function wrapComposableInstance<T>(
  instance: ComposableInstance<T>,
): WrappedComposableInstance<T> {
  const wrapped = ((...children: any[]) => {
    instance.setRawChildren(children);

    return instance;
  }) as WrappedComposableInstance<T>;

  Object.assign(wrapped, instance);
  Reflect.setPrototypeOf(wrapped, Reflect.getPrototypeOf(instance));

  return wrapped;
}

export function Composable<T = {}>(
  render: ComposableRender<T>,
  options: ComposableOptions = {},
): ComposableFactory<T> {
  const factory = ((props?: T) => {
    const instance = new ComposableInstance(
      factory.information,
      factory,
      props,
    );

    if (options?.hasChildren === false) {
      return instance;
    }

    return wrapComposableInstance(instance);
  }) as ComposableFactory<T>;

  Object.assign(factory, {
    isComposableFactory: true,

    information: {
      options,
      render,
    },
  });

  return factory;
}
