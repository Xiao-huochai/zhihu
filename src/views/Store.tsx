import { useEffect } from "react";
import { Toast } from "antd-mobile";
import NavBarAgain from "../components/NavBarAgain";
import NewsItem from "../components/NewsItem";
import SkeletonAgain from "../components/SkeletonAgain";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  removeStoreAsync,
  removeTargetNews,
  getStoreListAsync,
} from "../store/features/storeSlice";
import { StarOutline } from "antd-mobile-icons";
import "./Store.less";

const Store = function Store() {
  const dispatch = useAppDispatch();
  const { data: storeList } = useAppSelector((state) => state.store);

  useEffect(() => {
    if (storeList.length === 0) dispatch(getStoreListAsync());
  }, [dispatch, storeList.length]);

  const handleRemove = async (id: string | number) => {
    try {
      dispatch(removeTargetNews(id));
      await dispatch(removeStoreAsync({ id })).unwrap();

      Toast.show({
        icon: "success",
        content: "取消收藏成功",
      });
    } catch (err) {
      Toast.show({
        icon: "fail",
        content: "取消收藏失败",
      });
      dispatch(getStoreListAsync());
    }
  };

  return (
    <div className="storeBox">
      <NavBarAgain title="我的收藏" />
      {storeList.length > 0 ? (
        storeList.map((item) => {
          const { id, news } = item;
          return (
            <div className="stored-item" key={id}>
              <NewsItem story={news} />
              <StarOutline
                className="stored"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(id);
                }}
              />
            </div>
          );
        })
      ) : (
        <SkeletonAgain />
      )}
    </div>
  );
};

export default Store;
