interface Contact {
  id: number;
}

const currentUser = {
  id: 1234,
  roles: ["ContactEditor", "ContactViewer"],
  isAuthenticated(): boolean {
    return true;
  },
  isInRole(role: string): boolean {
    return this.roles.includes(role);
  },
};

function authorize(role: string) {
  return function authorizeDecorator(
    target: any,
    property: string,
    descriptor: PropertyDescriptor
  ) {
    const wrapped = descriptor.value;

    descriptor.value = function () {
      if (!currentUser.isAuthenticated()) {
        throw Error("User is not authenticated");
      }
      if (!currentUser.isInRole(role)) {
        throw Error(`User not in role ${role}`);
      }

      return wrapped.apply(this, arguments);
    };
  };
}

function freeze(constructor: Function) {
  Object.freeze(constructor);
  Object.freeze(constructor.prototype);
}

function singleton<T extends { new (...args: any[]): {} }>(
  constructor: T
): T & { getInstance } {
  return class Singleton extends constructor {
    static _instance = null;

    static getInstance(...args: any[]) {
      if (!Singleton._instance) {
        Singleton._instance = new Singleton(...args);
      }
      return Singleton._instance;
    }

    constructor(...args: any[]) {
      super(...args);
      if (Singleton._instance) {
        throw Error("Duplicate instance");
      }

      Singleton._instance = this;
    }
  };
}

function auditable(target: any, key: string | symbol) {
  const symbolKey = Symbol(key.toString());

  Reflect.defineProperty(this, key, {
    get: function () {
      return this[symbolKey];
    },
    set: function (newVal) {
      console.log(`${key.toString()} changed: `, newVal);
      this[symbolKey] = newVal;
    },
    enumerable: true,
    configurable: true,
  });
}

// @freeze
// @singleton
class ContactRepository {
  //   static getInstance: (...args: any[]) => ContactRepository;

  @auditable
  public contacts: Contact[] = [];

  //   @authorize("ContactViewer")
  getContactById(id: number): Contact | null {
    const contact = this.contacts.find((x) => x.id === id);
    return contact;
  }

  //   @authorize("ContactEditor")
  save(contact: Contact): void {
    const existing = this.getContactById(contact.id);

    if (existing) {
      Object.assign(existing, contact);
    } else {
      this.contacts.push(contact);
    }
  }
}

const c1 = new ContactRepository();
c1.contacts = [];

// const c1 = ContactRepository.getInstance();
// const c2 = ContactRepository.getInstance();
// console.log(c1 === c2);
