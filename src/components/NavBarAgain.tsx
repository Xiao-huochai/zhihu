import { NavBar } from "antd-mobile";
type navBarAgain = {
  title: string;
};

export default function NavBarAgain(props: navBarAgain) {
  let { title = "默认标题" } = props;
  return <NavBar className="navbar-again-box">{title}</NavBar>;
}
