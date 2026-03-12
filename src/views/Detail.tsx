import "./Detai.less";
import {
  LeftOutline,
  MessageOutline,
  StarOutline,
  LikeOutline,
  MoreOutline,
} from "antd-mobile-icons";
import { Badge, Toast } from "antd-mobile";
// import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import type { NewsDetailType, NewsStoryExtraType } from "../api";
import Page404 from "./Page404";
import SkeletonAgain from "../components/SkeletonAgain";
import api from "../api";
import { flushSync } from "react-dom";
import { useAppDispatch, useAppSelector } from "../hooks";
import { queryUserInfo } from "../store/features/baseSlice";
import { replace } from "react-router-dom";
const Detail = function Detail(props: any) {
  let { navigate, params, location } = props; //location有当前路径
  console.log(location);

  const dispatch = useAppDispatch();
  // const navigate = useNavigate(),
  // params = useParams();
  if (params.id === undefined || null) return <Page404 />;
  let [info, setInfo] = useState<NewsDetailType>(),
    [extra, setExtra] = useState<NewsStoryExtraType>();
  // 第一次渲染完毕获取数据
  let link: null | HTMLLinkElement = null;
  const handleStyle = (css: string[]) => {
    if (!css[0]) return;
    link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = css[0];
    document.head.appendChild(link);
  };
  // 获取顶部图片
  const handleImage = (image: string) => {
    let imgPlaceHolder = document.querySelector(".img-place-holder");
    if (!imgPlaceHolder) return;
    let tempImg = new Image();
    tempImg.src = image;
    tempImg.onload = () => {
      imgPlaceHolder.appendChild(tempImg);
    };
    tempImg.onerror = () => {
      let parent = imgPlaceHolder.parentNode;
      parent?.parentNode?.removeChild(parent);
    };
  };
  useEffect(() => {
    // 获取对应新闻信息
    (async () => {
      try {
        let result = await api.queryNewsInfo(params.id);
        flushSync(() => {
          setInfo(result);
          handleStyle(result.css);
        });
        // 由于顶部图片的html 是异步加入的因此需要加flushSync立即渲染一次 否则handleImage得不到对应的div元素
        handleImage(result.image);
      } catch (error) {
        console.log(error);
      }
    })();
    return () => {
      // 销毁其css防止对全局的样式产生污染
      if (link) document.head.removeChild(link);
    };
  }, []);
  useEffect(() => {
    // 获取点赞评论等
    (async () => {
      try {
        let result = await api.queryStoryExtra(params.id);
        setExtra(result);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);
  let { base, store } = useAppSelector((state) => state);
  // 一下是登录收藏的逻辑
  useEffect(() => {
    if (!base.info) dispatch(queryUserInfo());
  }, []);
  const handleStore = () => {
    if (!base.info) {
      Toast.show({
        icon: "fail",
        content: "请先登录",
      });
      navigate(`/login?to=${location.pathname}`, { replace: true });
    }
  };
  return (
    <div className="detail-box">
      {/* 内容 */}

      {!info ? (
        <SkeletonAgain></SkeletonAgain>
      ) : (
        <div
          className="content"
          dangerouslySetInnerHTML={{ __html: info.body }}
        ></div>
      )}
      {/* 底部图标 */}
      <div className="tab-bar">
        <div className="back" onClick={() => navigate(-1)}>
          <LeftOutline></LeftOutline>
        </div>
        <div className="icons">
          <Badge content={extra ? extra.comments : 0}>
            <MessageOutline></MessageOutline>
          </Badge>
          <Badge content={extra ? extra.popularity : 0}>
            <LikeOutline></LikeOutline>
          </Badge>
          <span onClick={handleStore}>
            <StarOutline></StarOutline>
          </span>
          <span>
            <MoreOutline></MoreOutline>
          </span>
        </div>
      </div>
    </div>
  );
};
export default Detail;
