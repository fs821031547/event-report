# `event-report`

> 前端埋点统计插件，对标后端数据采集服务。

## 插件依赖

- fingerprintjs2
- ua-parser-js

请自行在项目安装以上依赖包

```bash
npm install fingerprintjs2 ua-parser-js
# or
yarn add fingerprintjs2 ua-parser-js
```

## 使用方式（无框架项目）

### 安装依赖

```bash
npm install event-report
# or
yarn add event-report
```

### 创建实例

```js
import eventReport from 'event-report';
const statPlugin = new eventReport({
  // 请自行区分项目运行环境
  url: 'https://data-collect.shiguangkey.com/data-collect/common/receive',
  // 请自行确定上报终端
  terminal: 4,
  // 用户凭证（可选）
  token: '',
});
```

### 数据上报

```js
/**
 * 统计事件上报方法
 * @param {String} eventId - 事件 id
 * @param {Object} [options] - 可选项，自定义上报内容
 * @param {String} [options.targetUrl] - 目标跳转页面地址
 */
statPlugin.report(eventId, options);
```

## 使用方式（Vue 项目）

如果使用 vue-router 处理路由，会导致插件上报时传递的 referrer_url 字段存在问题，需将 router 传给插件，插件会对其进行 hook 处理。

vue-router 的 hash 模式和 history 模式，并非真实页面跳转，其实都只是局部更新页面内容。如果 “局部” 对应的是页面全部内容的更新，在感知上会误以为是页面跳转了，其实并没有。  
本质上，浏览器必须从服务器获取（请求） html 内容，才算是页面跳转。

### 安装依赖

```js
npm install event-report
# or
yarn add event-report
```

<!--
将 StatisticsPlugin 的实例放到 Vue 的原型对象上，所有 Vue 实例都可通过 `this.$eventReport` 访问 StatisticsPlugin 实例。 -->

### 数据上报

## 上报接口说明

**请求头** 默认提供如下字段

- `token` 用户凭证
- `terminalType` 终端类型

**请求体** 默认提供如下字段

- `device_id` 设备 ID
- `begin_time` 上报时间
- `device_makers` 设备制造商
- `device_width` 设备宽度
- `device_height` 设备高度
- `os_name` 系统名称
- `os_version` 系统版本
- `browser` 浏览器名称
- `browser_version` 浏览器版本
- `current_url` 上报时的当前页面 URL
- `referrer_url` 来源（进入当前页面之前的）页面 URL
- `channel` 渠道 id
- `is_wifi` 当前网络环境是否为 wifi（仅 Android）

**注：**

1. 由于浏览器限制，目前无法提供网络环境相关信息。
2. 页面停留时长不应该在上报时直接提供，因为进入页面和离开页面现在都有上报行为，用户的停留时长可以通过这些上报数据进行分析计算得出。

## 部分字段和实例方法说明

### `options.targetUrl`

> 目标跳转页面地址

如果当前 URL 与目标页面 URL 同时存在查询参数 `channelId`，则上报数据会取目标页面 URL 的 `channelId` 进行上报。

### 更新用户凭证

用户登录状态是可变的，登录或登出时，需要更新用户凭证。

```js
statPlugin.registerUserToken(token);
```
