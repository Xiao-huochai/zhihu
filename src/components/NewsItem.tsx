import { Link } from "react-router-dom";
import { Image } from "antd-mobile";
import { type StoryType } from "../api";
import "./NewsItem.less";
export default function NewsItem(story: StoryType) {
  if (!story) return null;
  if (!Array.isArray(story.images)) story.images = [""];
  return (
    <div className="news-item-box">
      <Link to={{ pathname: `/detail/${story.id}` }}>
        <div className="content">
          <h4 className="title">{story.title}</h4>
          <div className="author">{story.hint}</div>
        </div>
        <Image src={story.images[0]} lazy></Image>
      </Link>
    </div>
  );
}
