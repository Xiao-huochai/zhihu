import http from "./http";

// 获取今日新闻信息 & 轮播图信息
const queryNewsLatest = () => http.get("/api/news_latest");

// 获取往日新闻信息
const queryNewsBefore = (time: number) => {
  return http.get("/api/news_before", {
    params: {
      time,
    },
  });
};
//获取新闻详细信息
const queryNewsInfo = (id: number) => {
  return http.get("/api/news_info", {
    params: {
      id,
    },
  });
};

// 获取新闻点赞信息
const queryStoryExtra = (id: number) => {
  return http.get("/api/story_extra", {
    params: {
      id,
    },
  });
};
export { queryNewsBefore, queryNewsLatest, queryNewsInfo, queryStoryExtra };
