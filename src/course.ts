function BaseEntity<T extends { new (...args: any[]): {} }>(ctr: T) {
  ctr.prototype.generateId = Math.random;
  ctr.prototype.createTime = () => new Date().toLocaleString("es-ES");

  return class extends ctr {
    [x: string]: any;
    readonly id: number;
    readonly timeCreated: string;
    constructor(...args: any[]) {
      super(...args);
      this.id = this.generateId();
      this.timeCreated = this.createTime();
    }
  };
}

function observablePassword(target: any, propertyKey: string) {
  const symbolKey = Symbol(propertyKey); // backing field per instance
  console.log(target);
  console.log(propertyKey);

  Object.defineProperty(target, propertyKey, {
    get: function () {
      console.log(`Getting ${propertyKey}`);
      return this[symbolKey];
    },
    set: function (value: string) {
      console.log(`Setting ${propertyKey} = ${value}`);
      // optionally, hash password here
      this[symbolKey] = value;
    },
    enumerable: true,
    configurable: true,
  });
}

// @BaseEntity
class User {
  [x: string]: any;
  @observablePassword
  public password: string;
  constructor(public name: string) {}
}

@BaseEntity
class City {
  [x: string]: any;
  constructor(public zicode: number) {}
}

let user1 = new User("dany");
let user2 = new User("vvv");
let ny = new City(123);
//City and User classes has the id and created property ;)
// console.log(ny.id);
// console.log(user1.id);
// console.log(user2.id);

// delete user1.password;
// console.log(user1.__proto__);
// user1.password = "aaa";
// console.log(user1.password);

function logger(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const original = descriptor.value;

  descriptor.value = function (...args) {
    console.log("params: ", ...args);
    const result = original.call(this, ...args);
    console.log("result: ", result);
    return result;
  };
}

class C {
  @logger
  add(x: number, y: number) {
    return x + y;
  }
}

const c = new C();
c.add(1, 2);
