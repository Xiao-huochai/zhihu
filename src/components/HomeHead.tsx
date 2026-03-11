import timg from "../assets/images/timg.jpg";
import { useEffect, useMemo } from "react";
import "./HomeHead.less";
import { useAppSelector, useAppDispatch } from "../hooks";
import { queryUserInfo } from "../store/features/baseSlice";
import { useNavigate } from "react-router-dom";
type HomeHeadProps = {
  today: string; // 明确 today 是必填的字符串类型
  // title?: string; // 可选字符串类型
};
const HomeHead = function HomeHead(props: HomeHeadProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  /* 计算时间中的月和日 */
  let { today } = props;
  const { info } = useAppSelector((state) => state.base);
  let time = useMemo(() => {
    let [, month, day] = today.match(
        /^\d{4}(\d{2})(\d{2})$/,
      ) as RegExpExecArray,
      area = [
        "零",
        "一",
        "二",
        "三",
        "四",
        "五",
        "六",
        "七",
        "八",
        "九",
        "十",
        "十一",
        "十二",
      ];
    return {
      month: area[+month] + "月",
      day,
    };
  }, [today]);
  // 第一次渲染完:如果info中没有信息 就尝试派发一次 获取登录者的信息
  useEffect(() => {
    if (!info) {
      dispatch(queryUserInfo());
    }
  }, []);
  const toPersonal = () => {
    navigate("/personal");
  };
  return (
    <header className="home-head-box">
      <div className="info">
        <div className="time">
          <span>{time.day}</span>
          <span>{time.month}</span>
        </div>
        <h2 className="title">咕咕嘎嘎</h2>
      </div>
      <div className="avater" onClick={toPersonal}>
        <img src={info ? info.pic : timg} alt="" />
      </div>
    </header>
  );
};
export default HomeHead;
