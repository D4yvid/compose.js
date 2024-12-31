export type SignalHandler = (...items: any) => any;

export class Signal {
  private listeners: SignalHandler[] = [];

  public fire(...items: any): void {
    this.listeners.forEach((listener) => listener(...items));
  }

  public listen(handler: SignalHandler): number {
    this.listeners.push(handler);

    return this.listeners.length;
  }

  public unlisten(index: number): void {
    const listener = this.listeners[index];

    this.listeners = this.listeners.filter((item) => item != listener);
  }
}
