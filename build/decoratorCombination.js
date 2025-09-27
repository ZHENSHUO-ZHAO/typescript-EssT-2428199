var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
// save the marks
const validateMap = {};
// 1. mark the parameters need to be validated
function typedDecoratorFactory(validator) {
    return (_, key, index) => {
        const target = validateMap[key] ?? [];
        target[index] = validator;
        validateMap[key] = target;
    };
}
function validate(_, key, descriptor) {
    const originalFn = descriptor.value;
    descriptor.value = function (...args) {
        // 2. run the validators
        const validatorList = validateMap[key];
        if (validatorList) {
            args.forEach((arg, index) => {
                const validator = validatorList[index];
                if (!validator)
                    return;
                const result = validator(arg);
                if (!result) {
                    throw new Error(`Failed for parameter: ${arg} of the index: ${index}`);
                }
            });
        }
        // 3. run the original method
        return originalFn.call(this, ...args);
    };
}
const isInt = typedDecoratorFactory((x) => Number.isInteger(x));
const isString = typedDecoratorFactory((x) => typeof x === "string");
class Salute {
    sayRepeat(word, x) {
        return Array(x).fill(word).join("");
    }
}
__decorate([
    validate,
    __param(0, isString),
    __param(1, isInt),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], Salute.prototype, "sayRepeat", null);
try {
    const s = new Salute();
    s.sayRepeat("hello", 2); // pass
    s.sayRepeat("", "lol"); // throw an error
}
catch (e) {
    console.error(e.message);
}
