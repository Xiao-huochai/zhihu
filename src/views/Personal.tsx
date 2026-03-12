import { Link } from "react-router-dom";
import { RightOutline } from "antd-mobile-icons";
import NavBarAgain from "../components/NavBarAgain";
import _ from "../assets/utils";
import { Toast } from "antd-mobile";
import { useAppDispatch, useAppSelector } from "../hooks";
import { clearUserInfo } from "../store/features/baseSlice";
import { clearStoreList } from "../store/features/storeSlice";
import type { RootState } from "../store";
import "./Personal.less";

const Personal = function Personal(props: any) {
  const { navigate } = props;
  const dispatch = useAppDispatch();
  const { info } = useAppSelector((state: RootState) => state.base);
  // 退出登录
  const signout = () => {
    // 清除redux中的信息
    dispatch(clearUserInfo());
    dispatch(clearStoreList());
    // 清除Token
    _.storage.remove("tk");
    // 提示
    Toast.show({
      icon: "success",
      content: "您已安全退出",
    });
    // 跳转
    navigate("/login?to=/personal", { replace: true });
  };
  return (
    <div className="personalBox">
      <NavBarAgain title="个人中心" />
      <div className="baseInfo">
        <Link to="/update">
          <img className="pic" src={info?.pic} alt="" />
          <p className="name">{info?.name}</p>
        </Link>
      </div>
      <div>
        <Link to="/store" className="tab">
          我的收藏
          <RightOutline />
        </Link>
        <div className="tab" onClick={signout}>
          退出登录
          <RightOutline />
        </div>
      </div>
    </div>
  );
};
export default Personal;
