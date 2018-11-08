export var requiredRule = function (value) { return !!value; };
export var lengthRule = function (l) { return function (v) {
    return !!v && v.length >= l;
}; };
export var equalityRule = function (fieldValue_1, fieldValue_2) { return fieldValue_1 === fieldValue_2; };
