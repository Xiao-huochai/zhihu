/* 检测数据类型 */
const class2type: Record<string, string> = {};
const toString: () => string = class2type.toString;
const hasOwn: (v: PropertyKey) => boolean = class2type.hasOwnProperty;

const toType = function toType(obj: any): string {
  const reg: RegExp = /^\[object ([\w\W]+)\]$/;
  if (obj == null) return obj + "";
  return typeof obj === "object" || typeof obj === "function"
    ? reg.exec(toString.call(obj))![1].toLowerCase()
    : typeof obj;
};

const isFunction = function isFunction(obj: any): obj is Function {
  return (
    typeof obj === "function" &&
    typeof obj.nodeType !== "number" &&
    typeof obj.item !== "function"
  );
};

const isWindow = function isWindow(obj: any): boolean {
  return obj != null && obj === obj.window;
};

const isArrayLike = function isArrayLike(obj: any): boolean {
  const length: number | boolean = !!obj && "length" in obj && obj.length;
  const type: string = toType(obj);
  if (isFunction(obj) || isWindow(obj)) return false;
  return (
    type === "array" ||
    length === 0 ||
    (typeof length === "number" && length > 0 && length - 1 in obj)
  );
};

const isPlainObject = function isPlainObject(
  obj: any,
): obj is Record<string, any> {
  let proto: any, Ctor: any;
  if (!obj || toString.call(obj) !== "[object Object]") return false;
  proto = Object.getPrototypeOf(obj);
  if (!proto) return true;
  Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
  return typeof Ctor === "function" && Ctor === Object;
};

const isEmptyObject = function isEmptyObject(obj: object): boolean {
  let keys: (string | symbol)[] = Object.getOwnPropertyNames(obj);
  if (typeof Symbol !== "undefined")
    keys = keys.concat(Object.getOwnPropertySymbols(obj));
  return keys.length === 0;
};

const isNumeric = function isNumeric(obj: any): boolean {
  const type: string = toType(obj);
  return (
    (type === "number" || type === "string") && !isNaN(obj - parseFloat(obj))
  );
};

/* 函数的防抖和节流 */
const clearTimer = function clearTimer(
  timer: ReturnType<typeof setTimeout> | null,
): null {
  if (timer) clearTimeout(timer);
  return null;
};

const debounce = function debounce(
  func: Function,
  wait?: number | boolean,
  immediate?: boolean,
): (...args: any[]) => void {
  if (typeof func !== "function")
    throw new TypeError("func is not a function!");
  if (typeof wait === "boolean") {
    immediate = wait;
    wait = undefined;
  }
  wait = +(wait as number);
  if (isNaN(wait)) wait = 300;
  if (typeof immediate !== "boolean") immediate = false;
  let timer: ReturnType<typeof setTimeout> | null = null;
  return function operate(this: any, ...params: any[]): void {
    const now: boolean = !timer && (immediate as boolean);
    timer = clearTimer(timer);
    timer = setTimeout(() => {
      if (!immediate) func.call(this, ...params);
      timer = clearTimer(timer);
    }, wait as number);
    if (now) func.call(this, ...params);
  };
};

const throttle = function throttle(
  func: Function,
  wait?: number,
): (...args: any[]) => void {
  if (typeof func !== "function")
    throw new TypeError("func is not a function!");
  wait = +(wait as number);
  if (isNaN(wait)) wait = 300;
  let timer: ReturnType<typeof setTimeout> | null = null,
    previous: number = 0;
  return function operate(this: any, ...params: any[]): void {
    const now: number = +new Date();
    const remaining: number = (wait as number) - (now - previous);
    if (remaining <= 0) {
      func.call(this, ...params);
      previous = +new Date();
      timer = clearTimer(timer);
    } else if (!timer) {
      timer = setTimeout(() => {
        func.call(this, ...params);
        previous = +new Date();
        timer = clearTimer(timer);
      }, remaining);
    }
  };
};

/* 数组和对象的操作 */
const mergeArray = function mergeArray(first: any, second: any): any {
  if (typeof first === "string") first = Object(first);
  if (typeof second === "string") second = Object(second);
  if (!isArrayLike(first)) first = [];
  if (!isArrayLike(second)) second = [];
  let len: number = +second.length,
    j: number = 0,
    i: number = first.length;
  for (; j < len; j++) {
    first[i++] = second[j];
  }
  first.length = i;
  return first;
};

const each = function each(
  obj: any,
  callback: (value: any, keyOrIndex: any) => any,
): any {
  const isArray: boolean = isArrayLike(obj);
  const isObject: boolean = isPlainObject(obj);
  if (!isArray && !isObject)
    throw new TypeError("obj must be a array or likeArray or plainObject");
  if (!isFunction(callback)) throw new TypeError("callback is not a function");
  if (isArray) {
    for (let i: number = 0; i < obj.length; i++) {
      const item: any = obj[i];
      const index: number = i;
      if (callback.call(item, item, index) === false) break;
    }
    return obj;
  }
  let keys: (string | symbol)[] = Object.getOwnPropertyNames(obj);
  if (typeof Symbol !== "undefined")
    keys = keys.concat(Object.getOwnPropertySymbols(obj));
  for (let i: number = 0; i < keys.length; i++) {
    const key: string | symbol = keys[i];
    const value: any = obj[key as string];
    if (callback.call(value, value, key) === false) break;
  }
  return obj;
};

