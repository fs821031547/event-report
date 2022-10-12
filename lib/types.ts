export interface StatisticsOptions {
  url: string;
  terminal: number;
  token?: string;
}

export interface ReportParams {
  device_id: string;
  os_name: string;
  os_version: string;
  device_width: number;
  device_height: number;
  browser: string;
  browser_version: string;
  begin_time: number;
  current_url: string;
  device_makers: string;
  is_wifi: boolean;
  referrer_url: string;
  [propName: string]: unknown;
}

export interface ReportMethodOptions {
  event_attr?: object;
  targetUrl?: string;
  [propName: string]: unknown;
}
