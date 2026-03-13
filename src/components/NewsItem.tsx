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
  //第一步检查story对象中是否有images这个属性
  // 如果有是否是数组 如果是数组去第一个元素作为image的值 不是则赋值为空 如果story中没有iamges属性就取story.image的值
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
