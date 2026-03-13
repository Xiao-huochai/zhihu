import "./Home.less";
import HomeHead from "../components/HomeHead";
import _ from "../assets/utils";
import { useState, useEffect, useRef } from "react";
import { Swiper, Image, Divider, DotLoading } from "antd-mobile";
import { Link } from "react-router-dom";
import api from "../api";
import { type TopStoryType, type NewsListType } from "../api";
import SkeletonAgain from "../components/SkeletonAgain";
import NewsItem from "../components/NewsItem";
const Home = function Home() {
  let [today, setToday] = useState<string>(
    _.formatTime(undefined, "{0}{1}{2}"),
  );
  let [bannerData, setBannerData] = useState<TopStoryType[]>([]);
  let [newsList, setNewsList] = useState<NewsListType[]>([]);
  let loadMore = useRef<HTMLDivElement>(null);
  // 第一次渲染完毕向服务器发送数据请求
  useEffect(() => {
    (async () => {
      try {
        let { date, stories, top_stories } = await api.queryNewsLatest();
        setToday(date);
        setBannerData(top_stories);
        newsList.push({
          date,
          stories,
        });
        // 直接修改地址不会改变 因此视图不刷新 得来个新的
        setNewsList([...newsList]);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);
  // 第一次渲染得到加载更多的盒子
  useEffect(() => {
    const obElement = loadMore.current;
    // 监听的元素
    if (!obElement) return;
    const ob = new IntersectionObserver(async (items) => {
      // isIntersecting 直接判断目标元素是否进入了视口 / 根元素的可见区域
      // intersectionRatio 作用：表示目标元素可见区域占其总区域的比例，范围是 0 ~ 1
      // intersectionRect作用：描述目标元素与根元素（视口）的交叉区域的矩形信息（DOMRectReadOnly 对象）。
      if (items[0].isIntersecting) {
        // 如果出现在视野里则继续加载对应的元素
        try {
          let date = newsList[newsList.length - 1]["date"];
          let res = await api.queryNewsBefore(date);
          newsList.push(res);
          setNewsList([...newsList]);
        } catch (error) {
          console.log(error);
        }
      }
    });
    ob.observe(obElement);

    // 组件更新时卸载函数 防止内存泄漏
    return () => {
      ob.unobserve(obElement);
      // 这里如果是loadMore.current会得到null因为组件卸载了 元素不存在(闭包)
      ob.disconnect();
    };
  }, []);
  return (
    <div className="home-box">
      <HomeHead today={today} />
      {/* 轮播图 */}
      <div className="swiper-box">
        {bannerData.length > 0 ? (
          <Swiper autoplay={true} loop={true}>
            {bannerData.map((item) => {
              return (
                <Swiper.Item key={item.id}>
                  <Link to={{ pathname: `/detail/${item.id}` }}>
                    <Image src={item.image} alt={item.title} lazy />
                    <div className="desc">
                      <h3 className="title">{item.title}</h3>
                      <p className="author">{item.hint}</p>
                    </div>
                  </Link>
                </Swiper.Item>
              );
            })}
          </Swiper>
        ) : null}
      </div>
      {/* 新闻列表 */}

      {newsList.length === 0 ? (
        <SkeletonAgain></SkeletonAgain>
      ) : (
        <>
          {newsList.map((item, index) => {
            let { date, stories } = item;
            date = _.formatTime(date, "{1}月{2}日");
            return (
              <div className="news-box" key={index}>
                {index !== 0 ? (
                  <Divider contentPosition="left">{date}</Divider>
                ) : null}
                <div className="list">
                  {stories.map((story) => {
                    return <NewsItem story={story} key={story.id}></NewsItem>;
                  })}
                </div>
              </div>
            );
          })}
        </>
      )}

      {/* 加载更多 */}
      {/* 对样式设置 可以拿到ref又可以控制是否显示 */}
      <div
        className="loadmore-box"
        ref={loadMore}
        style={{
          display: newsList.length === 0 ? "none" : "block",
        }}
      >
        加载更多
        <DotLoading></DotLoading>
      </div>
    </div>
  );
};
export default Home;
