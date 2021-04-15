"use strict";
exports.__esModule = true;
exports.dictComp = void 0;
function dictComp(extractorFn, list) {
    var initialObject = {};
    list.forEach(function (element) {
        var _a = extractorFn(element), key = _a[0], val = _a[1];
        initialObject[key] = val;
    });
    return initialObject;
}
exports.dictComp = dictComp;
