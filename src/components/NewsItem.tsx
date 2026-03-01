import { Link } from "react-router-dom";
import { Image } from "antd-mobile";
import "./NewsItem.less";
export default function NewsItem() {
  return (
    <div className="news-item-box">
      <Link to={{ pathname: "/detail/xxx" }}>
        <div className="content">
          <h4 className="title">
            oioi你所热爱的就是你oioi你所热爱的就是你的生活oioioioioioioio的生活oioioioioioioio
          </h4>
          <div className="author">hajimi</div>
        </div>
        <Image
          src="https://picx.zhimg.com/v2-e59aec8b594d46307317406b09ad4243.jpg?source=8673f162"
          lazy
        ></Image>
      </Link>
    </div>
  );
}
