import http from "./http";

// 定义单条普通故事的类型
export interface StoryType {
  image_hue: string;
  title: string;
  url: string;
  hint: string;
  ga_prefix: string;
  images: string[]; // 数组形式
  type: number;
  id: number;
}
// 定义单条置顶故事的类型
export interface TopStoryType {
  image_hue: string;
  hint: string;
  url: string;
  image: string; // 单个字符串，不是数组
  title: string;
  ga_prefix: string;
  type: number;
  id: number;
}

// 新闻列表type
export interface NewsListType {
  stories: StoryType[];
  date: string;
}

// 定义接口返回的完整数据类型
interface NewsInfoResponseType {
  date: string; // 日期格式为 YYYYMMDD
  stories: StoryType[]; // 普通故事列表
  top_stories: TopStoryType[]; // 置顶故事列表
}

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

export interface NewsDetailType {
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
}

//获取新闻详细信息
const queryNewsInfo = (id?: string): Promise<NewsDetailType> => {
  return http.get("/api/news_info", {
    params: {
      id,
    },
  });
};

export interface NewsStoryExtraType {
  long_comments: number; // 长评论总数
  popularity: number; // 点赞总数
  short_comments: number; // 短评论总数
  comments: number; // 评论总数
}

// 获取新闻点赞信息
const queryStoryExtra = (id?: string): Promise<NewsStoryExtraType> => {
  return http.get("/api/story_extra", {
    params: {
      id,
    },
  });
};
const api = {
  queryNewsBefore,
  queryNewsLatest,
  queryNewsInfo,
  queryStoryExtra,
};
export default api;
