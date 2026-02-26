import _ from "../assets/utils";
import qs from "qs";
import { Toast } from "antd-mobile";

/* 请求配置接口 */
interface HttpConfig {
  url: string;
  method: string;
  credentials: RequestCredentials;
  headers: Record<string, string> | null;
  // 对象的所有key和value均为string类型
  body: any;
  params: Record<string, any> | null;
  responseType: string;
  signal: AbortSignal | null;
}

/* 错误响应接口 */
interface HttpError {
  code: number;
  status: number;
  statusText: string;
}

/* Http 函数接口（含快捷方法） */
interface HttpFunction {
  (config?: Partial<HttpConfig>): Promise<any>;
  get: (url: string, config?: Partial<HttpConfig>) => Promise<any>;
  head: (url: string, config?: Partial<HttpConfig>) => Promise<any>;
  delete: (url: string, config?: Partial<HttpConfig>) => Promise<any>;
  options: (url: string, config?: Partial<HttpConfig>) => Promise<any>;
  post: (url: string, body?: any, config?: Partial<HttpConfig>) => Promise<any>;
  put: (url: string, body?: any, config?: Partial<HttpConfig>) => Promise<any>;
  patch: (
    url: string,
    body?: any,
    config?: Partial<HttpConfig>,
  ) => Promise<any>;
}

/* 核心方法 */
const http: HttpFunction = function http(
  config?: Partial<HttpConfig>,
): Promise<any> {
  // initial config & validate
  if (!_.isPlainObject(config)) config = {};
  const fullConfig: HttpConfig = Object.assign(
    {
      url: "",
      method: "GET",
      credentials: "include" as RequestCredentials,
      headers: null,
      body: null,
      params: null,
      responseType: "json",
      signal: null,
    },
    config,
  );
  if (!fullConfig.url) throw new TypeError("url must be required");
  if (!_.isPlainObject(fullConfig.headers)) fullConfig.headers = {};
  if (fullConfig.params !== null && !_.isPlainObject(fullConfig.params))
    fullConfig.params = null;

  let {
    url,
    method,
    credentials,
    headers,
    body,
    params,
    responseType,
    signal,
  } = fullConfig;

  if (params) {
    url += `${url.includes("?") ? "&" : "?"}${qs.stringify(params)}`;
  }
  if (_.isPlainObject(body)) {
    body = qs.stringify(body);
    (headers as Record<string, string>)["Content-Type"] =
      "application/x-www-form-urlencoded";
  }

  // 处理Token
  const token: string | null = _.storage.get("tk");
  const safeList: string[] = [
    "/user_info",
    "/user_update",
    "/store",
    "/store_remove",
    "/store_list",
  ];
  if (token) {
    const reg: RegExp = /\/api(\/[^?#]+)/;
    const [, $1] = reg.exec(url) || [];
    const isSafe: boolean = safeList.some((item: string): boolean => {
      return $1 === item;
    });
    if (isSafe) (headers as Record<string, string>)["authorization"] = token;
  }

  // send
  method = method.toUpperCase();
  const fetchConfig: RequestInit = {
    method,
    credentials,
    headers: headers as Record<string, string>,
    cache: "no-cache",
    signal,
  };
  if (/^(POST|PUT|PATCH)$/i.test(method) && body) fetchConfig.body = body;

  return fetch(url, fetchConfig)
    .then((response: Response): Promise<any> => {
      const { status, statusText } = response;
      if (/^(2|3)\d{2}$/.test(String(status))) {
        let result: Promise<any>;
        switch (responseType.toLowerCase()) {
          case "text":
            result = response.text();
            break;
          case "arraybuffer":
            result = response.arrayBuffer();
            break;
          case "blob":
            result = response.blob();
            break;
          default:
            result = response.json();
        }
        return result;
      }
      return Promise.reject({
        code: -100,
        status,
        statusText,
      } as HttpError);
    })
    .catch((reason: any): Promise<never> => {
      Toast.show({
        icon: "fail",
        content: "网络繁忙,请稍后再试!",
      });
      return Promise.reject(reason);
    });
} as HttpFunction;

/* 快捷方法 */
(["GET", "HEAD", "DELETE", "OPTIONS"] as const).forEach((item) => {
  (http as any)[item.toLowerCase()] = function (
    url: string,
    config?: Partial<HttpConfig>,
  ): Promise<any> {
    if (!_.isPlainObject(config)) config = {};
    config!["url"] = url;
    config!["method"] = item;
    return http(config);
  };
});

(["POST", "PUT", "PATCH"] as const).forEach((item) => {
  (http as any)[item.toLowerCase()] = function (
    url: string,
    body?: any,
    config?: Partial<HttpConfig>,
  ): Promise<any> {
    if (!_.isPlainObject(config)) config = {};
    config!["url"] = url;
    config!["method"] = item;
    config!["body"] = body;
    return http(config);
  };
});

export default http;
