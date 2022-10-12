/* eslint-disable @typescript-eslint/camelcase */
import Fingerprint2 from 'fingerprintjs2';
import UAParser from 'ua-parser-js';
import xhr from './xhr';
import { parseURLSearch } from './tool';
import { StatisticsOptions, ReportParams, ReportMethodOptions } from './types';

const TZ_USER_MURMUR = 'TZ_USER_MURMUR';
let murmur = window.localStorage.getItem(TZ_USER_MURMUR);
if (!murmur) {
  Fingerprint2.get(null, (cs: Fingerprint2.Component[]) => {
    murmur = Fingerprint2.x64hash128(cs.map((c) => c.value).join(''), 31);
    window.localStorage.setItem(TZ_USER_MURMUR, murmur);
  });
}

const { browser, os, device } = UAParser();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const navigatora: any = window.navigator;
const connection =
  navigatora.connection ||
  navigatora.mozConnection ||
  navigatora.webkitConnection;

export default class StatisticsPlugin {
  public options: StatisticsOptions;
  public referrer: string;

  private params: ReportParams;

  constructor(options: StatisticsOptions) {
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
      browser_version: browser.version,
    } as ReportParams;
    if (connection?.type) {
      this.params.is_wifi = connection.type.toLocaleLowerCase() === 'wifi';
    }
  }

  public registerUserToken(token: string): void {
    this.options.token = token;
  }

  private resolveChannelId(options: ReportMethodOptions): string {
    let { channelId } = parseURLSearch();
    const { targetUrl } = options;

    if (!channelId && targetUrl) {
      const urlSearch = targetUrl.split('?')[1];
      if (urlSearch) {
        channelId = parseURLSearch(urlSearch).channelId;
      }
    }
    return channelId;
  }

  private resolveReportData(
    eventId: string,
    options: ReportMethodOptions,
  ): ReportParams {
    const _options = JSON.parse(JSON.stringify(options));
    const channelId = this.resolveChannelId(_options);
    if (_options.targetUrl) delete _options.targetUrl;

    const data = {
      ...this.params,
      begin_time: Date.now(),
      current_url: window.location.href,
      referrer_url: this.referrer,
      ..._options,
      event_id: eventId,
    } as ReportParams;
    if (channelId) data.channel = channelId;

    return data;
  }

  public report(eventId: string, options: ReportMethodOptions = {}): void {
    const data: ReportParams = this.resolveReportData(eventId, options);
    try {
      xhr(
        this.options.url,
        (err: string) => {
          if (err) console.log(err);
        },
        {
          post: JSON.stringify(data),
          method: 'post',
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            token: this.options.token,
            terminalType: this.options.terminal,
          },
        },
      );
    } catch (e) {
      console.error(e);
    }
  }
}
