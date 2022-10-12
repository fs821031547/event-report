"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
/* eslint-disable @typescript-eslint/camelcase */
var fingerprintjs2_1 = require("fingerprintjs2");
var ua_parser_js_1 = require("ua-parser-js");
var xhr_1 = require("./xhr");
var tool_1 = require("./tool");
var TZ_USER_MURMUR = 'TZ_USER_MURMUR';
var murmur = window.localStorage.getItem(TZ_USER_MURMUR);
if (!murmur) {
    fingerprintjs2_1["default"].get(null, function (cs) {
        murmur = fingerprintjs2_1["default"].x64hash128(cs.map(function (c) { return c.value; }).join(''), 31);
        window.localStorage.setItem(TZ_USER_MURMUR, murmur);
    });
}
var _a = ua_parser_js_1["default"](), browser = _a.browser, os = _a.os, device = _a.device;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
var navigatora = window.navigator;
var connection = navigatora.connection ||
    navigatora.mozConnection ||
    navigatora.webkitConnection;
var StatisticsPlugin = /** @class */ (function () {
    function StatisticsPlugin(options) {
        this.options = Object.assign({}, options);
        this.referrer = window.document.referrer;
        this.params = {
            device_id: murmur,
            device_width: window.screen.width,
            device_height: window.screen.height,
            device_makers: device.vendor,
            os_name: os.name,
            os_version: os.version,
            browser: browser.name,
            browser_version: browser.version
        };
        if (connection === null || connection === void 0 ? void 0 : connection.type) {
            this.params.is_wifi = connection.type.toLocaleLowerCase() === 'wifi';
        }
    }
    StatisticsPlugin.prototype.registerUserToken = function (token) {
        this.options.token = token;
    };
    StatisticsPlugin.prototype.resolveChannelId = function (options) {
        var channelId = tool_1.parseURLSearch().channelId;
        var targetUrl = options.targetUrl;
        if (!channelId && targetUrl) {
            var urlSearch = targetUrl.split('?')[1];
            if (urlSearch) {
                channelId = tool_1.parseURLSearch(urlSearch).channelId;
            }
        }
        return channelId;
    };
    StatisticsPlugin.prototype.resolveReportData = function (eventId, options) {
        var _options = JSON.parse(JSON.stringify(options));
        var channelId = this.resolveChannelId(_options);
        if (_options.targetUrl)
            delete _options.targetUrl;
        var data = __assign(__assign(__assign(__assign({}, this.params), { begin_time: Date.now(), current_url: window.location.href, referrer_url: this.referrer }), _options), { event_id: eventId });
        if (channelId)
            data.channel = channelId;
        return data;
    };
    StatisticsPlugin.prototype.report = function (eventId, options) {
        if (options === void 0) { options = {}; }
        var data = this.resolveReportData(eventId, options);
        try {
            xhr_1["default"](this.options.url, function (err) {
                if (err)
                    console.log(err);
            }, {
                post: JSON.stringify(data),
                method: 'post',
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    token: this.options.token,
                    terminalType: this.options.terminal
                }
            });
        }
        catch (e) {
            console.error(e);
        }
    };
    return StatisticsPlugin;
}());
exports["default"] = StatisticsPlugin;
