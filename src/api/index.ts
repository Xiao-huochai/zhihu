import http from "./http";

// 定义单条普通故事的类型
export type StoryType = {
  image_hue: string;
  title: string;
  url: string;
  hint: string;
  ga_prefix: string;
  images: string[]; // 数组形式
  type: number;
  id: number;
};
// 定义单条置顶故事的类型
export type TopStoryType = {
  image_hue: string;
  hint: string;
  url: string;
  image: string; // 单个字符串，不是数组
  title: string;
  ga_prefix: string;
  type: number;
  id: number;
};

// 新闻列表type
export type NewsListType = {
  stories: StoryType[];
  date: string;
};

// 定义接口返回的完整数据类型
type NewsInfoResponseType = {
  date: string; // 日期格式为 YYYYMMDD
  stories: StoryType[]; // 普通故事列表
  top_stories: TopStoryType[]; // 置顶故事列表
};

// 获取今日新闻信息 & 轮播图信息
const queryNewsLatest = (): Promise<NewsInfoResponseType> =>
  http.get("/api/news_latest");

// 获取往日新闻信息
const queryNewsBefore = (time: string): Promise<NewsListType> => {
  return http.get("/api/news_before", {
    params: {
      time,
    },
  });
};

export type NewsDetailType = {
  body: string;
  image_hue: string;
  image_source: string;
  title: string;
  url: string;
  image: string;
  share_url: string;
  js: any[]; // 或者更具体的类型：string[]
  ga_prefix: string;
  images: string[];
  type: number;
  id: number;
  css: string[];
};

//获取新闻详细信息
const queryNewsInfo = (id?: string): Promise<NewsDetailType> => {
  return http.get("/api/news_info", {
    params: {
      id,
    },
  });
};

export type NewsStoryExtraType = {
  long_comments: number; // 长评论总数
  popularity: number; // 点赞总数
  short_comments: number; // 短评论总数
  comments: number; // 评论总数
};

// 获取新闻点赞信息
const queryStoryExtra = (id?: string): Promise<NewsStoryExtraType> => {
  return http.get("/api/story_extra", {
    params: {
      id,
    },
  });
};

type phoneCodeType = {
  code: string;
};
// 发送验证码
const sendPhoneCode = (phone: string): Promise<phoneCodeType> => {
  return http.post("/api/phone_code", {
    phone,
  });
};

type loginType = {
  code: number;
  codeText: string;
  token: string;
};
// 登录/注册
const login = (phone: string, code: string): Promise<loginType> => {
  return http.post("/api/login", {
    phone,
    code,
  });
};
// 获取登录者信息

export type UserInfo = {
  id: string | number;
  name: string;
  phone: string | number;
  pic: string;
};

export type UserInfoApi = {
  code: string | number;
  codeText: string;
  data: UserInfo;
};

const queryUserInfo = (): Promise<UserInfoApi> => http.get("/api/user_info");

// ====================== 2. 上传图片 ======================
// 上传图片的请求参数（FormData格式）
type UploadImageParams = {
  file: File; // 文件对象
};
// 上传图片的返回值类型
type UploadImageResponse = {
  code: number | string;
  codeText: string;
  pic: string; // 上传后返回的图片地址
};
// 上传图片请求函数（POST + multipart/form-data）
const uploadImage = (
  params: UploadImageParams,
): Promise<UploadImageResponse> => {
  // 构建FormData（适配multipart/form-data格式）
  const formData = new FormData();
  formData.append("file", params.file);
  // 注意：上传文件时需要设置请求头Content-Type为multipart/form-data（多数http库会自动处理）
  return http.post("/api/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// ====================== 3. 修改用户信息 ======================
// 修改用户信息的请求参数
type UpdateUserInfoParams = {
  username: string; // 用户名
  pic: string; // 图片地址（上传图片后返回的pic）
};
// 修改用户信息的返回值类型
type UpdateUserInfoResponse = {
  code: number | string;
  codeText: string;
  data: {
    id: string | number;
    name: string;
    phone: string;
    pic: string;
  };
};
// 修改用户信息请求函数
const updateUserInfo = (
  params: UpdateUserInfoParams,
): Promise<UpdateUserInfoResponse> => http.post("/api/user_update", params);

// ====================== 4. 收藏新闻 ======================
// 收藏新闻的请求参数
type StoreNewsParams = {
  newsId: string | number; // 新闻ID
};
// 收藏新闻的返回值类型
type StoreNewsResponse = {
  code: number | string;
  codeText: string;
};
// 收藏新闻请求函数
const storeNews = (params: StoreNewsParams): Promise<StoreNewsResponse> =>
  http.post("/api/store", params);

// ====================== 5. 移除收藏 ======================
// 移除收藏的请求参数（GET请求，参数拼在URL上）
type RemoveStoreParams = {
  id: string | number; // 收藏ID
};
// 移除收藏的返回值类型
type RemoveStoreResponse = {
  code: number | string;
  codeText: string;
};
// 移除收藏请求函数（GET请求，参数通过query传递）
const removeStore = (params: RemoveStoreParams): Promise<RemoveStoreResponse> =>
  http.get("/api/store_remove", { params });

// ====================== 6. 获取登录者收藏列表 ======================
// 获取收藏列表的返回值类型

// 这样也行
export type StoreList = {
  id: string | number;
  userId: string | number;
  news: {
    id: string | number;
    title: string;
    image: string;
  };
}[];

// export type StoreList = Array<{
//   id: string | number;
//   userId: string | number;
//   news: {
//     id: string | number;
//     title: string;
//     image: string;
//   };
// }>;

export type GetStoreListResponse = {
  code: number | string;
  codeText: string;
  data: StoreList;
};
// 获取收藏列表请求函数（无参数）
const getStoreList = (): Promise<GetStoreListResponse> =>
  http.get("/api/store_list");

const api = {
  queryNewsBefore,
  queryNewsLatest,
  queryNewsInfo,
  queryStoryExtra,
  sendPhoneCode,
  login,
  queryUserInfo,
  uploadImage,
  updateUserInfo,
  storeNews,
  getStoreList,
  removeStore,
};
export default api;
