var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
function BaseEntity(ctr) {
    ctr.prototype.generateId = Math.random;
    ctr.prototype.createTime = () => new Date().toLocaleString("es-ES");
    return class extends ctr {
        id;
        timeCreated;
        constructor(...args) {
            super(...args);
            this.id = this.generateId();
            this.timeCreated = this.createTime();
        }
    };
}
function observablePassword(target, propertyKey) {
    const symbolKey = Symbol(propertyKey); // backing field per instance
    console.log(target);
    console.log(propertyKey);
    Object.defineProperty(target, propertyKey, {
        get: function () {
            console.log(`Getting ${propertyKey}`);
            return this[symbolKey];
        },
        set: function (value) {
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
    name;
    password;
    constructor(name) {
        this.name = name;
        delete this.password;
    }
}
__decorate([
    observablePassword,
    __metadata("design:type", String)
], User.prototype, "password", void 0);
let City = class City {
    zicode;
    constructor(zicode) {
        this.zicode = zicode;
    }
};
City = __decorate([
    BaseEntity,
    __metadata("design:paramtypes", [Number])
], City);
let user1 = new User("dany");
let user2 = new User("vvv");
let ny = new City(123);
//City and User classes has the id and created property ;)
// console.log(ny.id);
// console.log(user1.id);
// console.log(user2.id);
// delete user1.password;
// console.log(user1.__proto__);
user1.password = "aaa";
// console.log(user1.password);
// function logger(
//   target: any,
//   propertyKey: string,
//   descriptor: PropertyDescriptor
// ) {
//   const original = descriptor.value;
//   descriptor.value = function (...args) {
//     console.log("params: ", ...args);
//     const result = original.call(this, ...args);
//     console.log("result: ", result);
//     return result;
//   };
// }
// class C {
//   @logger
//   add(x: number, y: number) {
//     return x + y;
//   }
// }
// const c = new C();
// c.add(1, 2);
