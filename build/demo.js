var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
const currentUser = {
    id: 1234,
    roles: ["ContactEditor", "ContactViewer"],
    isAuthenticated() {
        return true;
    },
    isInRole(role) {
        return this.roles.includes(role);
    },
};
function authorize(role) {
    return function authorizeDecorator(target, property, descriptor) {
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
function freeze(constructor) {
    Object.freeze(constructor);
    Object.freeze(constructor.prototype);
}
function singleton(constructor) {
    return class Singleton extends constructor {
        static _instance = null;
        static getInstance(...args) {
            if (!Singleton._instance) {
                Singleton._instance = new Singleton(...args);
            }
            return Singleton._instance;
        }
        constructor(...args) {
            super(...args);
            if (Singleton._instance) {
                throw Error("Duplicate instance");
            }
            Singleton._instance = this;
        }
    };
}
function auditable(target, key) {
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
    contacts = [];
    //   @authorize("ContactViewer")
    getContactById(id) {
        const contact = this.contacts.find((x) => x.id === id);
        return contact;
    }
    //   @authorize("ContactEditor")
    save(contact) {
        const existing = this.getContactById(contact.id);
        if (existing) {
            Object.assign(existing, contact);
        }
        else {
            this.contacts.push(contact);
        }
    }
}
__decorate([
    auditable,
    __metadata("design:type", Array)
], ContactRepository.prototype, "contacts", void 0);
const c1 = new ContactRepository();
c1.contacts = [];
// const c1 = ContactRepository.getInstance();
// const c2 = ContactRepository.getInstance();
// console.log(c1 === c2);
