declare global {
  interface C {
    onFooChange(fn: (prev: any, next: any) => void): void;
    onBarChange(fn: (prev: any, next: any) => void): void;
  }

  interface User {
    readonly id: number;
    readonly timeCreated: string;
  }
}

export {};
