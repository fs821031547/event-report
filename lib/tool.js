"use strict";
exports.__esModule = true;
exports.parseURLSearch = void 0;
exports.parseURLSearch = function (serach) {
    if (serach === void 0) { serach = window.location.search; }
    var searchs = {};
    if (serach.length) {
        if (serach[0] === '?')
            serach = serach.slice(1);
        var kvs = serach.split('&');
        kvs.forEach(function (kv) {
            var skv = kv.split('=');
            searchs[skv[0]] = decodeURIComponent(skv[1]);
        });
    }
    return searchs;
};
