import { useEffect } from "react";
import { Toast } from "antd-mobile";
import styled from "styled-components";
import NavBarAgain from "../components/NavBarAgain";
import NewsItem from "../components/NewsItem";
import SkeletonAgain from "../components/SkeletonAgain";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  removeStoreAsync,
  removeTargetNews,
} from "../store/features/storeSlice";
import { getStoreListAsync } from "../store/features/storeSlice";
import "./Store.less";
/* 样式 */
const StoreBox = styled.div`
  .box {
    padding: 30px;
  }
`;

const Store = function Store() {
  const dispatch = useAppDispatch();
  const { data: storeList } = useAppSelector((state) => state.store);
  useEffect(() => {
    // 第一次加载完毕:如果redux中没有收藏列表,则异步派发获取
    if (storeList.length === 0) dispatch(getStoreListAsync());
  }, []);

  return (
    <div className="storeBox">
      <NavBarAgain title="我的收藏" />
      {storeList ? (
        <>
          {storeList.map((item) => {
            let { id, news } = item;
            return <NewsItem story={news} key={id} />;
          })}
        </>
      ) : (
        <SkeletonAgain />
      )}
    </div>
  );
};
export default Store;
