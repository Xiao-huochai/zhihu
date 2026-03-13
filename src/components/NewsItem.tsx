import { Link } from "react-router-dom";
import { Image } from "antd-mobile";
import { type StoryType } from "../api";
import "./NewsItem.less";

type SimpleNewsType = {
  id: string | number;
  title: string;
  image: string;
};

type Props = {
  story: StoryType | SimpleNewsType;
};

export default function NewsItem({ story }: Props) {
  if (!story) return null;

  const image =
    "images" in story
      ? Array.isArray(story.images)
        ? story.images[0]
        : ""
      : story.image;

  const hint = "hint" in story ? story.hint : "";

  return (
    <div className="news-item-box">
      <Link to={`/detail/${story.id}`}>
        <div className="content">
          <h4 className="title">{story.title}</h4>
          {hint ? <div className="author">{hint}</div> : null}
        </div>
        <Image src={image} lazy />
      </Link>
    </div>
  );
}
