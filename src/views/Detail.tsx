import "./Detai.less";
import {
  LeftOutline,
  MessageOutline,
  StarOutline,
  LikeOutline,
  MoreOutline,
} from "antd-mobile-icons";
import { Badge } from "antd-mobile";
import { useNavigate } from "react-router-dom";

const Detail = function Detail() {
  const navigate = useNavigate();
  return (
    <div className="detail-box">
      {/* 内容 */}
      <div className="content"></div>
      {/* 底部图标 */}
      <div className="tab-bar">
        <div className="back" onClick={() => navigate(-1)}>
          <LeftOutline></LeftOutline>
        </div>
        <div className="icons">
          <Badge content="128">
            <MessageOutline></MessageOutline>
          </Badge>
          <Badge content="29">
            <LikeOutline></LikeOutline>
          </Badge>
          <span>
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
