var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
function observable(target, key) {
    // prop -> onPropChange
    const targetKey = "on" + capitalizeFirstLetter(key) + "Change";
    target[targetKey] = function (fn) {
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
    foo = -1;
    bar = "bar";
}
__decorate([
    observable,
    __metadata("design:type", Object)
], C.prototype, "foo", void 0);
__decorate([
    observable,
    __metadata("design:type", Object)
], C.prototype, "bar", void 0);
const t = new C();
t.onFooChange((prev, next) => console.log(`prev: ${prev}, next: ${next}`));
t.onBarChange((prev, next) => console.log(`prev: ${prev}, next: ${next}`));
t.foo = 100; // -> prev: -1, next: 100
t.foo = -3.14; // -> prev: 100, next: -3.14
t.bar = "baz"; // -> prev: bar, next: baz
t.bar = "sing"; // -> prev: baz, next: sing
console.log(t.bar);