const merge = function merge(...params: any[]): any {
  let options: any,
    target: any = params[0],
    i: number = 1,
    length: number = params.length,
    deep: boolean = false,
    treated: Set<any> = params[length - 1];
  toType(treated) === "set" ? length-- : (treated = new Set());
  if (typeof target === "boolean") {
    deep = target;
    target = params[i];
    i++;
  }
  if (target == null || (typeof target !== "object" && !isFunction(target)))
    target = {};
  for (; i < length; i++) {
    options = params[i];
    if (options == null) continue;
    if (treated.has(options)) return options;
    treated.add(options);
    each(options, (copy: any, name: string | symbol) => {
      const copyIsArray: boolean = Array.isArray(copy);
      const copyIsObject: boolean = isPlainObject(copy);
      let src: any = target[name as string];
      if (deep && copy && (copyIsArray || copyIsObject)) {
        if (copyIsArray && !Array.isArray(src)) src = [];
        if (copyIsObject && !isPlainObject(src)) src = {};
        target[name as string] = merge(deep, src, copy, treated);
      } else if (copy !== undefined) {
        target[name as string] = copy;
      }
    });
  }
  return target;
};

const clone = function clone(...params: any[]): any {
  let target: any = params[0],
    deep: boolean = false,
    length: number = params.length,
    i: number = 1,
    isArray: boolean,
    isObject: boolean,
    result: any,
    treated: Set<any>;
  if (typeof target === "boolean" && length > 1) {
    deep = target;
    target = params[1];
    i = 2;
  }
  treated = params[i];
  if (!treated) treated = new Set();
  if (treated.has(target)) return target;
  treated.add(target);
  isArray = Array.isArray(target);
  isObject = isPlainObject(target);
  if (target == null) return target;
  if (
    !isArray &&
    !isObject &&
    !isFunction(target) &&
    typeof target === "object"
  ) {
    try {
      return new target.constructor(target);
    } catch (_) {
      return target;
    }
  }
  if (!isArray && !isObject) return target;
  result = new target.constructor();
  each(target, (copy: any, name: string | symbol) => {
    if (deep) {
      result[name as string] = clone(deep, copy, treated);
      return;
    }
    result[name as string] = copy;
  });
  return result;
};

/* 设定具备有效期的localStorage存储方案 */
interface StorageData {
  time: number;
  value: any;
}

interface Storage {
  set(key: string, value: any): void;
  get(key: string, cycle?: number): any;
  remove(key: string): void;
}

const storage: Storage = {
  set(key: string, value: any): void {
    localStorage.setItem(
      key,
      JSON.stringify({
        time: +new Date(),
        value,
      } as StorageData),
    );
  },
  get(key: string, cycle: number = 2592000000): any {
    cycle = +cycle;
    if (isNaN(cycle)) cycle = 2592000000;
    const data: string | null = localStorage.getItem(key);
    if (!data) return null;
    const { time, value }: StorageData = JSON.parse(data);
    if (+new Date() - time > cycle) {
      storage.remove(key);
      return null;
    }
    return value;
  },
  remove(key: string): void {
    localStorage.removeItem(key);
  },
};

/* 日期格式化 */
const formatTime = function formatTime(
  time?: string,
  template?: string,
): string {
  if (typeof time !== "string") {
    time = new Date().toLocaleString("zh-CN", { hour12: false });
  }
  if (typeof template !== "string") {
    template = "{0}年{1}月{2}日 {3}:{4}:{5}";
  }
  let arr: string[] = [];
  if (/^\d{8}$/.test(time)) {
    const [, $1, $2, $3] = /^(\d{4})(\d{2})(\d{2})$/.exec(time)!;
    arr.push($1, $2, $3);
  } else {
    arr = time.match(/\d+/g) || [];
  }
  return template.replace(/\{(\d+)\}/g, (_: string, $1: string): string => {
    let item: string = arr[+$1] || "00";
    if (item.length < 2) item = "0" + item;
    return item;
  });
};

/* 工具对象接口 */
interface Utils {
  toType: typeof toType;
  isFunction: typeof isFunction;
  isWindow: typeof isWindow;
  isArrayLike: typeof isArrayLike;
  isPlainObject: typeof isPlainObject;
  isEmptyObject: typeof isEmptyObject;
  isNumeric: typeof isNumeric;
  debounce: typeof debounce;
  throttle: typeof throttle;
  mergeArray: typeof mergeArray;
  each: typeof each;
  merge: typeof merge;
  clone: typeof clone;
  storage: Storage;
  formatTime: typeof formatTime;
  noConflict?: () => Utils;
}

const utils: Utils = {
  toType,
  isFunction,
  isWindow,
  isArrayLike,
  isPlainObject,
  isEmptyObject,
  isNumeric,
  debounce,
  throttle,
  mergeArray,
  each,
  merge,
  clone,
  storage,
  formatTime,
};

/* 处理冲突 */
declare global {
  interface Window {
    _: any;
  }
}

if (typeof window !== "undefined") {
  const $: any = window._;
  utils.noConflict = function noConflict(): Utils {
    if (window._ === utils) {
      window._ = $;
    }
    return utils;
  };
}

/* 导出API */
export default utils;
