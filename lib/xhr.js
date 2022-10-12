"use strict";
exports.__esModule = true;
exports["default"] = (function (url, cb, options) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (XMLHttpRequest.DONE !== this.readyState)
            return;
        cb(this.status === 200
            ? false
            : new Error('StatisticsPlugin: server respnse status is ' + this.status), this.responseText, this);
    };
    xhr.open(options.method ? options.method.toUpperCase() : 'GET', url, true);
    if (typeof options.withCredentials === 'boolean') {
        xhr.withCredentials = options.withCredentials;
    }
    if (options.headers) {
        Object.keys(options.headers).forEach(function (key) {
            if (options.headers[key] !== undefined && options.headers[key] !== null) {
                xhr.setRequestHeader(key, options.headers[key]);
            }
        });
        if (!options.headers['Content-Type']) {
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        }
    }
    if (options.post) {
        xhr.send(options.post);
    }
    else {
        xhr.send();
    }
});
