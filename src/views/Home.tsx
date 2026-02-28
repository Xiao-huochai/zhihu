import "./Home.less";
import HomeHead from "../components/HomeHead";
import _ from "../assets/utils";
import { useState, useEffect } from "react";
import { Swiper, Image, Divider, DotLoading } from "antd-mobile";
import { Link } from "react-router-dom";
import api from "../api";
import { type TopStoryType } from "../api";
import SkeletonAgain from "../components/SkeletonAgain";
import NewsItem from "../components/NewsItem";
const Home = function Home() {
  let [today, setToday] = useState<string>(
    _.formatTime(undefined, "{0}{1}{2}"),
  );
  let [bannerData, setBannerData] = useState<TopStoryType[]>([]);
  useEffect(() => {
    (async () => {
      try {
        let { date, stories, top_stories } = await api.queryNewsLatest();
        setToday(date);
        setBannerData(top_stories);
      } catch (error) {
        console.log(error);
      }
    })();
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
      <SkeletonAgain></SkeletonAgain>
      <div className="news-box">
        <Divider contentPosition="left">12月23日</Divider>
        <div className="list">
          <NewsItem></NewsItem>
          <NewsItem></NewsItem>
          <NewsItem></NewsItem>
        </div>
      </div>
      <div className="news-box">
        <Divider contentPosition="left">12月23日</Divider>
        <div className="list">
          <NewsItem></NewsItem>
          <NewsItem></NewsItem>
          <NewsItem></NewsItem>
        </div>
      </div>
      {/* 加载更多 */}
      <div className="loadmore-box">
        加载更多
        <DotLoading></DotLoading>
      </div>
    </div>
  );
};
export default Home;
