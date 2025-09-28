function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function observable(target: any, key: string): any {
  // prop -> onPropChange
  const targetKey = "on" + capitalizeFirstLetter(key) + "Change";

  target[targetKey] = function (fn: (prev: any, next: any) => void) {
    let prev = this[key];
    Reflect.defineProperty(this, key, {
      set(next) {
        fn(prev, next);
        prev = next;
      },
      get() {
        return prev;
      },
    });
  };
}

class C {
  @observable
  foo = -1;

  @observable
  bar = "bar";
}

const t = new C();

t.onFooChange((prev, next) => console.log(`prev: ${prev}, next: ${next}`));
t.onBarChange((prev, next) => console.log(`prev: ${prev}, next: ${next}`));

t.foo = 100; // -> prev: -1, next: 100
t.foo = -3.14; // -> prev: 100, next: -3.14
t.bar = "baz"; // -> prev: bar, next: baz
t.bar = "sing"; // -> prev: baz, next: sing
console.log(t.bar);
